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
  custom_fields?: {
    score?: number;
    [key: string]: any;
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
      console.error('PAYHIP_WEBHOOK_SECRET non configuré');
      return false;
    }

    // Payhip utilise HMAC-SHA256 pour la vérification
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(signature, expectedSignature);
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
        
        // Optionnel: Sauvegarder dans un système externe (si nécessaire)
        // Note: Google Sheets a été supprimé du projet
      }
    } catch (error) {
      console.error('Erreur traitement webhook Payhip:', error);
      throw error;
    }
  }

  // Helper pour déterminer le niveau en fonction du score
  private getNiveau(score: number): { label: string; description: string } {
    if (score >= 90) return { label: 'Expert', description: 'Excellente santé financière' };
    if (score >= 75) return { label: 'Avancé', description: 'Bonne santé financière' };
    if (score >= 50) return { label: 'Intermédiaire', description: 'Santé financière moyenne' };
    return { label: 'Débutant', description: 'Santé financière à améliorer' };
  }
}
