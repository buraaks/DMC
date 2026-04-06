import { getHostAdminPassword, setHostSession } from '~~/server/utils/host-auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event)
  const configuredPassword = getHostAdminPassword(event)

  if (!body?.password || body.password !== configuredPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Şifre doğrulanamadı.',
    })
  }

  setHostSession(event)

  return {
    ok: true,
  }
})
