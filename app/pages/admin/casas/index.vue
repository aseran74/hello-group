<script setup lang="ts">
import type { House } from '~/types/house'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const { t } = useI18n()
const { fetchRawHouses } = useHouses()
const { togglePublished, error } = useHouseAdmin()

const { data: houses, refresh, pending } = await useAsyncData('admin-houses', () => fetchRawHouses())

onMounted(() => {
  refresh()
})

async function onToggle(house: House) {
  const updated = await togglePublished(house)
  if (updated) await refresh()
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-3xl font-semibold text-ink">{{ t('admin.houses') }}</h1>
        <p class="mt-2 text-sm text-mute">
          Edita datos, ubicación, descripciones y fotos de cada propiedad.
        </p>
      </div>
      <NuxtLink
        to="/admin/casas/nueva"
        class="bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-black"
      >
        {{ t('admin.newHouse') }}
      </NuxtLink>
    </div>

    <p v-if="error" class="mt-4 text-sm text-red-700">{{ error }}</p>

    <div class="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <AdminHouseCard
        v-for="house in houses"
        :key="house.id"
        :house="house"
        @toggle-published="onToggle"
      />
    </div>

    <p v-if="!pending && !houses?.length" class="mt-8 text-sm text-mute">
      No hay propiedades.
    </p>
  </div>
</template>
