import { defineEventHandler, readBody, createError } from 'h3'
import { query } from '../../utils/db'
import { verifyPassword } from '../../utils/auth'
import { loginSchema } from '../../utils/validate'
import { rateLimit } from '../../utils/ratelimit'
import { generateCode, generateToken, hashCode } from '../../utils/otp'
import { sendVerificationCode } from '../../utils/email'
import type { RowDataPacket } from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  rateLimit(event, 'login', 10, 600)

  const parsed = loginSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Ongeldige invoer' })
  }
  const { email, password, role } = parsed.data

  const table = role === 'student' ? 'students' : 'teachers'
  const rows = await query<RowDataPacket[]>(
    `SELECT id, first_name, email, password FROM \`${table}\` WHERE email = ? LIMIT 1`,
    [email]
  )

  const invalid = () => createError({ statusCode: 401, statusMessage: 'E-mail of wachtwoord klopt niet' })
  if (!rows.length) throw invalid()

  const row = rows[0] as { id: number; first_name: string; email: string; password: string }
  const ok = await verifyPassword(password, row.password)
  if (!ok) throw invalid()

  const code = generateCode()
  const token = generateToken()
  const code_hash = hashCode(code)

  await query(
    `INSERT INTO login_verifications (token, role, user_id, code_hash, expires_at)
     VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
    [token, role, row.id, code_hash]
  )

  await sendVerificationCode(row.email, row.first_name, code, 'login')

  return { ok: true, token, mode: 'login' as const, role }
})
