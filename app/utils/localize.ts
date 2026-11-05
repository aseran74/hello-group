import { bathroomTypeLabel, roomTypeLabel } from '~/data/feature-catalog'
import type { House, HouseActivity, HouseAmenity, LocalizedHouse, LocalizedRoom, Room } from '~/types/house'

export function localizeRoom(room: Room, locale: string): LocalizedRoom {
  const isEn = locale.startsWith('en')
  return {
    id: room.id,
    name: isEn ? room.name_en || room.name_es : room.name_es,
    room_type: room.room_type,
    room_type_label: roomTypeLabel(room.room_type, locale),
    bathroom_type: room.bathroom_type,
    bathroom_label: bathroomTypeLabel(room.bathroom_type, locale),
    description: isEn ? room.description_en || room.description_es : room.description_es,
    capacity: room.capacity,
    cover_image_url: room.cover_image_url,
    images: (room.room_images || [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({
        id: img.id,
        url: img.url,
        alt: (isEn ? img.alt_en : img.alt_es) || room.name_es,
      })),
  }
}

export function localizeHouse(house: House, locale: string): LocalizedHouse {
  const isEn = locale.startsWith('en')
  const amenities = (house.amenities || []).map((a: HouseAmenity) => ({
    key: a.key,
    label: isEn ? a.label_en : a.label_es,
  }))
  const activities = (house.activities || []).map((a: HouseActivity) => ({
    key: a.key,
    label: isEn ? a.label_en : a.label_es,
    detail: isEn ? a.detail_en : a.detail_es,
  }))

  const rooms = (house.rooms || [])
    .filter((r) => r.published !== false)
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((r) => localizeRoom(r, locale))

  const map_url =
    house.lat != null && house.lng != null
      ? `https://www.google.com/maps/search/?api=1&query=${house.lat},${house.lng}`
      : null

  const bedrooms = rooms.length > 0 ? rooms.length : house.bedrooms

  return {
    id: house.id,
    slug: house.slug,
    name: isEn ? house.name_en : house.name_es,
    location: isEn ? house.location_en : house.location_es,
    address: isEn ? house.address_en : house.address_es,
    property_type: isEn ? house.property_type_en : house.property_type_es,
    description: isEn ? house.description_en : house.description_es,
    capacity: house.capacity,
    bedrooms,
    bathrooms: house.bathrooms,
    size_m2: house.size_m2,
    price_label: isEn ? house.price_label_en : house.price_label_es,
    garage: house.garage,
    amenities,
    activities,
    cover_image_url: house.cover_image_url,
    lat: house.lat,
    lng: house.lng,
    sort_order: house.sort_order,
    map_url,
    images: (house.house_images || [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({
        id: img.id,
        url: img.url,
        alt: (isEn ? img.alt_en : img.alt_es) || house.name_es,
      })),
    rooms,
  }
}
