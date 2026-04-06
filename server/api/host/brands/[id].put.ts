import type { Brand } from '~~/shared/catalog'
import { updateBrand } from '~~/server/utils/catalog-data'
import { requireHostAuth } from '~~/server/utils/host-auth'

export default defineEventHandler(async (event) => {
  requireHostAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Marka kimliği eksik.',
    })
  }

  const body = await readBody<Partial<Brand>>(event)
  return updateBrand(id, body)
})
