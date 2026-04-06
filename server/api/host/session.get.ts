import { isHostAuthConfigured, isHostAuthenticated } from '~~/server/utils/host-auth'

export default defineEventHandler(async (event) => {
  return {
    authenticated: isHostAuthenticated(event),
    configured: isHostAuthConfigured(event),
  }
})
