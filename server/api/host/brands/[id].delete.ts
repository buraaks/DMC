import { deleteBrand } from '~~/server/utils/catalog-data'
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

  await deleteBrand(id)

  return {
    ok: true,
  }
})
