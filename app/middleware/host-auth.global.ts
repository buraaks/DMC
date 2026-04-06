export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/host')) {
    return
  }

  const loginPath = '/host/login'
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  try {
    const session = await $fetch<{ authenticated: boolean, configured: boolean }>('/api/host/session', { headers })

    if (session.authenticated && to.path === loginPath) {
      const redirectTarget = typeof to.query.redirect === 'string' ? to.query.redirect : '/host'
      return navigateTo(redirectTarget)
    }

    if (!session.authenticated && to.path !== loginPath) {
      return navigateTo({
        path: loginPath,
        query: {
          redirect: to.fullPath,
        },
      })
    }
  }
  catch {
    if (to.path !== loginPath) {
      return navigateTo({
        path: loginPath,
        query: {
          redirect: to.fullPath,
        },
      })
    }
  }
})
