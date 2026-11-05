const EARTH_KM = 6371

function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

/** Distancia en línea recta (km) entre dos coordenadas */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return EARTH_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatDistanceKm(km: number, locale = 'es'): string {
  const value = km < 10 ? km.toFixed(1) : Math.round(km).toString()
  const normalized = locale.startsWith('en')
    ? value
    : value.replace('.', ',')
  return locale.startsWith('en') ? `${normalized} km` : `${normalized} km`
}
