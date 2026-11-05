import { MADRID_CENTER, MADRID_LANDMARKS, MADRID_RADIUS_KM } from '~/data/madrid-landmarks'
import { formatDistanceKm, haversineKm } from '~/utils/distance'

export type LandmarkDistance = {
  id: string
  label: string
  km: number
  distanceLabel: string
  mapsUrl: string
}

export function useMadridDistances() {
  const { locale } = useI18n()

  function isInMadridArea(lat: number | null, lng: number | null) {
    if (lat == null || lng == null) return false
    return haversineKm(lat, lng, MADRID_CENTER.lat, MADRID_CENTER.lng) <= MADRID_RADIUS_KM
  }

  function getDistances(lat: number | null, lng: number | null): LandmarkDistance[] {
    if (lat == null || lng == null || !isInMadridArea(lat, lng)) return []

    const isEn = locale.value.startsWith('en')
    return MADRID_LANDMARKS
      .map((spot) => {
        const km = haversineKm(lat, lng, spot.lat, spot.lng)
        return {
          id: spot.id,
          label: isEn ? spot.label_en : spot.label_es,
          km,
          distanceLabel: formatDistanceKm(km, locale.value),
          mapsUrl: `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${spot.lat},${spot.lng}&travelmode=driving`,
        }
      })
      .sort((a, b) => a.km - b.km)
  }

  return { isInMadridArea, getDistances }
}
