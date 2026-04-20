import { defineEventHandler, getQuery, createError } from 'h3'
import { query } from '../../utils/db'
import { requireUser } from '../../utils/auth'
import type { RowDataPacket } from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const student = Number(getQuery(event).student)
  if (!Number.isInteger(student) || student <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Ongeldige student' })
  }
  if (user.role === 'student' && user.id !== student) {
    throw createError({ statusCode: 403, statusMessage: 'Geen toegang' })
  }

  const rows = await query<RowDataPacket[]>(
    `(SELECT * FROM reviews WHERE user_id = ? AND role = 'teacher'
       ORDER BY created_at DESC, id DESC LIMIT 1)
     UNION ALL
     (SELECT * FROM reviews WHERE user_id = ? AND role = 'customer'
       ORDER BY created_at DESC, id DESC LIMIT 1)`,
    [student, student]
  )

  const teacher = rows.find((r) => r.role === 'teacher') || null
  const customer = rows.find((r) => r.role === 'customer') || null
  return { teacher, customer }
})
