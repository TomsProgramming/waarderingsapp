import { defineEventHandler, getQuery } from 'h3'
import { query } from '../../utils/db'
import { requireRole } from '../../utils/auth'
import { searchQuerySchema } from '../../utils/validate'
import type { RowDataPacket } from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'teacher')
  const parsed = searchQuerySchema.safeParse(getQuery(event))
  const q = parsed.success ? parsed.data.q?.trim() : ''

  if (q) {
    const like = `%${q}%`
    const rows = await query<RowDataPacket[]>(
      `SELECT id, first_name, last_name, email, student_number, profile_picture
       FROM students
       WHERE first_name LIKE ? OR last_name LIKE ? OR CAST(student_number AS CHAR) LIKE ?
       ORDER BY first_name, last_name LIMIT 100`,
      [like, like, like]
    )
    return { students: rows }
  }
  const rows = await query<RowDataPacket[]>(
    `SELECT id, first_name, last_name, email, student_number, profile_picture
     FROM students ORDER BY first_name, last_name LIMIT 100`
  )
  return { students: rows }
})
