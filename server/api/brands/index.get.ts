import { listBrands } from '~~/server/utils/catalog-data'

export default defineEventHandler(async () => {
  return listBrands()
})
