import { SEED_HOUSES } from '~/data/seed-houses'
import type { House } from '~/types/house'
import { localizeHouse } from '~/utils/localize'

/** Supabase is optional for now — public site uses seed content. */
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
    const list = SEED_HOUSES.filter((h) => (publishedOnly ? h.published : true))
    return list
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((h) => localizeHouse(h, locale.value))
  }

  async function fetchHouseBySlug(slug: string) {
    const found = SEED_HOUSES.find((h) => h.slug === slug && h.published)
    return found ? localizeHouse(found, locale.value) : null
  }

  async function fetchRawHouses() {
    return SEED_HOUSES.slice().sort((a, b) => a.sort_order - b.sort_order) as House[]
  }

  async function fetchRawHouse(id: string) {
    return SEED_HOUSES.find((h) => h.id === id) || null
  }

  return {
    fetchHouses,
    fetchHouseBySlug,
    fetchRawHouses,
    fetchRawHouse,
    hasSupabaseConfig,
  }
}
