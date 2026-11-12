import { createAdminClient, createClient } from '@insforge/sdk'
import { ACCESS_COOKIE } from './admin-auth-cookies'

export function getInsforgeAdmin() {
  const config = useRuntimeConfig()
  const baseUrl = String(config.public.insforgeUrl || '')
  const apiKey = String(config.insforgeApiKey || '')
  if (!baseUrl || !apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'InsForge API key no configurada (INSFORGE_API_KEY)',
    })
  }
  return createAdminClient({ baseUrl, apiKey })
}

/** Valida sesión admin por Bearer o cookie hg_access_token. */
export async function requireAdminUser(event: Parameters<typeof getHeader>[0]) {
  const config = useRuntimeConfig()
  const baseUrl = String(config.public.insforgeUrl || '')
  const anonKey = String(config.public.insforgeAnonKey || '')
  if (!baseUrl || !anonKey) {
    throw createError({ statusCode: 500, statusMessage: 'InsForge no configurado' })
  }

  const authHeader = getHeader(event, 'authorization') || ''
  const bearer = authHeader.replace(/^Bearer\s+/i, '').trim()
  const cookieToken = getCookie(event, ACCESS_COOKIE) || ''
  const accessToken = bearer || cookieToken

  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Sesión caducada. Vuelve a iniciar sesión.' })
  }

  const client = createClient({ baseUrl, anonKey, accessToken })
  const { data, error } = await client.auth.getCurrentUser()
  if (error || !data?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Sesión no válida. Vuelve a iniciar sesión.' })
  }
  return { user: data.user, accessToken }
}
