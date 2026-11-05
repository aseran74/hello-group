<script setup lang="ts">
import { BATHROOM_TYPES, ROOM_TYPES } from '~/data/feature-catalog'
import type { RoomImage } from '~/types/house'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const route = useRoute()
const { t } = useI18n()
const houseId = computed(() => String(route.params.id))
const roomId = computed(() => String(route.params.roomId))

const { fetchRawHouse } = useHouses()
const {
  saving,
  uploading,
  message,
  error,
  saveRoom,
  uploadRoomCover,
  uploadRoomGallery,
  deleteRoomImage,
  deleteRoom,
  roomToForm,
} = useRoomAdmin()

const { data: house, refresh } = await useAsyncData(
  () => `admin-house-room-${houseId.value}-${roomId.value}`,
  () => fetchRawHouse(houseId.value),
  { watch: [houseId, roomId] },
)

const room = computed(() => house.value?.rooms?.find((r) => r.id === roomId.value) || null)

if (!house.value || !room.value) {
  throw createError({ statusCode: 404, statusMessage: 'Room not found' })
}

const form = reactive(roomToForm(room.value))
const images = ref<RoomImage[]>([...(room.value.room_images || [])])

watch(room, (r) => {
  if (!r) return
  Object.assign(form, roomToForm(r))
  images.value = [...(r.room_images || [])]
})

watch(() => form.room_type, (type) => {
  const meta = ROOM_TYPES.find((r) => r.key === type)
  if (meta) form.capacity = meta.capacity
})

const fieldClass = 'mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink'
const labelClass = 'block text-sm text-mute'

async function onSave() {
  const data = await saveRoom(houseId.value, roomId.value, form)
  if (data) await refresh()
}

async function onCover(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const ok = await uploadRoomCover(roomId.value, houseId.value, form, file)
  if (ok) await refresh()
  input.value = ''
}

async function onGallery(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  const inserted = await uploadRoomGallery(roomId.value, houseId.value, input.files, images.value.length)
  if (inserted.length) await refresh()
  input.value = ''
}

async function onDeleteImage(img: RoomImage) {
  if (!confirm('¿Eliminar esta foto?')) return
  const ok = await deleteRoomImage(img)
  if (ok) await refresh()
}

async function onDelete() {
  if (!confirm(`¿Eliminar «${form.name_es}»?`)) return
  const ok = await deleteRoom(roomId.value)
  if (ok) await navigateTo(`/admin/casas/${houseId.value}`)
}
</script>

<template>
  <div v-if="room">
    <NuxtLink :to="`/admin/casas/${houseId}`" class="text-sm text-mute hover:text-ink">
      ← {{ house?.name_es }}
    </NuxtLink>

    <div class="mt-4 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="font-display text-3xl font-semibold text-ink">{{ form.name_es }}</h1>
        <p class="mt-1 text-sm text-mute">{{ house?.name_es }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="border border-line bg-white px-4 py-2 text-sm text-red-700"
          @click="onDelete"
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

    <form class="mt-8 grid gap-6 lg:grid-cols-2" @submit.prevent="onSave">
      <section class="space-y-4 border border-line bg-white p-5">
        <h2 class="font-display text-lg font-semibold">Datos</h2>
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label :class="labelClass">Nombre ES</label>
            <input v-model="form.name_es" :class="fieldClass" required>
          </div>
          <div>
            <label :class="labelClass">Nombre EN</label>
            <input v-model="form.name_en" :class="fieldClass" required>
          </div>
          <div>
            <label :class="labelClass">Tipo de habitación</label>
            <select v-model="form.room_type" :class="fieldClass">
              <option v-for="opt in ROOM_TYPES" :key="opt.key" :value="opt.key">
                {{ opt.label_es }}
              </option>
            </select>
          </div>
          <div>
            <label :class="labelClass">Baño</label>
            <select v-model="form.bathroom_type" :class="fieldClass">
              <option v-for="opt in BATHROOM_TYPES" :key="opt.key" :value="opt.key">
                {{ opt.label_es }}
              </option>
            </select>
          </div>
          <div>
            <label :class="labelClass">Capacidad</label>
            <input v-model.number="form.capacity" type="number" min="1" :class="fieldClass">
          </div>
          <div>
            <label :class="labelClass">Orden</label>
            <input v-model.number="form.sort_order" type="number" :class="fieldClass">
          </div>
          <div class="flex items-end gap-2 pb-2 sm:col-span-2">
            <input id="pub" v-model="form.published" type="checkbox" class="size-4">
            <label for="pub" class="text-sm">{{ t('admin.published') }}</label>
          </div>
        </div>
        <div>
          <label :class="labelClass">Descripción ES</label>
          <textarea v-model="form.description_es" rows="3" :class="fieldClass" />
        </div>
        <div>
          <label :class="labelClass">Descripción EN</label>
          <textarea v-model="form.description_en" rows="3" :class="fieldClass" />
        </div>
      </section>

    </form>

    <section class="mt-8 space-y-4 border border-line bg-white p-5">
      <h2 class="font-display text-lg font-semibold">Portada</h2>
      <img
        :src="form.cover_image_url || '/placeholders/house-1.svg'"
        :alt="form.name_es"
        class="aspect-[4/3] w-full max-w-sm object-cover"
      >
      <div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          class="block w-full max-w-md text-sm"
          :disabled="uploading"
          @change="onCover"
        >
      </div>
    </section>

    <section class="mt-8 border border-line bg-white p-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="font-display text-lg font-semibold">Fotos de la habitación</h2>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          class="text-sm"
          :disabled="uploading"
          @change="onGallery"
        >
      </div>
      <p v-if="uploading" class="mt-2 text-sm text-mute">{{ t('common.loading') }}</p>
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
      <p v-if="!images.length" class="mt-3 text-sm text-mute">Sin fotos todavía.</p>
    </section>
  </div>
</template>
