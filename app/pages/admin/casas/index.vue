<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { t } = useI18n()
const { fetchRawHouses } = useHouses()

const { data: houses } = await useAsyncData('admin-houses', () => fetchRawHouses())
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="font-display text-3xl font-semibold text-ink">{{ t('admin.houses') }}</h1>
    </div>
    <p class="mt-3 text-sm text-mute">
      Lectura del seed local. La edición con Supabase se activará más adelante.
    </p>

    <div class="mt-8 overflow-x-auto border border-line bg-white">
      <table class="w-full min-w-[40rem] text-left text-sm">
        <thead class="border-b border-line bg-paper text-mute">
          <tr>
            <th class="px-4 py-3 font-medium">Nombre</th>
            <th class="px-4 py-3 font-medium">Slug</th>
            <th class="px-4 py-3 font-medium">Ubicación</th>
            <th class="px-4 py-3 font-medium">{{ t('admin.published') }}</th>
            <th class="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="house in houses" :key="house.id" class="border-b border-line/70">
            <td class="px-4 py-3 font-medium">{{ house.name_es }}</td>
            <td class="px-4 py-3 text-mute">{{ house.slug }}</td>
            <td class="px-4 py-3">{{ house.location_es }}</td>
            <td class="px-4 py-3">{{ house.published ? 'Sí' : 'No' }}</td>
            <td class="px-4 py-3 text-right">
              <NuxtLink :to="`/admin/casas/${house.id}`" class="text-ink underline-offset-2 hover:underline">
                Ver
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
