import {
  ACTIVITY_CATALOG,
  AMENITY_CATALOG,
  activityByKey,
  amenityByKey,
} from '~/data/feature-catalog'
import type { HouseActivity, HouseAmenity } from '~/types/house'

export function normalizeAmenities(raw: unknown): HouseAmenity[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (typeof item === 'string') {
        const found = amenityByKey(item)
        return found
          ? { key: found.key, label_es: found.label_es, label_en: found.label_en }
          : { key: item, label_es: item, label_en: item }
      }
      if (item && typeof item === 'object' && 'key' in item) {
        const obj = item as HouseAmenity
        const found = amenityByKey(obj.key)
        return {
          key: obj.key,
          label_es: obj.label_es || found?.label_es || obj.key,
          label_en: obj.label_en || found?.label_en || obj.key,
        }
      }
      return null
    })
    .filter(Boolean) as HouseAmenity[]
}

export function normalizeActivities(raw: unknown): HouseActivity[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (typeof item === 'string') {
        const found = activityByKey(item)
        return found
          ? {
              key: found.key,
              label_es: found.label_es,
              label_en: found.label_en,
              detail_es: found.detail_es,
              detail_en: found.detail_en,
            }
          : { key: item, label_es: item, label_en: item }
      }
      if (item && typeof item === 'object' && 'key' in item) {
        const obj = item as HouseActivity
        const found = activityByKey(obj.key)
        return {
          key: obj.key,
          label_es: obj.label_es || found?.label_es || obj.key,
          label_en: obj.label_en || found?.label_en || obj.key,
          detail_es: obj.detail_es || found?.detail_es,
          detail_en: obj.detail_en || found?.detail_en,
        }
      }
      return null
    })
    .filter(Boolean) as HouseActivity[]
}

export function amenityKeysFromList(list: HouseAmenity[]): string[] {
  return list.map((a) => a.key).filter((k) => AMENITY_CATALOG.some((c) => c.key === k))
}

export function activityKeysFromList(list: HouseActivity[]): string[] {
  return list.map((a) => a.key).filter((k) => ACTIVITY_CATALOG.some((c) => c.key === k))
}

export function amenitiesFromKeys(keys: string[]): HouseAmenity[] {
  return keys
    .map((key) => amenityByKey(key))
    .filter(Boolean)
    .map((a) => ({ key: a!.key, label_es: a!.label_es, label_en: a!.label_en }))
}

export function activitiesFromKeys(keys: string[]): HouseActivity[] {
  return keys
    .map((key) => activityByKey(key))
    .filter(Boolean)
    .map((a) => ({
      key: a!.key,
      label_es: a!.label_es,
      label_en: a!.label_en,
      detail_es: a!.detail_es,
      detail_en: a!.detail_en,
    }))
}
