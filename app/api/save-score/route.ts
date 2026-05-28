import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  try {
    const { email, score } = await req.json();

    if (!email || score === undefined) {
      return NextResponse.json(
        { error: 'Email et score requis' },
        { status: 400 }
      );
    }
    if (typeof email !== 'string' || email.length > 500 || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return NextResponse.json({ error: 'Score invalide (doit être entre 0 et 100)' }, { status: 400 });
    }

    // Sauvegarder le score dans Upstash Redis avec expiration de 1h
    const key = `score:${email}`;
    await redis.set(key, score, { ex: 3600 });
    
    console.log('💾 Score sauvegardé dans Upstash Redis:', { email, score, key });

    return NextResponse.json({ 
      success: true, 
      message: 'Score sauvegardé avec succès dans Upstash Redis',
      email,
      score,
      expiresIn: 3600 // 1 heure
    });
  } catch (error) {
    console.error('❌ Erreur sauvegarde score Upstash Redis:', error);
    return NextResponse.json(
      { error: 'Erreur serveur Upstash Redis' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Vérifier la connexion Upstash Redis
    await redis.ping();
    
    return NextResponse.json({
      message: 'Save score Upstash Redis endpoint',
      status: 'active',
      timestamp: new Date().toISOString(),
      redisConnected: true
    });
  } catch (error) {
    console.error('❌ Erreur connexion Upstash Redis:', error);
    return NextResponse.json(
      { error: 'Erreur connexion Upstash Redis' },
      { status: 500 }
    );
  }
}
