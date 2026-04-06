const trailingSlashRE = /\/$/u

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl.replace(trailingSlashRE, '')

  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`
})
