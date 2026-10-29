import type { House, HouseAmenity, LocalizedHouse } from '~/types/house'

export function localizeHouse(house: House, locale: string): LocalizedHouse {
  const isEn = locale.startsWith('en')
  const amenities = (house.amenities || []).map((a: HouseAmenity) => ({
    key: a.key,
    label: isEn ? a.label_en : a.label_es,
  }))

  const map_url =
    house.lat != null && house.lng != null
      ? `https://www.google.com/maps/search/?api=1&query=${house.lat},${house.lng}`
      : null

  return {
    id: house.id,
    slug: house.slug,
    name: isEn ? house.name_en : house.name_es,
    location: isEn ? house.location_en : house.location_es,
    address: isEn ? house.address_en : house.address_es,
    property_type: isEn ? house.property_type_en : house.property_type_es,
    description: isEn ? house.description_en : house.description_es,
    capacity: house.capacity,
    bedrooms: house.bedrooms,
    bathrooms: house.bathrooms,
    size_m2: house.size_m2,
    price_label: isEn ? house.price_label_en : house.price_label_es,
    garage: house.garage,
    amenities,
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
  }
}
