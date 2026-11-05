<script setup lang="ts">
import { ACTIVITY_CATALOG, AMENITY_CATALOG, bathroomTypeLabel, roomTypeLabel } from '~/data/feature-catalog'
import type { HouseImage, Room } from '~/types/house'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const route = useRoute()
const { t } = useI18n()
const { fetchRawHouse } = useHouses()
const {
  saving,
  uploading,
  message,
  error,
  saveHouse,
  uploadCover,
  uploadGallery,
  deleteGalleryImage,
  deleteHouse,
  houseToForm,
} = useHouseAdmin()

const id = computed(() => String(route.params.id))
const { data: house, refresh } = await useAsyncData(
  () => `admin-house-${id.value}`,
  () => fetchRawHouse(id.value),
  { watch: [id] },
)

if (!house.value) {
  throw createError({ statusCode: 404, statusMessage: 'House not found' })
}

const form = reactive(houseToForm(house.value))
const images = ref<HouseImage[]>([...(house.value.house_images || [])])
const rooms = ref<Room[]>([...(house.value.rooms || [])].sort((a, b) => a.sort_order - b.sort_order))

watch(house, (h) => {
  if (!h) return
  Object.assign(form, houseToForm(h))
  images.value = [...(h.house_images || [])]
  rooms.value = [...(h.rooms || [])].sort((a, b) => a.sort_order - b.sort_order)
})

async function onSave() {
  const roomCount = rooms.value.length
  if (roomCount > 0) form.bedrooms = roomCount
  const data = await saveHouse(id.value, form)
  if (data) await refresh()
}

async function onCover(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const ok = await uploadCover(id.value, form, file)
  if (ok) await refresh()
  input.value = ''
}

async function onGallery(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  const inserted = await uploadGallery(id.value, input.files, images.value.length)
  if (inserted.length) await refresh()
  input.value = ''
}

async function onDeleteImage(img: HouseImage) {
  if (!confirm('¿Eliminar esta foto?')) return
  const ok = await deleteGalleryImage(img)
  if (ok) await refresh()
}

async function onDeleteHouse() {
  if (!confirm(`¿Eliminar «${form.name_es}»? Esta acción no se puede deshacer.`)) return
  const ok = await deleteHouse(id.value)
  if (ok) await navigateTo('/admin/casas')
}

const fieldClass = 'mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink'
const labelClass = 'block text-sm text-mute'
</script>

