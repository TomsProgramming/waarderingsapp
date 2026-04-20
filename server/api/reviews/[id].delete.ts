import { defineEventHandler, getRouterParam, createError } from 'h3'
import { query } from '../../utils/db'
import { requireRole } from '../../utils/auth'
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  const teacher = await requireRole(event, 'teacher')
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Ongeldig id' })
  }

  const rows = await query<RowDataPacket[]>(
    `SELECT role, teacher_id FROM reviews WHERE id = ? LIMIT 1`,
    [id]
  )
  if (!rows.length) throw createError({ statusCode: 404, statusMessage: 'Niet gevonden' })
  const row = rows[0] as { role: string; teacher_id: number | null }

  // Teachers act as moderators: every review is deletable except another teacher's.
  if (row.role === 'teacher' && row.teacher_id !== null && row.teacher_id !== teacher.id) {
    throw createError({ statusCode: 403, statusMessage: 'Je kunt alleen je eigen reviews verwijderen' })
  }

  await query<ResultSetHeader>(`DELETE FROM reviews WHERE id = ?`, [id])
  return { ok: true }
})
