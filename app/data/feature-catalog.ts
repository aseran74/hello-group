export type FeatureItem = {
  key: string
  label_es: string
  label_en: string
  detail_es?: string
  detail_en?: string
}

export const AMENITY_CATALOG: FeatureItem[] = [
  { key: 'wifi', label_es: 'Wi‑Fi', label_en: 'Wi‑Fi' },
  { key: 'pet', label_es: 'Pet friendly', label_en: 'Pet friendly' },
  { key: 'kitchen', label_es: 'Cocina equipada', label_en: 'Equipped kitchen' },
  { key: 'heating', label_es: 'Calefacción', label_en: 'Heating' },
  { key: 'ac', label_es: 'Aire acondicionado', label_en: 'Air conditioning' },
  { key: 'parking', label_es: 'Parking / garaje', label_en: 'Parking / garage' },
  { key: 'garden', label_es: 'Jardín', label_en: 'Garden' },
  { key: 'terrace', label_es: 'Terraza', label_en: 'Terrace' },
  { key: 'fireplace', label_es: 'Chimenea', label_en: 'Fireplace' },
  { key: 'tv', label_es: 'TV', label_en: 'TV' },
  { key: 'washer', label_es: 'Lavadora', label_en: 'Washing machine' },
  { key: 'elevator', label_es: 'Ascensor', label_en: 'Elevator' },
  { key: 'workspace', label_es: 'Zona de trabajo', label_en: 'Workspace' },
  { key: 'pool', label_es: 'Piscina', label_en: 'Pool' },
]

export const ACTIVITY_CATALOG: FeatureItem[] = [
  { key: 'mtb', label_es: 'Mountain bike', label_en: 'Mountain bike', detail_es: 'Rutas cercanas', detail_en: 'Nearby trails' },
  { key: 'surf', label_es: 'Surf', label_en: 'Surf', detail_es: 'Playas cercanas', detail_en: 'Nearby beaches' },
  { key: 'hiking', label_es: 'Senderismo', label_en: 'Hiking', detail_es: 'Rutas y naturaleza', detail_en: 'Trails and nature' },
  { key: 'canoe', label_es: 'Piragüismo', label_en: 'Canoeing', detail_es: 'Ríos cercanos', detail_en: 'Nearby rivers' },
  { key: 'beach', label_es: 'Playa', label_en: 'Beach', detail_es: 'Costa a poca distancia', detail_en: 'Coast nearby' },
  { key: 'wine', label_es: 'Enoturismo', label_en: 'Wine tourism', detail_es: 'Bodegas y miradores', detail_en: 'Wineries and views' },
  { key: 'museum', label_es: 'Museos', label_en: 'Museums', detail_es: 'Cultura urbana', detail_en: 'City culture' },
  { key: 'park', label_es: 'Parques', label_en: 'Parks', detail_es: 'Espacios al aire libre', detail_en: 'Outdoor spaces' },
  { key: 'city', label_es: 'Centro ciudad', label_en: 'City centre', detail_es: 'Vida urbana', detail_en: 'Urban life' },
  { key: 'food', label_es: 'Gastronomía', label_en: 'Food', detail_es: 'Cocina local', detail_en: 'Local cuisine' },
]

export type RoomType = 'single' | 'double' | 'triple'
export type BathroomType = 'private' | 'shared'

export const ROOM_TYPES: { key: RoomType; label_es: string; label_en: string; capacity: number }[] = [
  { key: 'single', label_es: 'Sencilla', label_en: 'Single', capacity: 1 },
  { key: 'double', label_es: 'Doble', label_en: 'Double', capacity: 2 },
  { key: 'triple', label_es: 'Triple', label_en: 'Triple', capacity: 3 },
]

export const BATHROOM_TYPES: { key: BathroomType; label_es: string; label_en: string }[] = [
  { key: 'private', label_es: 'Baño propio', label_en: 'Private bathroom' },
  { key: 'shared', label_es: 'Baño compartido', label_en: 'Shared bathroom' },
]

export function amenityByKey(key: string) {
  return AMENITY_CATALOG.find((a) => a.key === key)
}

export function activityByKey(key: string) {
  return ACTIVITY_CATALOG.find((a) => a.key === key)
}

export function roomTypeLabel(type: string, locale = 'es') {
  const item = ROOM_TYPES.find((r) => r.key === type)
  if (!item) return type
  return locale.startsWith('en') ? item.label_en : item.label_es
}

export function bathroomTypeLabel(type: string, locale = 'es') {
  const item = BATHROOM_TYPES.find((r) => r.key === type)
  if (!item) return type
  return locale.startsWith('en') ? item.label_en : item.label_es
}
