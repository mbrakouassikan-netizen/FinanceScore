import { NextRequest, NextResponse } from 'next/server';
import { payhipServerService, PayhipWebhookPayload } from '@/lib/payhip-server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // Récupérer le corps de la requête
    const body = await req.text();
    const signature = req.headers.get('x-payhip-signature');

    const webhookSecret = process.env.PAYHIP_WEBHOOK_SECRET;
    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json({ error: 'Signature manquante' }, { status: 401 });
      }
      const expectedSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');
      if (signature !== expectedSig) {
        console.warn('❌ Signature Payhip invalide');
        return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
      }
    }
    console.log('✅ Webhook Payhip reçu - traitement en cours');

    // Parser le payload
    const payload: PayhipWebhookPayload = JSON.parse(body);

    // Traiter le webhook
    await payhipServerService.processWebhook(payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur webhook Payhip:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: 'Payhip webhook endpoint',
    status: 'active',
    timestamp: new Date().toISOString()
  });
}
