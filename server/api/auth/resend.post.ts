import { defineEventHandler, readBody, createError } from 'h3'
import { query } from '../../utils/db'
import { resendSchema } from '../../utils/validate'
import { rateLimit } from '../../utils/ratelimit'
import { generateCode, hashCode } from '../../utils/otp'
import { sendVerificationCode } from '../../utils/email'
import type { RowDataPacket } from 'mysql2/promise'

const RESEND_COOLDOWN_SEC = 30

export default defineEventHandler(async (event) => {
  rateLimit(event, 'resend', 10, 600)

  const parsed = resendSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Ongeldige invoer' })
  }
  const { token, mode } = parsed.data

  if (mode === 'register') {
    const rows = await query<RowDataPacket[]>(
      `SELECT id, email, payload, created_at FROM pending_registrations WHERE token = ? LIMIT 1`,
      [token]
    )
    if (!rows.length) throw createError({ statusCode: 400, statusMessage: 'Verificatie niet gevonden' })
    const row = rows[0] as { id: number; email: string; payload: any; created_at: Date }

    const sinceSec = (Date.now() - new Date(row.created_at).getTime()) / 1000
    if (sinceSec < RESEND_COOLDOWN_SEC) {
      throw createError({ statusCode: 429, statusMessage: `Wacht nog ${Math.ceil(RESEND_COOLDOWN_SEC - sinceSec)}s` })
    }

    const payload = typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload
    const code = generateCode()
    const code_hash = hashCode(code)

    await query(
      `UPDATE pending_registrations
         SET code_hash = ?, attempts = 0, expires_at = DATE_ADD(NOW(), INTERVAL 15 MINUTE), created_at = NOW()
       WHERE id = ?`,
      [code_hash, row.id]
    )
    await sendVerificationCode(row.email, payload.first_name || 'daar', code, 'register')
    return { ok: true }
  }

  const rows = await query<RowDataPacket[]>(
    `SELECT lv.id, lv.role, lv.user_id, lv.created_at
       FROM login_verifications lv WHERE lv.token = ? LIMIT 1`,
    [token]
  )
  if (!rows.length) throw createError({ statusCode: 400, statusMessage: 'Verificatie niet gevonden' })
  const row = rows[0] as { id: number; role: 'student' | 'teacher'; user_id: number; created_at: Date }

  const sinceSec = (Date.now() - new Date(row.created_at).getTime()) / 1000
  if (sinceSec < RESEND_COOLDOWN_SEC) {
    throw createError({ statusCode: 429, statusMessage: `Wacht nog ${Math.ceil(RESEND_COOLDOWN_SEC - sinceSec)}s` })
  }

  const table = row.role === 'student' ? 'students' : 'teachers'
  const users = await query<RowDataPacket[]>(
    `SELECT first_name, email FROM \`${table}\` WHERE id = ? LIMIT 1`,
    [row.user_id]
  )
  if (!users.length) {
    await query(`DELETE FROM login_verifications WHERE id = ?`, [row.id])
    throw createError({ statusCode: 400, statusMessage: 'Verificatie niet gevonden' })
  }
  const user = users[0] as { first_name: string; email: string }

  const code = generateCode()
  const code_hash = hashCode(code)

  await query(
    `UPDATE login_verifications
       SET code_hash = ?, attempts = 0, expires_at = DATE_ADD(NOW(), INTERVAL 10 MINUTE), created_at = NOW()
     WHERE id = ?`,
    [code_hash, row.id]
  )
  await sendVerificationCode(user.email, user.first_name, code, 'login')
  return { ok: true }
})
