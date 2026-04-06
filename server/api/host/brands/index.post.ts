import type { Brand } from '~~/shared/catalog'
import { createBrand } from '~~/server/utils/catalog-data'
import { requireHostAuth } from '~~/server/utils/host-auth'

export default defineEventHandler(async (event) => {
  requireHostAuth(event)
  const body = await readBody<Partial<Brand>>(event)
  return createBrand(body)
})
