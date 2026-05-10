// lib/payhip-server.ts - Version complète côté serveur uniquement

export interface PayhipWebhookPayload {
  event: 'paid' | 'refunded';
  data: {
    sale_id: string;
    product_id: string;
    product_name: string;
    currency: string;
    amount: number;
    fee: number;
    total: number;
    email: string;
    full_name: string;
    custom_fields?: Record<string, string>;
  };
}

export class PayhipServerService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.PAYHIP_API_KEY || '';
  }

  // Vérifier la signature du webhook Payhip
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const secret = process.env.PAYHIP_WEBHOOK_SECRET || '';
    if (!secret) {
      console.warn('⚠️ PAYHIP_WEBHOOK_SECRET non configuré - webhook accepté sans vérification');
      return true;
    }
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    return signature === expectedSignature;
  }

  // Traiter le webhook Payhip
  async processWebhook(payload: PayhipWebhookPayload): Promise<void> {
    try {
      console.log('🔔 Webhook Payhip reçu:', payload);

      if (payload.event === 'paid') {
        // Paiement réussi - envoyer l'email premium
        const { sendPremiumEmail } = await import('./brevo');
        
        // Extraire le score depuis les champs personnalisés si disponible
        const score = parseInt(payload.data.custom_fields?.custom_score || payload.data.custom_fields?.score || '0', 10);
        
        await sendPremiumEmail({
          email: payload.data.email,
          prenom: payload.data.full_name?.split(' ')[0] || 'là',
          score: score,
        });

        console.log('✅ Email premium envoyé pour:', payload.data.email);
        
        // Optionnel: Sauvegarder dans Google Sheets
        if (process.env.GOOGLE_SHEET_ID && typeof window === 'undefined') {
          try {
            const { googleSheetsService } = await import('./googleSheets');
            await googleSheetsService.setupSheet();
            
            const userData = {
              name: payload.data.full_name || '',
              email: payload.data.email,
              score: score,
              percentage: Math.round(score),
              niveau: this.getNiveau(score).label,
              timestamp: new Date().toISOString(),
              pillarScores: {
                'Revenus & Dépenses': 0,
                'Épargne': 0,
                'Dettes': 0,
                'Diaspora & Famille': 0,
                'Investissement': 0,
                'Vision & Objectifs': 0,
              },
            };

            await googleSheetsService.addUser(userData);
            console.log('✅ Données premium sauvegardées dans Google Sheets');
          } catch (error) {
            console.warn('⚠️ Google Sheets non disponible:', error);
          }
        }
      } else if (payload.event === 'refunded') {
        console.log('💰 Remboursement pour:', payload.data.email);
      }
    } catch (error) {
      console.error('❌ Erreur traitement webhook Payhip:', error);
      throw error;
    }
  }

  // Obtenir le niveau à partir du score
  private getNiveau(score: number) {
    if (score <= 39) return {
      key: "urgence", label: "🔴 Urgence Financière",
      message: "Ta situation demande une action immédiate.",
    };
    if (score <= 59) return {
      key: "fragile", label: "🟠 Finances Fragiles",
      message: "Tu as les bases, mais ta situation reste vulnérable.",
    };
    if (score <= 79) return {
      key: "progression", label: "🟡 En Bonne Progression",
      message: "Tu gères bien l'essentiel.",
    };
    return {
      key: "solide", label: "🟢 Finances Solides",
      message: "Félicitations ! Tu maîtrises tes finances.",
    };
  }

  // Créer un lien de paiement avec champs personnalisés
  createPaymentLink(productUrl: string, customFields?: Record<string, any>): string {
    if (customFields && Object.keys(customFields).length > 0) {
      // Ajouter les champs personnalisés comme paramètres URL
      const params = new URLSearchParams();
      Object.entries(customFields).forEach(([key, value]) => {
        params.append(`custom_${key}`, value.toString());
      });
      return `${productUrl}?${params.toString()}`;
    }
    return productUrl;
  }
}

// Export du service serveur
export const payhipServerService = new PayhipServerService();
