import { defineEventHandler } from 'h3'
import { readSession, loadUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await readSession(event)
  if (!session) {
    event.context.user = null
    return
  }
  const user = await loadUser(session).catch(() => null)
  event.context.user = user
})
