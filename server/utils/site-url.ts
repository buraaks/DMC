import { getRequestURL } from 'h3'

const trailingSlashRE = /\/$/u

export function normalizeSiteUrl(url: string) {
  return url.replace(trailingSlashRE, '')
}

export function getSiteUrl(event: Parameters<typeof getRequestURL>[0]) {
  const configuredSiteUrl = useRuntimeConfig(event).public.siteUrl?.trim()
  return normalizeSiteUrl(configuredSiteUrl || getRequestURL(event).origin)
}
