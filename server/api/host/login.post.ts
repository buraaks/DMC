import { setHostSession } from '~~/server/utils/host-auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event)
  const config = useRuntimeConfig(event)

  if (!body?.password || body.password !== config.hostAdminPassword) {
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
