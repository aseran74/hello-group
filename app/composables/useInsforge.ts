import { createClient } from '@insforge/sdk'

type InsforgeClient = ReturnType<typeof createClient>
let browserClient: InsforgeClient | null = null

export function hasInsforgeConfig() {
  const config = useRuntimeConfig()
  const url = String(config.public.insforgeUrl || '')
  const key = String(config.public.insforgeAnonKey || '')
  if (!url || !key) return false
  if (url.includes('placeholder') || key.includes('placeholder')) return false
  return true
}

/** Cliente InsForge (anon). En browser se reutiliza una instancia. */
export function useInsforge() {
  const config = useRuntimeConfig()
  const baseUrl = String(config.public.insforgeUrl || '')
  const anonKey = String(config.public.insforgeAnonKey || '')

  if (!baseUrl || !anonKey) {
    throw new Error('InsForge no está configurado (NUXT_PUBLIC_INSFORGE_URL / ANON_KEY)')
  }

  if (import.meta.client) {
    if (!browserClient) {
      browserClient = createClient({ baseUrl, anonKey })
    }
    return browserClient
  }

  return createClient({ baseUrl, anonKey })
}
