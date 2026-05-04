import { NextRequest, NextResponse } from 'next/server';
import { PayhipServerService } from '@/lib/payhip-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, score } = body;

    if (!email || !name || !score) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    // Créer le lien Payhip avec champs personnalisés
    const payhipUrl = 'https://payhip.com/b/53DCE';
    
    // Pour l'instant, on retourne simplement le lien Payhip
    // TODO: Implémenter la création de lien personnalisé si nécessaire
    return NextResponse.json({ 
      success: true, 
      paymentLink: payhipUrl 
    });
  } catch (error) {
    console.error('❌ Erreur création lien paiement:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
