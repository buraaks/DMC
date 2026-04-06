import { getSiteSettings } from '~~/server/utils/catalog-data'

export default defineEventHandler(async () => {
  return getSiteSettings()
})
