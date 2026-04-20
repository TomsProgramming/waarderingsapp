import { defineEventHandler, createError } from 'h3'
import { query } from '../../utils/db'
import { hashPassword } from '../../utils/auth'
import { registerTeacherSchema } from '../../utils/validate'
import { rateLimit } from '../../utils/ratelimit'
import { readMultipartWithPhoto, cleanupOldPendingPhotos } from '../../utils/upload'
import { generateCode, generateToken, hashCode } from '../../utils/otp'
import { sendVerificationCode } from '../../utils/email'
import type { RowDataPacket } from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  rateLimit(event, 'register', 10, 3600)

  const upload = await readMultipartWithPhoto(event)

  const parsed = registerTeacherSchema.safeParse(upload.fields)
  if (!parsed.success) {
    await upload.cleanup()
    const first = parsed.error.issues[0]
    throw createError({ statusCode: 400, statusMessage: first?.message || 'Ongeldige invoer' })
  }
  const data = parsed.data

  const existing = await query<RowDataPacket[]>(
    `SELECT id FROM teachers WHERE email = ? OR abbreviation_teacher = ? LIMIT 1`,
    [data.email, data.abbreviation_teacher]
  )
  if (existing.length) {
    await upload.cleanup()
    throw createError({ statusCode: 409, statusMessage: 'Account bestaat al' })
  }

  const pw_hash = await hashPassword(data.password)
  const code = generateCode()
  const token = generateToken()
  const code_hash = hashCode(code)

  const payload = {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    abbreviation_teacher: data.abbreviation_teacher,
    pw_hash,
    pending_photo_url: upload.pendingPhotoUrl
  }

  await query(
    `INSERT INTO pending_registrations (token, role, email, payload, code_hash, expires_at)
     VALUES (?, 'teacher', ?, ?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))`,
    [token, data.email, JSON.stringify(payload), code_hash]
  )

  await sendVerificationCode(data.email, data.first_name, code, 'register')

  cleanupOldPendingPhotos().catch(() => {})

  return { ok: true, token, mode: 'register' as const, role: 'teacher' as const }
})
