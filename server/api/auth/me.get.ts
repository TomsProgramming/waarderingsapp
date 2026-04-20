import { defineEventHandler } from 'h3'
import type { SessionUser } from '../../utils/auth'

export default defineEventHandler((event) => {
  const user = event.context.user as SessionUser | null
  return { user }
})
