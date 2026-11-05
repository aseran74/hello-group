<script setup lang="ts">
const lat = defineModel<number | null>('lat', { default: null })
const lng = defineModel<number | null>('lng', { default: null })
const addressEs = defineModel<string>('addressEs', { default: '' })
const addressEn = defineModel<string>('addressEn', { default: '' })
const locationEs = defineModel<string>('locationEs', { default: '' })
const locationEn = defineModel<string>('locationEn', { default: '' })

const query = ref('')
const searching = ref(false)
const searchError = ref<string | null>(null)
const results = ref<Array<{
  display: string
  lat: number
  lng: number
  city: string
}>>([])

const latText = computed({
  get: () => (lat.value == null || Number.isNaN(Number(lat.value)) ? '' : String(lat.value)),
  set: (v: string) => {
    const n = Number(String(v).replace(',', '.').trim())
    lat.value = v.trim() === '' || Number.isNaN(n) ? null : n
  },
})

const lngText = computed({
  get: () => (lng.value == null || Number.isNaN(Number(lng.value)) ? '' : String(lng.value)),
  set: (v: string) => {
    const n = Number(String(v).replace(',', '.').trim())
    lng.value = v.trim() === '' || Number.isNaN(n) ? null : n
  },
})

const previewSrc = computed(() => {
  if (lat.value == null || lng.value == null) return null
  return `https://maps.google.com/maps?q=${lat.value},${lng.value}&z=15&hl=es&output=embed`
})

const fieldClass = 'mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink'
const labelClass = 'block text-sm text-mute'

async function searchAddress() {
  const q = query.value.trim()
  if (!q) return
  searching.value = true
  searchError.value = null
  results.value = []
  try {
    results.value = await $fetch<Array<{
      display: string
      lat: number
      lng: number
      city: string
    }>>('/api/admin/geocode', {
      query: { q },
    })

    if (!results.value.length) {
      searchError.value = 'No se encontraron resultados. Prueba con otra dirección.'
    }
  }
  catch {
    searchError.value = 'No se pudo buscar la dirección. Inténtalo de nuevo.'
  }
  finally {
    searching.value = false
  }
}

function applyResult(item: { display: string; lat: number; lng: number; city: string }) {
  lat.value = item.lat
  lng.value = item.lng
  addressEs.value = item.display
  if (!addressEn.value.trim()) addressEn.value = item.display
  if (item.city) {
    if (!locationEs.value.trim()) locationEs.value = item.city
    if (!locationEn.value.trim()) locationEn.value = item.city
  }
  results.value = []
  query.value = item.display
}
</script>

<template>
  <section class="space-y-4 border border-line bg-white p-5">
    <div>
      <h2 class="font-display text-lg font-semibold">Ubicación</h2>
      <p class="mt-1 text-sm text-mute">
        Busca una dirección o pega latitud/longitud. Se usa en el mapa y en las distancias.
      </p>
    </div>

    <div class="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="space-y-3">
        <div>
          <label :class="labelClass">Buscar dirección</label>
          <div class="mt-1 flex gap-2">
            <input
              v-model="query"
              type="text"
              :class="fieldClass"
              class="!mt-0"
              placeholder="Ej. Mar Mediterráneo 20, Madrid"
              @keydown.enter.prevent="searchAddress"
            >
            <button
              type="button"
              class="shrink-0 bg-ink px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              :disabled="searching || !query.trim()"
              @click="searchAddress"
            >
              {{ searching ? 'Buscando…' : 'Buscar' }}
            </button>
          </div>
          <p v-if="searchError" class="mt-2 text-sm text-red-700">{{ searchError }}</p>
          <ul v-if="results.length" class="mt-2 max-h-48 overflow-auto border border-line">
            <li v-for="(item, idx) in results" :key="`${item.lat}-${item.lng}-${idx}`">
              <button
                type="button"
                class="w-full border-b border-line px-3 py-2 text-left text-sm hover:bg-paper"
                @click="applyResult(item)"
              >
                {{ item.display }}
              </button>
            </li>
          </ul>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label :class="labelClass">Dirección ES</label>
            <input v-model="addressEs" type="text" :class="fieldClass">
          </div>
          <div class="sm:col-span-2">
            <label :class="labelClass">Dirección EN</label>
            <input v-model="addressEn" type="text" :class="fieldClass">
          </div>
          <div>
            <label :class="labelClass">Ubicación corta ES</label>
            <input v-model="locationEs" type="text" :class="fieldClass" placeholder="Madrid">
          </div>
          <div>
            <label :class="labelClass">Ubicación corta EN</label>
            <input v-model="locationEn" type="text" :class="fieldClass" placeholder="Madrid">
          </div>
          <div>
            <label :class="labelClass">Latitud</label>
            <input v-model="latText" type="text" inputmode="decimal" :class="fieldClass" placeholder="40.4168">
          </div>
          <div>
            <label :class="labelClass">Longitud</label>
            <input v-model="lngText" type="text" inputmode="decimal" :class="fieldClass" placeholder="-3.7038">
          </div>
        </div>
      </div>

      <div class="min-h-[16rem] overflow-hidden border border-line bg-paper">
        <iframe
          v-if="previewSrc"
          class="h-full min-h-[16rem] w-full border-0"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          :src="previewSrc"
          title="Vista previa ubicación"
        />
        <div v-else class="flex h-full min-h-[16rem] items-center justify-center px-4 text-center text-sm text-mute">
          Busca una dirección o introduce lat/lng para ver el mapa.
        </div>
      </div>
    </div>
  </section>
</template>
