import { defineEventHandler, readBody, createError } from 'h3'
import { query } from '../../utils/db'
import { createSession } from '../../utils/auth'
import { verifySchema } from '../../utils/validate'
import { rateLimit } from '../../utils/ratelimit'
import { verifyCode } from '../../utils/otp'
import { promotePendingPhoto } from '../../utils/upload'
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'

const MAX_ATTEMPTS = 5

interface PendingRow extends RowDataPacket {
  id: number
  role: 'student' | 'teacher'
  email: string
  payload: any
  code_hash: string
  attempts: number
  expires_at: Date
}

interface LoginRow extends RowDataPacket {
  id: number
  role: 'student' | 'teacher'
  user_id: number
  code_hash: string
  attempts: number
  expires_at: Date
}

interface RegisterPayload {
  first_name: string
  last_name: string
  email: string
  pw_hash: string
  pending_photo_url: string
  student_number?: number
  abbreviation_teacher?: string
}

export default defineEventHandler(async (event) => {
  rateLimit(event, 'verify', 20, 600)

  const parsed = verifySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Ongeldige invoer' })
  }
  const { token, code, mode } = parsed.data

  await query(`DELETE FROM pending_registrations WHERE expires_at < DATE_SUB(NOW(), INTERVAL 1 HOUR)`).catch(() => {})
  await query(`DELETE FROM login_verifications WHERE expires_at < DATE_SUB(NOW(), INTERVAL 1 HOUR)`).catch(() => {})

  if (mode === 'register') {
    const rows = await query<PendingRow[]>(
      `SELECT id, role, email, payload, code_hash, attempts, expires_at
       FROM pending_registrations WHERE token = ? LIMIT 1`,
      [token]
    )
    if (!rows.length) throw createError({ statusCode: 400, statusMessage: 'Verificatie niet gevonden of verlopen' })
    const row = rows[0]!

    if (new Date(row.expires_at).getTime() < Date.now()) {
      await query(`DELETE FROM pending_registrations WHERE id = ?`, [row.id])
      throw createError({ statusCode: 400, statusMessage: 'Code is verlopen, vraag een nieuwe aan' })
    }
    if (row.attempts >= MAX_ATTEMPTS) {
      await query(`DELETE FROM pending_registrations WHERE id = ?`, [row.id])
      throw createError({ statusCode: 429, statusMessage: 'Te veel pogingen, vraag een nieuwe code aan' })
    }

    if (!verifyCode(code, row.code_hash)) {
      await query(`UPDATE pending_registrations SET attempts = attempts + 1 WHERE id = ?`, [row.id])
      const remaining = MAX_ATTEMPTS - (row.attempts + 1)
      throw createError({
        statusCode: 400,
        statusMessage: remaining > 0 ? `Code onjuist (nog ${remaining} pogingen)` : 'Code onjuist'
      })
    }

    const payload: RegisterPayload =
      typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload

    const publicPhotoUrl = await promotePendingPhoto(payload.pending_photo_url)

    let newId: number
    if (row.role === 'student') {
      const dup = await query<RowDataPacket[]>(
        `SELECT id FROM students WHERE email = ? OR student_number = ? LIMIT 1`,
        [payload.email, payload.student_number]
      )
      if (dup.length) {
        await query(`DELETE FROM pending_registrations WHERE id = ?`, [row.id])
        throw createError({ statusCode: 409, statusMessage: 'Account bestaat al' })
      }
      const result = await query<ResultSetHeader>(
        `INSERT INTO students (profile_picture, first_name, last_name, email, password, student_number)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [publicPhotoUrl, payload.first_name, payload.last_name, payload.email, payload.pw_hash, payload.student_number]
      )
      newId = result.insertId
    } else {
      const dup = await query<RowDataPacket[]>(
        `SELECT id FROM teachers WHERE email = ? OR abbreviation_teacher = ? LIMIT 1`,
        [payload.email, payload.abbreviation_teacher]
      )
      if (dup.length) {
        await query(`DELETE FROM pending_registrations WHERE id = ?`, [row.id])
        throw createError({ statusCode: 409, statusMessage: 'Account bestaat al' })
      }
      const result = await query<ResultSetHeader>(
        `INSERT INTO teachers (profile_picture, first_name, last_name, email, password, abbreviation_teacher)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [publicPhotoUrl, payload.first_name, payload.last_name, payload.email, payload.pw_hash, payload.abbreviation_teacher]
      )
      newId = result.insertId
    }

    await query(`DELETE FROM pending_registrations WHERE id = ?`, [row.id])
    await createSession(event, newId, row.role)
    return { ok: true, role: row.role, id: newId }
  }

  const rows = await query<LoginRow[]>(
    `SELECT id, role, user_id, code_hash, attempts, expires_at
     FROM login_verifications WHERE token = ? LIMIT 1`,
    [token]
  )
  if (!rows.length) throw createError({ statusCode: 400, statusMessage: 'Verificatie niet gevonden of verlopen' })
  const row = rows[0]!

  if (new Date(row.expires_at).getTime() < Date.now()) {
    await query(`DELETE FROM login_verifications WHERE id = ?`, [row.id])
    throw createError({ statusCode: 400, statusMessage: 'Code is verlopen, log opnieuw in' })
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    await query(`DELETE FROM login_verifications WHERE id = ?`, [row.id])
    throw createError({ statusCode: 429, statusMessage: 'Te veel pogingen, log opnieuw in' })
  }

  if (!verifyCode(code, row.code_hash)) {
    await query(`UPDATE login_verifications SET attempts = attempts + 1 WHERE id = ?`, [row.id])
    const remaining = MAX_ATTEMPTS - (row.attempts + 1)
    throw createError({
      statusCode: 400,
      statusMessage: remaining > 0 ? `Code onjuist (nog ${remaining} pogingen)` : 'Code onjuist'
    })
  }

  await query(`DELETE FROM login_verifications WHERE id = ?`, [row.id])
  await createSession(event, row.user_id, row.role)
  return { ok: true, role: row.role, id: row.user_id }
})
