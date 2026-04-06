import { clearHostSession } from '~~/server/utils/host-auth'

export default defineEventHandler(async (event) => {
  clearHostSession(event)

  return {
    ok: true,
  }
})
