import { createHash } from 'node:crypto'
import process from 'node:process'
import { deleteCookie, getCookie, getRequestProtocol, setCookie } from 'h3'
import { HOST_SESSION_COOKIE } from '../../shared/catalog'
import { hasConfiguredHostPassword } from './host-password'
import { createHttpError } from './http-error'

function readConfiguredHostPassword(event: Parameters<typeof getCookie>[0]) {
  if (hasConfiguredHostPassword(process.env.HOST_ADMIN_PASSWORD)) {
    return process.env.HOST_ADMIN_PASSWORD.trim()
  }

  const { hostAdminPassword } = useRuntimeConfig(event)
  if (hasConfiguredHostPassword(hostAdminPassword)) {
    return hostAdminPassword.trim()
  }

  return ''
}

function createSessionHash(password: string): string {
  return createHash('sha256')
    .update(`dmc-host:${password}`)
    .digest('hex')
}

function shouldUseSecureCookies(event: Parameters<typeof getCookie>[0]) {
  return getRequestProtocol(event, { xForwardedProto: true }) === 'https'
}

export function getHostAdminPassword(event: Parameters<typeof getCookie>[0]) {
  const password = readConfiguredHostPassword(event)

  if (!password) {
    throw createHttpError({
      statusCode: 503,
      statusMessage: 'HOST_ADMIN_PASSWORD tanımlı değil.',
    })
  }

  return password
}

export function isHostAuthConfigured(event: Parameters<typeof getCookie>[0]): boolean {
  return Boolean(readConfiguredHostPassword(event))
}

export function isHostAuthenticated(event: Parameters<typeof getCookie>[0]): boolean {
  const sessionToken = getCookie(event, HOST_SESSION_COOKIE)
  const configuredPassword = readConfiguredHostPassword(event)

  if (!configuredPassword) {
    return false
  }

  const expectedToken = createSessionHash(configuredPassword)

  return Boolean(sessionToken && sessionToken === expectedToken)
}

export function requireHostAuth(event: Parameters<typeof getCookie>[0]) {
  if (!isHostAuthenticated(event)) {
    throw createHttpError({
      statusCode: 401,
      statusMessage: 'Yönetici oturumu gerekli.',
    })
  }
}

export function setHostSession(event: Parameters<typeof getCookie>[0]) {
  setCookie(event, HOST_SESSION_COOKIE, createSessionHash(getHostAdminPassword(event)), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
    secure: shouldUseSecureCookies(event),
  })
}

export function clearHostSession(event: Parameters<typeof getCookie>[0]) {
  deleteCookie(event, HOST_SESSION_COOKIE, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: shouldUseSecureCookies(event),
  })
}
