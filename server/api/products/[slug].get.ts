import { getProductByPublicIdentifier } from '~~/server/utils/catalog-data'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ürün slug bilgisi eksik.',
    })
  }

  const product = await getProductByPublicIdentifier(slug)

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Ürün bulunamadı.',
    })
  }

  return product
})
