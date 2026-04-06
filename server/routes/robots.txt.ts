import { getSiteUrl } from '~~/server/utils/site-url'

export default defineEventHandler(async (event) => {
  const siteUrl = getSiteUrl(event)

  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`
})
