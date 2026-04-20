import bcrypt from 'bcrypt'
import type { H3Event } from 'h3'
import { getCookie, setCookie, deleteCookie, createError } from 'h3'
import { query } from './db'
import type { RowDataPacket } from 'mysql2/promise'

const COOKIE_NAME = 'session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const BCRYPT_ROUNDS = 10

export type Role = 'student' | 'teacher'
export interface SessionPayload {
  id: number
  role: Role
  exp: number
}

export interface SessionUser {
  id: number
  role: Role
  first_name: string
  last_name: string
  email: string
  profile_picture: string
  theme_color: string
  student_number?: number
  abbreviation_teacher?: string
}

function base64urlEncode(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function base64urlDecode(s: string): Buffer {
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return Buffer.from(s, 'base64')
}

async function hmac(data: string, secret: string): Promise<string> {
  const { createHmac } = await import('node:crypto')
  return base64urlEncode(createHmac('sha256', secret).update(data).digest())
}

async function signSession(payload: SessionPayload, secret: string): Promise<string> {
  const body = base64urlEncode(Buffer.from(JSON.stringify(payload), 'utf8'))
  const sig = await hmac(body, secret)
  return `${body}.${sig}`
}

async function verifySession(token: string, secret: string): Promise<SessionPayload | null> {
  const dot = token.lastIndexOf('.')
  if (dot < 0) return null
  const body = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = await hmac(body, secret)
  const { timingSafeEqual } = await import('node:crypto')
  try {
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }
  try {
    const decoded = JSON.parse(base64urlDecode(body).toString('utf8')) as SessionPayload
    if (!decoded || typeof decoded.id !== 'number' || typeof decoded.exp !== 'number') return null
    if (decoded.exp < Math.floor(Date.now() / 1000)) return null
    if (decoded.role !== 'student' && decoded.role !== 'teacher') return null
    return decoded
  } catch {
    return null
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS)
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  return bcrypt.compare(plain, stored)
}

export async function createSession(event: H3Event, id: number, role: Role): Promise<void> {
  const config = useRuntimeConfig()
  const payload: SessionPayload = {
    id,
    role,
    exp: Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE
  }
  const token = await signSession(payload, config.authSecret)
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
    maxAge: COOKIE_MAX_AGE
  })
}

export function destroySession(event: H3Event): void {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

export async function readSession(event: H3Event): Promise<SessionPayload | null> {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) return null
  const config = useRuntimeConfig()
  return verifySession(token, config.authSecret)
}

export async function loadUser(session: SessionPayload): Promise<SessionUser | null> {
  if (session.role === 'student') {
    const rows = await query<RowDataPacket[]>(
      `SELECT id, profile_picture, first_name, last_name, email, student_number, theme_color
       FROM students WHERE id = ? LIMIT 1`,
      [session.id]
    )
    if (!rows.length) return null
    return { ...rows[0], role: 'student' } as SessionUser
  }
  const rows = await query<RowDataPacket[]>(
    `SELECT id, profile_picture, first_name, last_name, email, abbreviation_teacher, theme_color
     FROM teachers WHERE id = ? LIMIT 1`,
    [session.id]
  )
  if (!rows.length) return null
  return { ...rows[0], role: 'teacher' } as SessionUser
}

export async function requireUser(event: H3Event): Promise<SessionUser> {
  const user = event.context.user as SessionUser | null | undefined
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Niet ingelogd' })
  }
  return user
}

export async function requireRole(event: H3Event, role: Role): Promise<SessionUser> {
  const user = await requireUser(event)
  if (user.role !== role) {
    throw createError({ statusCode: 403, statusMessage: 'Geen toegang' })
  }
  return user
}
