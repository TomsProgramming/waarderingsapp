import { defineEventHandler, readBody, createError } from 'h3'
import { query } from '../../utils/db'
import { teacherReviewSchema, customerReviewSchema } from '../../utils/validate'
import { rateLimit } from '../../utils/ratelimit'
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import type { SessionUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  rateLimit(event, 'review', 30, 600)

  const body = await readBody(event)
  const user = event.context.user as SessionUser | null

  if (user && user.role === 'teacher') {
    const parsed = teacherReviewSchema.safeParse(body)
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Ongeldig' })
    }
    const d = parsed.data

    const exists = await query<RowDataPacket[]>(`SELECT id FROM students WHERE id = ? LIMIT 1`, [d.student_id])
    if (!exists.length) throw createError({ statusCode: 404, statusMessage: 'Student niet gevonden' })

    const result = await query<ResultSetHeader>(
      `INSERT INTO reviews
        (user_id, role, customer_name, project_name, present, organise, independence, collaborate, communicate, review, teacher_id)
       VALUES (?, 'teacher', NULL, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [d.student_id, d.project_name || null, d.present, d.organise, d.independence, d.collaborate, d.communicate, d.review, user.id]
    )
    return { ok: true, id: result.insertId }
  }

  const parsed = customerReviewSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Ongeldig' })
  }
  const d = parsed.data

  rateLimit(event, `review:student:${d.student_id}`, 5, 3600)

  const exists = await query<RowDataPacket[]>(`SELECT id FROM students WHERE id = ? LIMIT 1`, [d.student_id])
  if (!exists.length) throw createError({ statusCode: 404, statusMessage: 'Student niet gevonden' })

  const result = await query<ResultSetHeader>(
    `INSERT INTO reviews
      (user_id, role, customer_name, project_name, present, organise, independence, collaborate, communicate, review, teacher_id)
     VALUES (?, 'customer', ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
    [d.student_id, d.customer_name, d.project_name, d.present, d.organise, d.independence, d.collaborate, d.communicate, d.review]
  )
  return { ok: true, id: result.insertId }
})
