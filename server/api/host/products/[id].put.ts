import type { Product } from '~~/shared/catalog'
import { updateProduct } from '~~/server/utils/catalog-data'
import { requireHostAuth } from '~~/server/utils/host-auth'

export default defineEventHandler(async (event) => {
  requireHostAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ürün kimliği eksik.',
    })
  }

  const body = await readBody<Partial<Product>>(event)
  return updateProduct(id, body)
})
