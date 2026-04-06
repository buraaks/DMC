import { computed } from 'vue'

const trailingSlashRE = /\/$/u

export function useSiteUrl() {
  const runtimeConfig = useRuntimeConfig()
  const requestUrl = import.meta.server ? useRequestURL() : null

  return computed(() => {
    const configuredSiteUrl = runtimeConfig.public.siteUrl?.trim()

    if (configuredSiteUrl) {
      return configuredSiteUrl.replace(trailingSlashRE, '')
    }

    if (import.meta.server) {
      return requestUrl!.origin.replace(trailingSlashRE, '')
    }

    return window.location.origin.replace(trailingSlashRE, '')
  })
}
