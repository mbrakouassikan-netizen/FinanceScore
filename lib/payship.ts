// lib/payship.ts

export interface PayshipProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
}

export interface PayshipPaymentData {
  product_id: string;
  customer_email: string;
  customer_name: string;
  amount: number;
  currency: string;
  success_url: string;
  cancel_url: string;
  webhook_url: string;
  metadata?: Record<string, any>;
}

export interface PayshipWebhookPayload {
  event: 'payment.completed' | 'payment.failed' | 'payment.pending';
  payment_id: string;
  product_id: string;
  customer_email: string;
  customer_name: string;
  amount: number;
  currency: string;
  status: 'completed' | 'failed' | 'pending';
  metadata?: Record<string, any>;
  created_at: string;
}

export class PayshipService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.PAYSHIP_API_KEY || '';
    this.baseUrl = 'https://api.payship.co/v1';
  }

  // Créer un lien de paiement
  async createPaymentLink(paymentData: PayshipPaymentData): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`Payship API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.payment_url;
    } catch (error) {
      console.error('Erreur création paiement Payship:', error);
      throw error;
    }
  }

  // Vérifier le statut d'un paiement
  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Payship API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur vérification statut Payship:', error);
      throw error;
    }
  }

  // Créer un lien de paiement pour FinanceScore Premium
  async createPremiumPayment(
    customerEmail: string,
    customerName: string,
    score: number,
    returnUrl: string
  ): Promise<string> {
    const paymentData: PayshipPaymentData = {
      product_id: 'financescore-premium',
      customer_email: customerEmail,
      customer_name: customerName,
      amount: 4.99,
      currency: 'EUR',
      success_url: `${returnUrl}?success=true&payment_id={{payment_id}}`,
      cancel_url: `${returnUrl}?success=false`,
      webhook_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payship/webhook`,
      metadata: {
        score: score,
        product_name: 'FinanceScore Premium',
        customer_email: customerEmail,
        customer_name: customerName,
      },
    };

    return this.createPaymentLink(paymentData);
  }

  // Vérifier la signature du webhook
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const secret = process.env.PAYSHIP_WEBHOOK_SECRET || '';
    
    if (!secret) {
      console.error('PAYSHIP_WEBHOOK_SECRET non configuré');
      return false;
    }

    // Implémentation simple de vérification HMAC
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  }

  // Traiter le webhook Payship
  async processWebhook(payload: PayshipWebhookPayload): Promise<void> {
    try {
      console.log('🔔 Webhook Payship reçu:', payload);

      if (payload.event === 'payment.completed') {
        // Paiement réussi - envoyer l'email premium
        const { sendPremiumEmail } = await import('./brevo');
        
        await sendPremiumEmail({
          email: payload.customer_email,
          prenom: payload.customer_name?.split(' ')[0] || 'là',
          score: payload.metadata?.score || 0,
        });

        console.log('✅ Email premium envoyé pour:', payload.customer_email);
        
        // Optionnel: Sauvegarder dans un système externe (si nécessaire)
      } else if (payload.event === 'payment.failed') {
        console.log('❌ Paiement échoué pour:', payload.customer_email);
      }
    } catch (error) {
      console.error('❌ Erreur traitement webhook Payship:', error);
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
}

// Export du service
export const payshipService = new PayshipService();
