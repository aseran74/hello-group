<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const { t } = useI18n()
const { fetchRawHouses, hasSupabaseConfig } = useHouses()
const client = useSupabaseClient()

const { data: houses, refresh } = await useAsyncData('admin-houses', () => fetchRawHouses())
const creating = ref(false)

async function createHouse() {
  if (!hasSupabaseConfig()) {
    alert('Configura Supabase para crear casas.')
    return
  }
  creating.value = true
  const slug = `casa-${Date.now()}`
  const { data, error } = await client
    .from('houses')
    .insert({
      slug,
      name_es: 'Nueva casa',
      name_en: 'New home',
      location_es: 'Asturias',
      location_en: 'Asturias',
      description_es: '',
      description_en: '',
      capacity: 4,
      bedrooms: 2,
      amenities: [],
      published: false,
      sort_order: (houses.value?.length || 0) + 1,
    })
    .select('id')
    .single()
  creating.value = false
  if (error) {
    alert(error.message)
    return
  }
  await navigateTo(`/admin/casas/${data.id}`)
}

async function removeHouse(id: string) {
  if (!confirm('¿Eliminar esta casa?')) return
  if (!hasSupabaseConfig()) return
  const { error } = await client.from('houses').delete().eq('id', id)
  if (error) {
    alert(error.message)
    return
  }
  await refresh()
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="font-display text-3xl font-semibold text-moss">{{ t('admin.houses') }}</h1>
      <button type="button" class="btn-primary" :disabled="creating" @click="createHouse">
        {{ t('admin.newHouse') }}
      </button>
    </div>

    <div class="mt-8 overflow-x-auto border border-fog bg-white">
      <table class="w-full min-w-[40rem] text-left text-sm">
        <thead class="border-b border-fog bg-mist/50 text-slate-muted">
          <tr>
            <th class="px-4 py-3 font-medium">Nombre</th>
            <th class="px-4 py-3 font-medium">Slug</th>
            <th class="px-4 py-3 font-medium">Ubicación</th>
            <th class="px-4 py-3 font-medium">{{ t('admin.published') }}</th>
            <th class="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="house in houses" :key="house.id" class="border-b border-fog/70">
            <td class="px-4 py-3 font-medium">{{ house.name_es }}</td>
            <td class="px-4 py-3 text-slate-muted">{{ house.slug }}</td>
            <td class="px-4 py-3">{{ house.location_es }}</td>
            <td class="px-4 py-3">{{ house.published ? 'Sí' : 'No' }}</td>
            <td class="px-4 py-3 text-right">
              <NuxtLink :to="`/admin/casas/${house.id}`" class="mr-3 text-moss underline-offset-2 hover:underline">
                Editar
              </NuxtLink>
              <button type="button" class="text-red-700 hover:underline" @click="removeHouse(house.id)">
                {{ t('admin.delete') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
