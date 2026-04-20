import { randomInt, randomBytes, createHash, timingSafeEqual } from 'node:crypto'
import { useRuntimeConfig } from '#imports'

export function generateCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0')
}

export function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export function hashCode(code: string): string {
  const { authSecret } = useRuntimeConfig()
  return createHash('sha256').update(code + authSecret).digest('hex')
}

export function verifyCode(code: string, expectedHash: string): boolean {
  const actual = Buffer.from(hashCode(code), 'hex')
  let expected: Buffer
  try {
    expected = Buffer.from(expectedHash, 'hex')
  } catch {
    return false
  }
  if (actual.length !== expected.length) return false
  return timingSafeEqual(actual, expected)
}
