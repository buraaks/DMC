import type { SiteSettings } from '~~/shared/catalog'
import { updateSiteConfiguration } from '~~/server/utils/catalog-data'
import { requireHostAuth } from '~~/server/utils/host-auth'

export default defineEventHandler(async (event) => {
  requireHostAuth(event)
  const body = await readBody<Partial<SiteSettings>>(event)
  return updateSiteConfiguration(body)
})
