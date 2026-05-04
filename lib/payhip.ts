// lib/payhip.ts - Version simplifiée côté client uniquement
// Note: Pour la logique complète côté serveur, utiliser lib/payhip-server.ts

// Types exportés pour compatibilité
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

// Classe simplifiée côté client - utilise les API routes pour la logique serveur
export class PayhipService {
  // Cette classe est conservée pour compatibilité mais n'a pas de logique côté client
  // Toute la logique est déplacée dans les API routes et lib/payhip-server.ts
  
  createPaymentLink(productUrl: string, customFields?: Record<string, any>): string {
    // Cette méthode est conservée pour compatibilité mais ne devrait pas être utilisée côté client
    console.warn('⚠️ PayhipService.createPaymentLink ne devrait pas être utilisé côté client. Utilisez /api/payhip/payment-link à la place.');
    
    if (customFields && Object.keys(customFields).length > 0) {
      const params = new URLSearchParams();
      Object.entries(customFields).forEach(([key, value]) => {
        params.append(`custom_${key}`, value.toString());
      });
      return `${productUrl}?${params.toString()}`;
    }
    return productUrl;
  }
}

// Export du service (compatibilité)
export const payhipService = new PayhipService();
