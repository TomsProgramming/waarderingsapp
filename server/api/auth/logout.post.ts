import { defineEventHandler } from 'h3'
import { destroySession } from '../../utils/auth'

export default defineEventHandler((event) => {
  destroySession(event)
  return { ok: true }
})
