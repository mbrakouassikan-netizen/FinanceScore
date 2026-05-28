import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, type, objectif, montantCible, nomObjectif } = body
    if (!email || !email.includes('@') || email.length > 500) {
      return NextResponse.json({ error: 'email invalide' }, { status: 400 })
    }
    if (!type || !montantCible) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }
    const defi = {
      type,
      objectif: objectif ?? type,
      montantCible: Number(montantCible),
      montantEpargne: 0,
      semainesCompletees: [],
      dateDebut: new Date().toISOString(),
      nomObjectif: nomObjectif ?? '',
    }
    const key = `user:${email}:defi:actif`
    await redis.set(key, JSON.stringify(defi))
    return NextResponse.json({ success: true, defi })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
