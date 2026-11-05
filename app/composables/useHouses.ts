import { SEED_HOUSES } from '~/data/seed-houses'
import type { House, HouseImage, Room, RoomImage } from '~/types/house'
import { normalizeActivities, normalizeAmenities } from '~/utils/features'
import { localizeHouse } from '~/utils/localize'

function normalizeRoom(row: Record<string, unknown>): Room {
  const images = Array.isArray(row.room_images)
    ? (row.room_images as RoomImage[]).slice().sort((a, b) => a.sort_order - b.sort_order)
    : []

  const roomType = String(row.room_type || 'double')
  const bathroomType = String(row.bathroom_type || 'private')

  return {
    id: String(row.id),
    house_id: String(row.house_id),
    name_es: String(row.name_es ?? ''),
    name_en: String(row.name_en ?? ''),
    room_type: (['single', 'double', 'triple'].includes(roomType) ? roomType : 'double') as Room['room_type'],
    bathroom_type: (['private', 'shared'].includes(bathroomType) ? bathroomType : 'private') as Room['bathroom_type'],
    description_es: String(row.description_es ?? ''),
    description_en: String(row.description_en ?? ''),
    capacity: Number(row.capacity ?? 2),
    sort_order: Number(row.sort_order ?? 0),
    published: row.published !== false,
    cover_image_url: row.cover_image_url ? String(row.cover_image_url) : null,
    cover_image_key: row.cover_image_key ? String(row.cover_image_key) : null,
    room_images: images,
  }
}

function normalizeHouse(row: Record<string, unknown>): House {
  const images = Array.isArray(row.house_images)
    ? (row.house_images as HouseImage[]).slice().sort((a, b) => a.sort_order - b.sort_order)
    : []
  const rooms = Array.isArray(row.rooms)
    ? (row.rooms as Record<string, unknown>[]).map(normalizeRoom).sort((a, b) => a.sort_order - b.sort_order)
    : []

  return {
    id: String(row.id),
    slug: String(row.slug),
    name_es: String(row.name_es ?? ''),
    name_en: String(row.name_en ?? ''),
    location_es: String(row.location_es ?? ''),
    location_en: String(row.location_en ?? ''),
    address_es: String(row.address_es ?? ''),
    address_en: String(row.address_en ?? ''),
    property_type_es: String(row.property_type_es ?? ''),
    property_type_en: String(row.property_type_en ?? ''),
    description_es: String(row.description_es ?? ''),
    description_en: String(row.description_en ?? ''),
    capacity: Number(row.capacity ?? 2),
    bedrooms: Number(row.bedrooms ?? 1),
    bathrooms: Number(row.bathrooms ?? 1),
    size_m2: row.size_m2 == null ? null : Number(row.size_m2),
    price_label_es: String(row.price_label_es ?? ''),
    price_label_en: String(row.price_label_en ?? ''),
    garage: Boolean(row.garage),
    amenities: normalizeAmenities(row.amenities),
    activities: normalizeActivities(row.activities),
    cover_image_url: row.cover_image_url ? String(row.cover_image_url) : null,
    cover_image_key: row.cover_image_key ? String(row.cover_image_key) : null,
    lat: row.lat == null ? null : Number(row.lat),
    lng: row.lng == null ? null : Number(row.lng),
    sort_order: Number(row.sort_order ?? 0),
    published: Boolean(row.published),
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
    house_images: images,
    rooms,
  }
}

export function useHouses() {
  const { locale } = useI18n()

  async function fetchFromInsforge(opts: { publishedOnly?: boolean; id?: string; slug?: string } = {}) {
    if (!hasInsforgeConfig()) return null

    try {
      const client = useInsforge()
      let query = client.database
        .from('houses')
        .select('*, house_images(*), rooms(*, room_images(*))')

      if (opts.id) query = query.eq('id', opts.id)
      if (opts.slug) query = query.eq('slug', opts.slug)
      if (opts.publishedOnly) query = query.eq('published', true)

      const { data, error } = await query.order('sort_order', { ascending: true })

      if (error || !data) return null
      return (data as Record<string, unknown>[]).map(normalizeHouse)
    }
    catch {
      return null
    }
  }

  async function fetchHouses(opts: { publishedOnly?: boolean } = {}) {
    const publishedOnly = opts.publishedOnly ?? true
    const remote = await fetchFromInsforge({ publishedOnly })
    const list = remote ?? SEED_HOUSES.filter((h) => (publishedOnly ? h.published : true))
    return list
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((h) => localizeHouse(h, locale.value))
  }

  async function fetchHouseBySlug(slug: string) {
    const remote = await fetchFromInsforge({ slug, publishedOnly: true })
    if (remote?.[0]) return localizeHouse(remote[0], locale.value)
    const found = SEED_HOUSES.find((h) => h.slug === slug && h.published)
    return found ? localizeHouse(found, locale.value) : null
  }

  async function fetchRawHouses() {
    const remote = await fetchFromInsforge({ publishedOnly: false })
    if (remote) return remote.slice().sort((a, b) => a.sort_order - b.sort_order)
    return SEED_HOUSES.slice().sort((a, b) => a.sort_order - b.sort_order) as House[]
  }

  async function fetchRawHouse(id: string) {
    const remote = await fetchFromInsforge({ id, publishedOnly: false })
    if (remote?.[0]) return remote[0]
    return SEED_HOUSES.find((h) => h.id === id) || null
  }

  return {
    fetchHouses,
    fetchHouseBySlug,
    fetchRawHouses,
    fetchRawHouse,
    hasInsforgeConfig,
    /** @deprecated use hasInsforgeConfig */
    hasSupabaseConfig: hasInsforgeConfig,
  }
}
