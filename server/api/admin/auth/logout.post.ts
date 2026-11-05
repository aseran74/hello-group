import { clearAuthCookies } from '../../../utils/admin-auth-cookies'

export default defineEventHandler(async (event) => {
  clearAuthCookies(event)
  return { ok: true }
})
