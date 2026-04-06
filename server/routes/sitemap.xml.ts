import { listProducts } from '~~/server/utils/catalog-data'
import { getSiteUrl } from '~~/server/utils/site-url'

export default defineEventHandler(async (event) => {
  const siteUrl = getSiteUrl(event)
  const products = await listProducts()

  const staticRoutes = ['/', '/urunler', '/iletisim']
  const dynamicRoutes = products.map(product => `/urun/${product.slug}`)

  const urls = [...staticRoutes, ...dynamicRoutes]
    .map(path => `<url><loc>${siteUrl}${path}</loc></url>`)
    .join('')

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
})