<template>
  <div v-if="house">
    <NuxtLink to="/admin/casas" class="text-sm text-mute hover:text-ink">← {{ t('admin.back') }}</NuxtLink>
    <div class="mt-4 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="font-display text-3xl font-semibold text-ink">{{ form.name_es || 'Casa' }}</h1>
        <p class="mt-1 text-sm text-mute">{{ form.slug }} · {{ rooms.length }} habitaciones</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="border border-line bg-white px-4 py-2 text-sm text-red-700 hover:border-red-700"
          @click="onDeleteHouse"
        >
          {{ t('admin.delete') }}
        </button>
        <button
          type="button"
          class="bg-ink px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          :disabled="saving"
          @click="onSave"
        >
          {{ saving ? t('common.loading') : t('admin.save') }}
        </button>
      </div>
    </div>

    <p v-if="message" class="mt-4 text-sm text-emerald-800">{{ message }}</p>
    <p v-if="error" class="mt-4 text-sm text-red-700">{{ error }}</p>

    <form class="mt-8 grid gap-8 lg:grid-cols-2" @submit.prevent="onSave">
      <section class="space-y-4 border border-line bg-white p-5">
        <h2 class="font-display text-lg font-semibold">Datos principales</h2>
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label :class="labelClass">Slug</label>
            <input v-model="form.slug" :class="fieldClass" required>
          </div>
          <div class="flex items-end gap-2 pb-2">
            <input id="published" v-model="form.published" type="checkbox" class="size-4">
            <label for="published" class="text-sm">{{ t('admin.published') }}</label>
          </div>
          <div>
            <label :class="labelClass">Nombre ES</label>
            <input v-model="form.name_es" :class="fieldClass" required>
          </div>
          <div>
            <label :class="labelClass">Nombre EN</label>
            <input v-model="form.name_en" :class="fieldClass" required>
          </div>
          <div>
            <label :class="labelClass">Tipo ES</label>
            <input v-model="form.property_type_es" :class="fieldClass">
          </div>
          <div>
            <label :class="labelClass">Tipo EN</label>
            <input v-model="form.property_type_en" :class="fieldClass">
          </div>
        </div>
        <div>
          <label :class="labelClass">Descripción ES</label>
          <textarea v-model="form.description_es" rows="5" :class="fieldClass" />
        </div>
        <div>
          <label :class="labelClass">Descripción EN</label>
          <textarea v-model="form.description_en" rows="5" :class="fieldClass" />
        </div>
      </section>

      <section class="space-y-4 border border-line bg-white p-5">
        <h2 class="font-display text-lg font-semibold">Capacidad y mapa</h2>
        <div class="grid gap-3 sm:grid-cols-3">
          <div>
            <label :class="labelClass">Huéspedes</label>
            <input v-model.number="form.capacity" type="number" min="1" :class="fieldClass">
          </div>
          <div>
            <label :class="labelClass">Baños comunes</label>
            <input v-model.number="form.bathrooms" type="number" min="0" :class="fieldClass">
          </div>
          <div>
            <label :class="labelClass">m²</label>
            <input v-model.number="form.size_m2" type="number" min="0" :class="fieldClass">
          </div>
          <div>
            <label :class="labelClass">Orden</label>
            <input v-model.number="form.sort_order" type="number" :class="fieldClass">
          </div>
          <div class="flex items-end gap-2 pb-2">
            <input id="garage" v-model="form.garage" type="checkbox" class="size-4">
            <label for="garage" class="text-sm">Garaje</label>
          </div>
          <div>
            <label :class="labelClass">Precio ES</label>
            <input v-model="form.price_label_es" :class="fieldClass">
          </div>
          <div class="sm:col-span-2">
            <label :class="labelClass">Precio EN</label>
            <input v-model="form.price_label_en" :class="fieldClass">
          </div>
        </div>
        <p class="text-xs text-mute">
          El nº de habitaciones se calcula desde las fichas de habitación ({{ rooms.length }}).
        </p>
      </section>
    </form>

    <div class="mt-8">
      <AdminLocationPicker
        v-model:lat="form.lat"
        v-model:lng="form.lng"
        v-model:address-es="form.address_es"
        v-model:address-en="form.address_en"
        v-model:location-es="form.location_es"
        v-model:location-en="form.location_en"
      />
      <div class="mt-3">
        <button
          type="button"
          class="bg-ink px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          :disabled="saving"
          @click="onSave"
        >
          {{ saving ? t('common.loading') : 'Guardar ubicación' }}
        </button>
      </div>
    </div>

    <section class="mt-8 space-y-8 border border-line bg-white p-5">
      <AdminFeatureToggleGrid
        v-model="form.amenity_keys"
        title="Servicios"
        :items="AMENITY_CATALOG"
      />
      <AdminFeatureToggleGrid
        v-model="form.activity_keys"
        title="Actividades / entorno"
        :items="ACTIVITY_CATALOG"
      />
      <button
        type="button"
        class="bg-ink px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        :disabled="saving"
        @click="onSave"
      >
        Guardar servicios y actividades
      </button>
    </section>

    <section class="mt-8 border border-line bg-white p-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="font-display text-lg font-semibold">Habitaciones</h2>
          <p class="mt-1 text-sm text-mute">
            Cada habitación: tipo (sencilla / doble / triple), baño y fotos propias.
          </p>
        </div>
        <NuxtLink
          :to="`/admin/casas/${id}/habitaciones/nueva`"
          class="bg-ink px-4 py-2 text-sm font-medium text-white"
        >
          Añadir habitación
        </NuxtLink>
      </div>

      <div v-if="rooms.length" class="mt-5 grid gap-3 sm:grid-cols-2">
        <NuxtLink
          v-for="room in rooms"
          :key="room.id"
          :to="`/admin/casas/${id}/habitaciones/${room.id}`"
          class="flex gap-3 border border-line p-3 transition hover:border-ink"
        >
          <img
            :src="room.cover_image_url || room.room_images?.[0]?.url || '/placeholders/house-1.svg'"
            :alt="room.name_es"
            class="size-20 shrink-0 object-cover"
          >
          <div class="min-w-0">
            <p class="font-medium text-ink">{{ room.name_es || `Habitación ${room.sort_order}` }}</p>
            <p class="mt-1 text-sm text-mute">
              {{ roomTypeLabel(room.room_type) }}
              · {{ bathroomTypeLabel(room.bathroom_type) }}
            </p>
            <p class="mt-1 text-xs text-mute">
              {{ room.room_images?.length || 0 }} fotos
              · {{ room.published ? 'Publicada' : 'Borrador' }}
            </p>
          </div>
        </NuxtLink>
      </div>
      <p v-else class="mt-4 text-sm text-mute">
        Aún no hay habitaciones. En Madrid Norte puedes crear 14 (o las que necesites).
      </p>
    </section>

    <section class="mt-8 border border-line bg-white p-5">
      <h2 class="font-display text-lg font-semibold">{{ t('admin.cover') }}</h2>
      <div class="mt-4 grid gap-4 sm:grid-cols-[16rem_1fr]">
        <img
          :src="form.cover_image_url || '/placeholders/house-1.svg'"
          :alt="form.name_es"
          class="aspect-[4/3] w-full object-cover"
        >
        <div>
          <label class="inline-flex cursor-pointer bg-ink px-4 py-2 text-sm font-medium text-white">
            {{ uploading ? t('common.loading') : t('admin.upload') }}
            <input type="file" accept="image/*" class="hidden" :disabled="uploading" @change="onCover">
          </label>
        </div>
      </div>
    </section>

    <section class="mt-8 border border-line bg-white p-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="font-display text-lg font-semibold">Galería de la propiedad</h2>
        <label class="inline-flex cursor-pointer border border-line px-4 py-2 text-sm hover:border-ink">
          {{ uploading ? t('common.loading') : 'Añadir fotos' }}
          <input type="file" accept="image/*" multiple class="hidden" :disabled="uploading" @change="onGallery">
        </label>
      </div>
      <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div v-for="img in images" :key="img.id" class="relative">
          <img :src="img.url" alt="" class="aspect-[4/3] w-full object-cover">
          <button
            type="button"
            class="absolute right-2 top-2 bg-white/90 px-2 py-1 text-xs text-red-700"
            @click="onDeleteImage(img)"
          >
            {{ t('admin.delete') }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
