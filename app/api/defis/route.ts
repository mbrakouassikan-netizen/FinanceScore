import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 500) {
    return NextResponse.json({ error: 'email invalide' }, { status: 400 })
  }
  try {
    const key = `user:${email}:defi:actif`
    const defi = await redis.get(key)
    const completedKey = `user:${email}:defis:completes`
    const completes = await redis.lrange(completedKey, 0, -1)
    return NextResponse.json({ success: true, defi: defi ?? null, completes })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
