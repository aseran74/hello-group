import type { House, HouseAmenity, LocalizedHouse } from '~/types/house'

export function localizeHouse(house: House, locale: string): LocalizedHouse {
  const isEn = locale.startsWith('en')
  const amenities = (house.amenities || []).map((a: HouseAmenity) => ({
    key: a.key,
    label: isEn ? a.label_en : a.label_es,
  }))

  return {
    id: house.id,
    slug: house.slug,
    name: isEn ? house.name_en : house.name_es,
    location: isEn ? house.location_en : house.location_es,
    description: isEn ? house.description_en : house.description_es,
    capacity: house.capacity,
    bedrooms: house.bedrooms,
    amenities,
    cover_image_url: house.cover_image_url,
    lat: house.lat,
    lng: house.lng,
    sort_order: house.sort_order,
    images: (house.house_images || [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({
        id: img.id,
        url: img.url,
        alt: (isEn ? img.alt_en : img.alt_es) || house.name_es,
      })),
  }
}
