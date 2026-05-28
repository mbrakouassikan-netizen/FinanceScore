import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, semaine, montant } = body
    if (!email || !email.includes('@') || email.length > 500) {
      return NextResponse.json({ error: 'email invalide' }, { status: 400 })
    }
    if (typeof semaine !== 'number' || typeof montant !== 'number') {
      return NextResponse.json({ error: 'semaine et montant requis' }, { status: 400 })
    }

    const key = `user:${email}:defi:actif`
    const raw = await redis.get<string>(key)
    if (!raw) return NextResponse.json({ error: 'Aucun défi actif' }, { status: 404 })

    const defi = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!defi.semainesCompletees.includes(semaine)) {
      defi.semainesCompletees.push(semaine)
      defi.montantEpargne = (defi.montantEpargne ?? 0) + montant
    }

    const totalPeriodes = defi.type === 'mensuel' || defi.type === 'transfert' ? 12 : defi.type === 'immo' ? 24 : 52
    const isComplete = defi.semainesCompletees.length >= totalPeriodes

    if (isComplete) {
      await redis.del(key)
      const completedKey = `user:${email}:defis:completes`
      const record = JSON.stringify({
        ...defi,
        dateCompletion: new Date().toISOString(),
      })
      await redis.rpush(completedKey, record)
    } else {
      await redis.set(key, JSON.stringify(defi))
    }

    return NextResponse.json({ success: true, defi, isComplete })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
