import { NextRequest, NextResponse } from 'next/server';
import { payshipService, PayshipWebhookPayload } from '@/lib/payship';

export async function POST(req: NextRequest) {
  try {
    // Récupérer le corps de la requête
    const body = await req.text();
    const signature = req.headers.get('x-payship-signature');

    // Vérifier la signature du webhook
    if (!signature || !payshipService.verifyWebhookSignature(body, signature)) {
      console.error('❌ Signature webhook invalide');
      return NextResponse.json(
        { error: 'Signature invalide' },
        { status: 401 }
      );
    }

    // Parser le payload
    const payload: PayshipWebhookPayload = JSON.parse(body);

    // Traiter le webhook
    await payshipService.processWebhook(payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur webhook Payship:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: 'Payship webhook endpoint',
    status: 'active',
    timestamp: new Date().toISOString()
  });
}
