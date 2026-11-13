<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const route = useRoute()
const { t } = useI18n()
const houseId = computed(() => String(route.params.id))
const { fetchRawHouse } = useHouses()
const { saving, message, error, saveApartment, emptyApartmentForm } = useApartmentAdmin()

const { data: house, error: loadError } = await useAsyncData(
  () => `admin-house-for-apt-new-${houseId.value}`,
  () => fetchRawHouse(houseId.value),
)

if (!house.value && !loadError.value) {
  throw createError({ statusCode: 404, statusMessage: 'House not found' })
}

const nextOrder = (house.value?.apartments?.length || 0) + 1
const form = reactive(emptyApartmentForm(nextOrder))
form.name_es = `Apartamento ${nextOrder}`
form.name_en = `Apartment ${nextOrder}`

const fieldClass = 'mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink'
const labelClass = 'block text-sm text-mute'

async function onCreate() {
  const data = await saveApartment(houseId.value, null, form)
  if (data?.id) {
    await navigateTo(`/admin/casas/${houseId.value}/apartamentos/${data.id}`)
  }
}
</script>

<template>
  <div>
    <NuxtLink :to="`/admin/casas/${houseId}`" class="text-sm text-mute hover:text-ink">
      ← {{ house?.name_es || t('admin.back') }}
    </NuxtLink>
    <h1 class="mt-4 font-display text-3xl font-semibold text-ink">Nuevo apartamento</h1>
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
          <label :class="labelClass">Capacidad</label>
          <input v-model.number="form.capacity" type="number" min="1" :class="fieldClass">
        </div>
        <div>
          <label :class="labelClass">Dormitorios</label>
          <input v-model.number="form.bedrooms" type="number" min="0" :class="fieldClass">
        </div>
        <div>
          <label :class="labelClass">Baños</label>
          <input v-model.number="form.bathrooms" type="number" min="0" :class="fieldClass">
        </div>
        <div>
          <label :class="labelClass">Orden</label>
          <input v-model.number="form.sort_order" type="number" :class="fieldClass">
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
      <div>
        <label :class="labelClass">URL reserva RoomRaccoon</label>
        <input v-model="form.booking_url" type="url" :class="fieldClass" placeholder="https://booking.roomraccoon.es/...">
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
