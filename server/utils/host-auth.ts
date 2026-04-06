import { createHash } from 'node:crypto'
import process from 'node:process'
import { deleteCookie, getCookie, setCookie } from 'h3'
import { HOST_SESSION_COOKIE } from '../../shared/catalog'

function createSessionHash(password: string): string {
  return createHash('sha256')
    .update(`dmc-host:${password}`)
    .digest('hex')
}

export function isHostAuthenticated(event: Parameters<typeof getCookie>[0]): boolean {
  const config = useRuntimeConfig(event)
  const sessionToken = getCookie(event, HOST_SESSION_COOKIE)
  const expectedToken = createSessionHash(config.hostAdminPassword)

  return Boolean(sessionToken && sessionToken === expectedToken)
}

export function requireHostAuth(event: Parameters<typeof getCookie>[0]) {
  if (!isHostAuthenticated(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Yönetici oturumu gerekli.',
    })
  }
}

export function setHostSession(event: Parameters<typeof getCookie>[0]) {
  const config = useRuntimeConfig(event)

  setCookie(event, HOST_SESSION_COOKIE, createSessionHash(config.hostAdminPassword), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
    secure: process.env.NODE_ENV === 'production',
  })
}

export function clearHostSession(event: Parameters<typeof getCookie>[0]) {
  deleteCookie(event, HOST_SESSION_COOKIE, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  })
}
