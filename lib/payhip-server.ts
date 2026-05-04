// lib/payhip-server.ts - Version complète côté serveur uniquement

export interface PayhipWebhookPayload {
  event: 'sale.created' | 'sale.completed' | 'sale.refunded';
  sale_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  currency: string;
  buyer_email: string;
  buyer_name: string;
  quantity: number;
  total: number;
  fee: number;
  net: number;
  custom_fields?: Record<string, any>;
  created_at: string;
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
      console.error('PAYHIP_WEBHOOK_SECRET non configuré');
      return false;
    }

    // Payhip utilise HMAC-SHA256 pour la vérification
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

      if (payload.event === 'sale.completed') {
        // Paiement réussi - envoyer l'email premium
        const { sendPremiumEmail } = await import('./brevo');
        
        // Extraire le score depuis les champs personnalisés si disponible
        const score = payload.custom_fields?.score || 0;
        
        await sendPremiumEmail({
          email: payload.buyer_email,
          prenom: payload.buyer_name?.split(' ')[0] || 'là',
          score: score,
        });

        console.log('✅ Email premium envoyé pour:', payload.buyer_email);
        
        // Optionnel: Sauvegarder dans Google Sheets
        if (process.env.GOOGLE_SHEET_ID && typeof window === 'undefined') {
          try {
            const { googleSheetsService } = await import('./googleSheets');
            await googleSheetsService.setupSheet();
            
            const userData = {
              name: payload.buyer_name || '',
              email: payload.buyer_email,
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
      } else if (payload.event === 'sale.created') {
        console.log('📝 Vente créée pour:', payload.buyer_email);
      } else if (payload.event === 'sale.refunded') {
        console.log('💰 Remboursement pour:', payload.buyer_email);
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
