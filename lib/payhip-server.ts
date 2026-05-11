// lib/payhip-server.ts - Version complète côté serveur uniquement

// Store global pour sauvegarder les scores par email
const scoreStore = new Map<string, number>();

export interface PayhipWebhookPayload {
  event?: 'paid' | 'refunded';
  type?: 'paid' | 'refunded';
  email?: string;
  buyer_email?: string;
  name?: string;
  buyer_name?: string;
  sale_id?: string;
  product_id?: string;
  product_name?: string;
  currency?: string;
  amount?: number;
  fee?: number;
  total?: number;
  full_name?: string;
  custom_fields?: Record<string, string>;
  custom_score?: string;
  custom_email?: string;
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

      if (payload.type === 'paid' || payload.event === 'paid') {
        // Paiement réussi - envoyer l'email premium
        const { sendPremiumEmail } = await import('./brevo');
        
        // Extraire email et nom avec fallbacks
        const email = payload.email || payload.buyer_email || '';
        const name = payload.name || payload.buyer_name || '';
        
        // Récupérer le score depuis les paramètres personnalisés Payhip
        const score = parseInt(payload.custom_score || payload.custom_fields?.custom_score || '0', 10);
        
        console.log('📧 Tentative envoi email premium à:', email);
        console.log('🎯 Score extrait:', score);
        console.log('📊 Niveau:', this.getNiveau(score));
        
        await sendPremiumEmail({
          email: email,
          prenom: name?.split(' ')[0] || 'là',
          score: score,
        });

        console.log('✅ Email premium envoyé pour:', email);
        
        // Optionnel: Sauvegarder dans Google Sheets
        if (process.env.GOOGLE_SHEET_ID && typeof window === 'undefined') {
          try {
            const { googleSheetsService } = await import('./googleSheets');
            await googleSheetsService.setupSheet();
            
            const userData = {
              name: name || '',
              email: email,
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
      } else if (payload.event === 'refunded' || payload.type === 'refunded') {
        const refundEmail = payload.email || payload.buyer_email || '';
        console.log('💰 Remboursement pour:', refundEmail);
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
