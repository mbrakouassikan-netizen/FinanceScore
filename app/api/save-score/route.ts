import { NextRequest, NextResponse } from 'next/server';

// Store global pour sauvegarder les scores par email
const scoreStore = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, score } = body;

    if (!email || score === undefined) {
      return NextResponse.json(
        { error: 'Email et score requis' },
        { status: 400 }
      );
    }

    // Sauvegarder le score pour cet email
    scoreStore.set(email, score);
    
    console.log('💾 Score sauvegardé:', { email, score });
    console.log('📊 Store actuel:', Array.from(scoreStore.entries()));

    return NextResponse.json({ 
      success: true, 
      message: 'Score sauvegardé avec succès',
      email,
      score
    });
  } catch (error) {
    console.error('❌ Erreur sauvegarde score:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'Save score endpoint',
    status: 'active',
    timestamp: new Date().toISOString(),
    storedScores: Array.from(scoreStore.entries())
  });
}
