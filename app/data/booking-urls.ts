/** Fallback estático si la casa aún no tiene booking_url en InsForge */
export const HOUSE_BOOKING_URLS: Record<string, string> = {}

/** Ajusta /es/ ↔ /en/ en URLs RoomRaccoon */
export function withBookingLocale(url: string | null | undefined, locale = 'es'): string | null {
  if (!url) return null
  if (locale.startsWith('en')) {
    return url.replace('/es/', '/en/')
  }
  return url.replace('/en/', '/es/')
}

export function bookingUrlForHouse(
  slug: string,
  locale = 'es',
  dbUrl?: string | null,
): string | null {
  return withBookingLocale(dbUrl || HOUSE_BOOKING_URLS[slug] || null, locale)
}
