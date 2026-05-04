import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Récupérer le corps de la requête
    const body = await req.text();
    const signature = req.headers.get('x-payhip-signature');

    // Pour l'instant, on retourne simplement succès
    // TODO: Implémenter la vérification du webhook plus tard
    console.log('🔔 Webhook Payhip reçu (non vérifié):', body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur webhook Payhip:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
