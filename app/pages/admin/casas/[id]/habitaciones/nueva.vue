<script setup lang="ts">
import { BATHROOM_TYPES, ROOM_TYPES } from '~/data/feature-catalog'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const route = useRoute()
const { t } = useI18n()
const houseId = computed(() => String(route.params.id))
const { fetchRawHouse } = useHouses()
const { saving, message, error, saveRoom, emptyRoomForm } = useRoomAdmin()

const { data: house, error: loadError } = await useAsyncData(
  () => `admin-house-for-room-new-${houseId.value}`,
  () => fetchRawHouse(houseId.value),
)

if (!house.value && !loadError.value) {
  throw createError({ statusCode: 404, statusMessage: 'House not found' })
}

const nextOrder = (house.value?.rooms?.length || 0) + 1
const form = reactive(emptyRoomForm(nextOrder))
form.name_es = `Habitación ${nextOrder}`
form.name_en = `Room ${nextOrder}`

watch(() => form.room_type, (type) => {
  const meta = ROOM_TYPES.find((r) => r.key === type)
  if (meta) form.capacity = meta.capacity
})

const fieldClass = 'mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink'
const labelClass = 'block text-sm text-mute'

async function onCreate() {
  const data = await saveRoom(houseId.value, null, form)
  if (data?.id) {
    await navigateTo(`/admin/casas/${houseId.value}/habitaciones/${data.id}`)
  }
}
</script>

<template>
  <div>
    <NuxtLink :to="`/admin/casas/${houseId}`" class="text-sm text-mute hover:text-ink">
      ← {{ house?.name_es || t('admin.back') }}
    </NuxtLink>
    <h1 class="mt-4 font-display text-3xl font-semibold text-ink">Nueva habitación</h1>
    <p class="mt-2 text-sm text-mute">{{ house?.name_es }}</p>

    <p v-if="message" class="mt-4 text-sm text-emerald-800">{{ message }}</p>
    <p v-if="error" class="mt-4 text-sm text-red-700">{{ error }}</p>

    <form class="mt-8 max-w-2xl space-y-4 border border-line bg-white p-5" @submit.prevent="onCreate">
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
          <label :class="labelClass">Tipo</label>
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
      </div>
      <div class="flex items-center gap-2">
        <input id="pub" v-model="form.published" type="checkbox" class="size-4">
        <label for="pub" class="text-sm">{{ t('admin.published') }}</label>
      </div>
      <button
        type="submit"
        class="bg-ink px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        :disabled="saving"
      >
        {{ saving ? t('common.loading') : 'Crear y añadir fotos' }}
      </button>
    </form>
  </div>
</template>
