/** URLs de reserva RoomRaccoon por slug de casa */
export const HOUSE_BOOKING_URLS: Record<string, string> = {
  sincelejo: 'https://booking.roomraccoon.es/hello-astur/es/?roomTypes=127561',
}

export function bookingUrlForHouse(slug: string, locale = 'es'): string | null {
  const base = HOUSE_BOOKING_URLS[slug]
  if (!base) return null
  if (locale.startsWith('en')) {
    return base.replace('/es/', '/en/')
  }
  return base
}
