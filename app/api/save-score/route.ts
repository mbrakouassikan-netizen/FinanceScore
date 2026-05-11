import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

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

    // Sauvegarder le score dans Vercel KV avec expiration de 1h
    const key = `score:${email}`;
    await kv.set(key, score, { ex: 3600 });
    
    console.log('💾 Score sauvegardé dans KV:', { email, score, key });

    return NextResponse.json({ 
      success: true, 
      message: 'Score sauvegardé avec succès dans KV',
      email,
      score,
      expiresIn: 3600 // 1 heure
    });
  } catch (error) {
    console.error('❌ Erreur sauvegarde score KV:', error);
    return NextResponse.json(
      { error: 'Erreur serveur KV' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Vérifier la connexion KV
    await kv.ping();
    
    return NextResponse.json({
      message: 'Save score KV endpoint',
      status: 'active',
      timestamp: new Date().toISOString(),
      kvConnected: true
    });
  } catch (error) {
    console.error('❌ Erreur connexion KV:', error);
    return NextResponse.json(
      { error: 'Erreur connexion KV' },
      { status: 500 }
    );
  }
}
