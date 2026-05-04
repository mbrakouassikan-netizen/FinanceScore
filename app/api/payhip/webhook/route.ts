import { NextRequest, NextResponse } from 'next/server';
import { payhipServerService, PayhipWebhookPayload } from '@/lib/payhip-server';

export async function POST(req: NextRequest) {
  try {
    // Récupérer le corps de la requête
    const body = await req.text();
    const signature = req.headers.get('x-payhip-signature');

    // Vérifier la signature du webhook
    if (!signature || !payhipServerService.verifyWebhookSignature(body, signature)) {
      console.error('❌ Signature webhook Payhip invalide');
      return NextResponse.json(
        { error: 'Signature invalide' },
        { status: 401 }
      );
    }

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
