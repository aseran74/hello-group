<script setup lang="ts">
import type { HouseAmenity } from '~/types/house'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const route = useRoute()
const { t } = useI18n()
const { fetchRawHouse, hasSupabaseConfig } = useHouses()
const client = useSupabaseClient()
const config = useRuntimeConfig()

const id = computed(() => String(route.params.id))
const { data: house, refresh } = await useAsyncData(
  () => `admin-house-${id.value}`,
  () => fetchRawHouse(id.value),
  { watch: [id] },
)

if (!house.value) {
  throw createError({ statusCode: 404, statusMessage: 'House not found' })
}

const form = reactive({
  slug: house.value.slug,
  name_es: house.value.name_es,
  name_en: house.value.name_en,
  location_es: house.value.location_es,
  location_en: house.value.location_en,
  description_es: house.value.description_es,
  description_en: house.value.description_en,
  capacity: house.value.capacity,
  bedrooms: house.value.bedrooms,
  amenitiesJson: JSON.stringify(house.value.amenities || [], null, 2),
  cover_image_url: house.value.cover_image_url || '',
  lat: house.value.lat ?? '',
  lng: house.value.lng ?? '',
  sort_order: house.value.sort_order,
  published: house.value.published,
})

const message = ref('')
const saving = ref(false)
const uploading = ref(false)

async function save() {
  if (!hasSupabaseConfig()) {
    message.value = 'Supabase no configurado'
    return
  }
  saving.value = true
  message.value = ''
  let amenities: HouseAmenity[] = []
  try {
    amenities = JSON.parse(form.amenitiesJson || '[]')
  }
  catch {
    saving.value = false
    message.value = 'Amenities JSON inválido'
    return
  }

  const { error } = await client
    .from('houses')
    .update({
      slug: form.slug,
      name_es: form.name_es,
      name_en: form.name_en,
      location_es: form.location_es,
      location_en: form.location_en,
      description_es: form.description_es,
      description_en: form.description_en,
      capacity: Number(form.capacity),
      bedrooms: Number(form.bedrooms),
      amenities,
      cover_image_url: form.cover_image_url || null,
      lat: form.lat === '' ? null : Number(form.lat),
      lng: form.lng === '' ? null : Number(form.lng),
      sort_order: Number(form.sort_order),
      published: form.published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id.value)

  saving.value = false
  message.value = error ? error.message : t('admin.saved')
  if (!error) await refresh()
}

async function onUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !hasSupabaseConfig()) return
  uploading.value = true
  const path = `${id.value}/${Date.now()}-${file.name}`
  const { error: uploadError } = await client.storage.from('houses').upload(path, file, { upsert: true })
  if (uploadError) {
    uploading.value = false
    message.value = uploadError.message
    return
  }
  const base = config.public.supabaseUrl.replace(/\/$/, '')
  const url = `${base}/storage/v1/object/public/houses/${path}`
  await client.from('house_images').insert({
    house_id: id.value,
    url,
    alt_es: form.name_es,
    alt_en: form.name_en,
    sort_order: (house.value?.house_images?.length || 0) + 1,
  })
  if (!form.cover_image_url) {
    form.cover_image_url = url
    await client.from('houses').update({ cover_image_url: url }).eq('id', id.value)
  }
  uploading.value = false
  message.value = t('admin.saved')
  await refresh()
  input.value = ''
}

async function deleteImage(imageId: string) {
  if (!confirm('¿Eliminar imagen?')) return
  const { error } = await client.from('house_images').delete().eq('id', imageId)
  if (error) message.value = error.message
  else await refresh()
}
</script>

<template>
  <div v-if="house">
    <div class="mb-6 flex items-center justify-between gap-4">
      <NuxtLink to="/admin/casas" class="text-sm text-slate-muted hover:text-moss">← {{ t('admin.back') }}</NuxtLink>
      <button type="button" class="btn-primary" :disabled="saving" @click="save">{{ t('admin.save') }}</button>
    </div>
    <p v-if="message" class="mb-4 text-sm text-moss-soft">{{ message }}</p>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="space-y-4 border border-fog bg-white p-5">
        <div>
          <label class="label">Slug</label>
          <input v-model="form.slug" class="field">
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="label">Nombre ES</label>
            <input v-model="form.name_es" class="field">
          </div>
          <div>
            <label class="label">Name EN</label>
            <input v-model="form.name_en" class="field">
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="label">Ubicación ES</label>
            <input v-model="form.location_es" class="field">
          </div>
          <div>
            <label class="label">Location EN</label>
            <input v-model="form.location_en" class="field">
          </div>
        </div>
        <div>
          <label class="label">Descripción ES</label>
          <textarea v-model="form.description_es" class="field min-h-28" />
        </div>
        <div>
          <label class="label">Description EN</label>
          <textarea v-model="form.description_en" class="field min-h-28" />
        </div>
      </div>

      <div class="space-y-4 border border-fog bg-white p-5">
        <div class="grid gap-4 sm:grid-cols-3">
          <div>
            <label class="label">Capacidad</label>
            <input v-model.number="form.capacity" type="number" min="1" class="field">
          </div>
          <div>
            <label class="label">Dormitorios</label>
            <input v-model.number="form.bedrooms" type="number" min="0" class="field">
          </div>
          <div>
            <label class="label">Orden</label>
            <input v-model.number="form.sort_order" type="number" class="field">
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="label">Lat</label>
            <input v-model="form.lat" class="field">
          </div>
          <div>
            <label class="label">Lng</label>
            <input v-model="form.lng" class="field">
          </div>
        </div>
        <div>
          <label class="label">{{ t('admin.cover') }} URL</label>
          <input v-model="form.cover_image_url" class="field">
        </div>
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.published" type="checkbox" class="accent-moss">
          {{ t('admin.published') }}
        </label>
        <div>
          <label class="label">Amenities (JSON)</label>
          <textarea v-model="form.amenitiesJson" class="field min-h-36 font-mono text-xs" />
        </div>
        <div>
          <label class="label">{{ t('admin.upload') }}</label>
          <input type="file" accept="image/*" class="block w-full text-sm" :disabled="uploading" @change="onUpload">
        </div>
        <div v-if="house.house_images?.length" class="grid grid-cols-2 gap-3">
          <div v-for="img in house.house_images" :key="img.id" class="relative">
            <img :src="img.url" alt="" class="aspect-video w-full object-cover">
            <button
              type="button"
              class="absolute right-1 top-1 bg-white/90 px-2 py-0.5 text-xs text-red-700"
              @click="deleteImage(img.id)"
            >
              {{ t('admin.delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
