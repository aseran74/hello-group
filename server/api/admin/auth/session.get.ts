import { createClient } from '@insforge/sdk'
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  clearAuthCookies,
  setAuthCookies,
} from '../../../utils/admin-auth-cookies'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = String(config.public.insforgeUrl || '')
  const anonKey = String(config.public.insforgeAnonKey || '')

  if (!baseUrl || !anonKey) {
    return { user: null, accessToken: null }
  }

  let accessToken = getCookie(event, ACCESS_COOKIE) || null
  const refreshToken = getCookie(event, REFRESH_COOKIE) || null

  if (!accessToken && !refreshToken) {
    return { user: null, accessToken: null }
  }

  const client = createClient({
    baseUrl,
    anonKey,
    isServerMode: true,
    accessToken: accessToken || undefined,
  })

  if (!accessToken && refreshToken) {
    const refreshed = await client.auth.refreshSession({ refreshToken })
    if (refreshed.error || !refreshed.data?.accessToken) {
      clearAuthCookies(event)
      return { user: null, accessToken: null }
    }
    accessToken = refreshed.data.accessToken
    setAuthCookies(event, {
      accessToken,
      refreshToken: refreshed.data.refreshToken || refreshToken,
    })
    client.setAccessToken(accessToken)
  }

  const { data, error } = await client.auth.getCurrentUser()

  if (error || !data?.user) {
    if (refreshToken) {
      const refreshed = await client.auth.refreshSession({ refreshToken })
      if (!refreshed.error && refreshed.data?.accessToken) {
        accessToken = refreshed.data.accessToken
        setAuthCookies(event, {
          accessToken,
          refreshToken: refreshed.data.refreshToken || refreshToken,
        })
        client.setAccessToken(accessToken)
        const again = await client.auth.getCurrentUser()
        if (again.data?.user) {
          return { user: again.data.user, accessToken }
        }
      }
    }
    clearAuthCookies(event)
    return { user: null, accessToken: null }
  }

  return { user: data.user, accessToken }
})
