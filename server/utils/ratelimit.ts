import type { H3Event } from 'h3'
import { getRequestIP, createError } from 'h3'

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export function rateLimit(event: H3Event, key: string, max: number, windowSec: number): void {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const fullKey = `${key}:${ip}`
  const now = Date.now()
  const bucket = buckets.get(fullKey)

  if (!bucket || bucket.resetAt < now) {
    buckets.set(fullKey, { count: 1, resetAt: now + windowSec * 1000 })
    return
  }

  bucket.count++
  if (bucket.count > max) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000)
    throw createError({
      statusCode: 429,
      statusMessage: `Te veel pogingen. Probeer opnieuw over ${retryAfter}s`
    })
  }
}

// Periodic cleanup to prevent unbounded growth
setInterval(() => {
  const now = Date.now()
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key)
  }
}, 60_000).unref?.()
