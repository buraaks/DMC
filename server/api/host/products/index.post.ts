import type { Product } from '~~/shared/catalog'
import { createProduct } from '~~/server/utils/catalog-data'
import { requireHostAuth } from '~~/server/utils/host-auth'

export default defineEventHandler(async (event) => {
  requireHostAuth(event)
  const body = await readBody<Partial<Product>>(event)
  return createProduct(body)
})
