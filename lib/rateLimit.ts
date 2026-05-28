import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const redis = Redis.fromEnv()

export async function rateLimit(
  req: NextRequest,
  route: string,
  maxRequests: number
): Promise<NextResponse | null> {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      '127.0.0.1'

    const key = `rate_limit:${route}:${ip}`
    const count = await redis.incr(key)

    if (count === 1) {
      await redis.expire(key, 3600)
    }

    if (count > maxRequests) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessaie dans quelques minutes.' },
        { status: 429 }
      )
    }
  } catch {
    // Fail open — allow request if Redis unavailable
  }

  return null
}
