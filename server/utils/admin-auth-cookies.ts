export const ACCESS_COOKIE = 'hg_access_token'
export const REFRESH_COOKIE = 'hg_refresh_token'

const isProd = process.env.NODE_ENV === 'production'

export function accessCookieOptions(maxAge = 60 * 15) {
  return {
    httpOnly: false,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

export function refreshCookieOptions(maxAge = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

export function clearAuthCookies(event: Parameters<typeof setCookie>[0]) {
  deleteCookie(event, ACCESS_COOKIE, { path: '/' })
  deleteCookie(event, REFRESH_COOKIE, { path: '/' })
}

export function setAuthCookies(
  event: Parameters<typeof setCookie>[0],
  tokens: { accessToken: string; refreshToken?: string | null },
) {
  setCookie(event, ACCESS_COOKIE, tokens.accessToken, accessCookieOptions())
  if (tokens.refreshToken) {
    setCookie(event, REFRESH_COOKIE, tokens.refreshToken, refreshCookieOptions())
  }
}
