import { SEED_HOUSES } from '~/data/seed-houses'
import type { House } from '~/types/house'
import { localizeHouse } from '~/utils/localize'

function hasSupabaseConfig() {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl || ''
  const key = config.public.supabaseKey || ''
  if (!url || !key) return false
  if (url.includes('placeholder') || key.includes('placeholder')) return false
  return true
}

export function useHouses() {
  const { locale } = useI18n()

  async function fetchHouses(opts: { publishedOnly?: boolean } = {}) {
    const publishedOnly = opts.publishedOnly ?? true

    if (!hasSupabaseConfig()) {
      const list = SEED_HOUSES.filter((h) => (publishedOnly ? h.published : true))
      return list
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((h) => localizeHouse(h, locale.value))
    }

    const client = useSupabaseClient()
    let query = client
      .from('houses')
      .select('*, house_images(*)')
      .order('sort_order', { ascending: true })

    if (publishedOnly) {
      query = query.eq('published', true)
    }

    const { data, error } = await query
    if (error) {
      console.warn('[useHouses] falling back to seed:', error.message)
      return SEED_HOUSES.filter((h) => (publishedOnly ? h.published : true)).map((h) =>
        localizeHouse(h, locale.value),
      )
    }

    return ((data || []) as House[]).map((h) => localizeHouse(h, locale.value))
  }

  async function fetchHouseBySlug(slug: string) {
    if (!hasSupabaseConfig()) {
      const found = SEED_HOUSES.find((h) => h.slug === slug && h.published)
      return found ? localizeHouse(found, locale.value) : null
    }

    const client = useSupabaseClient()
    const { data, error } = await client
      .from('houses')
      .select('*, house_images(*)')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()

    if (error || !data) {
      const found = SEED_HOUSES.find((h) => h.slug === slug && h.published)
      return found ? localizeHouse(found, locale.value) : null
    }

    return localizeHouse(data as House, locale.value)
  }

  async function fetchRawHouses() {
    if (!hasSupabaseConfig()) {
      return SEED_HOUSES.slice().sort((a, b) => a.sort_order - b.sort_order)
    }

    const client = useSupabaseClient()
    const { data, error } = await client
      .from('houses')
      .select('*, house_images(*)')
      .order('sort_order', { ascending: true })

    if (error) throw error
    return (data || []) as House[]
  }

  async function fetchRawHouse(id: string) {
    if (!hasSupabaseConfig()) {
      return SEED_HOUSES.find((h) => h.id === id) || null
    }

    const client = useSupabaseClient()
    const { data, error } = await client
      .from('houses')
      .select('*, house_images(*)')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data as House | null
  }

  return {
    fetchHouses,
    fetchHouseBySlug,
    fetchRawHouses,
    fetchRawHouse,
    hasSupabaseConfig,
  }
}
