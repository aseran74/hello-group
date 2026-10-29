<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const route = useRoute()
const { t } = useI18n()
const { fetchRawHouse } = useHouses()

const id = computed(() => String(route.params.id))
const { data: house } = await useAsyncData(
  () => `admin-house-${id.value}`,
  () => fetchRawHouse(id.value),
  { watch: [id] },
)

if (!house.value) {
  throw createError({ statusCode: 404, statusMessage: 'House not found' })
}
</script>

<template>
  <div v-if="house">
    <NuxtLink to="/admin/casas" class="text-sm text-mute hover:text-ink">← {{ t('admin.back') }}</NuxtLink>
    <h1 class="mt-4 font-display text-3xl font-semibold text-ink">{{ house.name_es }}</h1>
    <p class="mt-2 text-sm text-mute">Vista de solo lectura (seed). CRUD con Supabase más adelante.</p>

    <div class="mt-8 grid gap-6 lg:grid-cols-2">
      <div class="space-y-3 border border-line bg-white p-5 text-sm">
        <p><span class="text-mute">Slug:</span> {{ house.slug }}</p>
        <p><span class="text-mute">ES:</span> {{ house.name_es }} · {{ house.location_es }}</p>
        <p><span class="text-mute">EN:</span> {{ house.name_en }} · {{ house.location_en }}</p>
        <p><span class="text-mute">Capacidad:</span> {{ house.capacity }} · {{ house.bedrooms }} dorm.</p>
        <p class="pt-2 leading-relaxed text-ink">{{ house.description_es }}</p>
      </div>
      <div class="border border-line bg-white p-5">
        <img
          :src="house.cover_image_url || '/placeholders/house-1.svg'"
          :alt="house.name_es"
          class="aspect-[4/3] w-full object-cover"
        >
      </div>
    </div>
  </div>
</template>
