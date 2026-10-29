export interface HouseAmenity {
  key: string
  label_es: string
  label_en: string
}

export interface HouseImage {
  id: string
  house_id: string
  url: string
  alt_es: string | null
  alt_en: string | null
  sort_order: number
}

export interface House {
  id: string
  slug: string
  name_es: string
  name_en: string
  location_es: string
  location_en: string
  description_es: string
  description_en: string
  capacity: number
  bedrooms: number
  amenities: HouseAmenity[]
  cover_image_url: string | null
  lat: number | null
  lng: number | null
  sort_order: number
  published: boolean
  created_at?: string
  updated_at?: string
  house_images?: HouseImage[]
}

export interface Inquiry {
  id: string
  house_id: string | null
  name: string
  email: string
  phone: string | null
  message: string
  locale: string
  status: 'new' | 'read' | 'archived'
  created_at: string
  houses?: Pick<House, 'id' | 'slug' | 'name_es' | 'name_en'> | null
}

export type LocalizedHouse = {
  id: string
  slug: string
  name: string
  location: string
  description: string
  capacity: number
  bedrooms: number
  amenities: { key: string; label: string }[]
  cover_image_url: string | null
  lat: number | null
  lng: number | null
  sort_order: number
  images: { id: string; url: string; alt: string }[]
}
