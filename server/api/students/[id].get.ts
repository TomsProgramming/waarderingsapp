import { defineEventHandler, getRouterParam, createError } from 'h3'
import { query } from '../../utils/db'
import { requireUser } from '../../utils/auth'
import type { RowDataPacket } from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Ongeldig id' })
  }

  if (user.role === 'student' && user.id !== id) {
    throw createError({ statusCode: 403, statusMessage: 'Geen toegang' })
  }

  const rows = await query<RowDataPacket[]>(
    `SELECT id, first_name, last_name, email, student_number, profile_picture
     FROM students WHERE id = ? LIMIT 1`,
    [id]
  )
  if (!rows.length) throw createError({ statusCode: 404, statusMessage: 'Niet gevonden' })
  return { student: rows[0] }
})
