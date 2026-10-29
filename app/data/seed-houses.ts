import type { House } from '~/types/house'

const amenity = (key: string, label_es: string, label_en: string) => ({
  key,
  label_es,
  label_en,
})

/** Fallback content when Supabase is not configured yet. */
export const SEED_HOUSES: House[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    slug: 'casa-del-puerto',
    name_es: 'Casa del Puerto',
    name_en: 'Casa del Puerto',
    location_es: 'Cangas de Onís',
    location_en: 'Cangas de Onís',
    description_es:
      'Casa de piedra junto al valle, con vistas a los Picos y un jardín para desayunar al aire libre.',
    description_en:
      'A stone house by the valley, with views towards the Picos and a garden for outdoor breakfasts.',
    capacity: 6,
    bedrooms: 3,
    amenities: [
      amenity('wifi', 'Wi‑Fi', 'Wi‑Fi'),
      amenity('fireplace', 'Chimenea', 'Fireplace'),
      amenity('parking', 'Parking', 'Parking'),
      amenity('garden', 'Jardín', 'Garden'),
    ],
    cover_image_url: '/placeholders/house-1.svg',
    lat: 43.35,
    lng: -5.13,
    sort_order: 1,
    published: true,
    house_images: [],
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    slug: 'la-braña',
    name_es: 'La Braña',
    name_en: 'La Braña',
    location_es: 'Somiedo',
    location_en: 'Somiedo',
    description_es:
      'Refugio en la montaña verde, ideal para caminantes y noches de silencio total.',
    description_en:
      'A green-mountain refuge for walkers and nights of complete quiet.',
    capacity: 4,
    bedrooms: 2,
    amenities: [
      amenity('wifi', 'Wi‑Fi', 'Wi‑Fi'),
      amenity('heating', 'Calefacción', 'Heating'),
      amenity('kitchen', 'Cocina equipada', 'Equipped kitchen'),
    ],
    cover_image_url: '/placeholders/house-2.svg',
    lat: 43.1,
    lng: -6.25,
    sort_order: 2,
    published: true,
    house_images: [],
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    slug: 'casa-marina',
    name_es: 'Casa Marina',
    name_en: 'Casa Marina',
    location_es: 'Llanes',
    location_en: 'Llanes',
    description_es:
      'A pocos minutos de las playas del oriente, con luz atlántica y terraza amplia.',
    description_en:
      'Minutes from the eastern beaches, with Atlantic light and a wide terrace.',
    capacity: 8,
    bedrooms: 4,
    amenities: [
      amenity('wifi', 'Wi‑Fi', 'Wi‑Fi'),
      amenity('terrace', 'Terraza', 'Terrace'),
      amenity('bbq', 'Barbacoa', 'BBQ'),
      amenity('parking', 'Parking', 'Parking'),
    ],
    cover_image_url: '/placeholders/house-3.svg',
    lat: 43.42,
    lng: -4.75,
    sort_order: 3,
    published: true,
    house_images: [],
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    slug: 'el-huerto',
    name_es: 'El Huerto',
    name_en: 'El Huerto',
    location_es: 'Villaviciosa',
    location_en: 'Villaviciosa',
    description_es:
      'Entre sidra y manzanos: una casa familiar con huerto y ambiente de aldea.',
    description_en:
      'Among cider and apple trees: a family home with a kitchen garden and village calm.',
    capacity: 5,
    bedrooms: 3,
    amenities: [
      amenity('wifi', 'Wi‑Fi', 'Wi‑Fi'),
      amenity('garden', 'Huerto', 'Garden'),
      amenity('pets', 'Mascotas a consultar', 'Pets on request'),
    ],
    cover_image_url: '/placeholders/house-4.svg',
    lat: 43.48,
    lng: -5.43,
    sort_order: 4,
    published: true,
    house_images: [],
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    slug: 'casa-del-bosque',
    name_es: 'Casa del Bosque',
    name_en: 'Casa del Bosque',
    location_es: 'Taramundi',
    location_en: 'Taramundi',
    description_es:
      'Envuelta en bosque y niebla, perfecta para desconectar y leer junto a la ventana.',
    description_en:
      'Wrapped in forest and mist — perfect for switching off and reading by the window.',
    capacity: 4,
    bedrooms: 2,
    amenities: [
      amenity('wifi', 'Wi‑Fi', 'Wi‑Fi'),
      amenity('fireplace', 'Chimenea', 'Fireplace'),
      amenity('views', 'Vistas al bosque', 'Forest views'),
    ],
    cover_image_url: '/placeholders/house-5.svg',
    lat: 43.36,
    lng: -7.11,
    sort_order: 5,
    published: true,
    house_images: [],
  },
]
