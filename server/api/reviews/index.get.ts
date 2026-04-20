import { defineEventHandler, getQuery, createError } from 'h3'
import { query } from '../../utils/db'
import { requireUser } from '../../utils/auth'
import type { RowDataPacket } from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const q = getQuery(event)
  const student = Number(q.student)
  const role = typeof q.role === 'string' ? q.role : undefined

  if (!Number.isInteger(student) || student <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Ongeldige student' })
  }
  if (user.role === 'student' && user.id !== student) {
    throw createError({ statusCode: 403, statusMessage: 'Geen toegang' })
  }
  if (role && role !== 'teacher' && role !== 'customer') {
    throw createError({ statusCode: 400, statusMessage: 'Ongeldige rol' })
  }

  const params: unknown[] = [student]
  let sql = `SELECT id, user_id, role, customer_name, project_name, present, organise,
                    independence, collaborate, communicate, review, teacher_id, created_at
             FROM reviews WHERE user_id = ?`
  if (role) {
    sql += ' AND role = ?'
    params.push(role)
  }
  sql += ' ORDER BY created_at DESC, id DESC LIMIT 200'

  const rows = await query<RowDataPacket[]>(sql, params)
  return { reviews: rows }
})
