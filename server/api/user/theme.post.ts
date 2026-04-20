import { defineEventHandler, readBody, createError } from 'h3'
import { query } from '../../utils/db'
import { requireUser } from '../../utils/auth'
import { themeSchema } from '../../utils/validate'
import type { ResultSetHeader } from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const parsed = themeSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Ongeldige kleur' })
  }
  const table = user.role === 'student' ? 'students' : 'teachers'
  await query<ResultSetHeader>(
    `UPDATE \`${table}\` SET theme_color = ? WHERE id = ?`,
    [parsed.data.color, user.id]
  )
  return { ok: true, color: parsed.data.color }
})
