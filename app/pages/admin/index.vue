<script setup lang="ts">
import type { House } from '~/types/house'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const { t } = useI18n()
const { fetchRawHouses, hasInsforgeConfig } = useHouses()
const { togglePublished, error } = useHouseAdmin()

const { data: houses, refresh, pending } = await useAsyncData(
  'admin-dash-houses',
  () => fetchRawHouses(),
)

const unread = ref(0)
try {
  const local = await $fetch<Array<{ status: string }>>('/api/admin/local-inquiries')
  unread.value = local.filter((i) => i.status === 'new').length
}
catch {
  unread.value = 0
}

const publishedCount = computed(() => houses.value?.filter((h) => h.published).length ?? 0)
const photoCount = computed(
  () => houses.value?.reduce((n, h) => n + (h.house_images?.length ?? 0), 0) ?? 0,
)

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
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-mute">Hello Group</p>
        <h1 class="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
          {{ t('admin.dashboard') }}
        </h1>
        <p class="mt-2 max-w-xl text-sm text-mute">
          Edita las 5 propiedades: textos, ubicación, capacidad y fotos.
        </p>
      </div>
      <NuxtLink
        to="/admin/casas/nueva"
        class="bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-black"
      >
        {{ t('admin.newHouse') }}
      </NuxtLink>
    </div>

    <div class="mt-6 grid gap-3 sm:grid-cols-4">
      <div class="border border-line bg-white px-4 py-3">
        <p class="text-xs uppercase tracking-wider text-mute">Propiedades</p>
        <p class="mt-1 font-display text-3xl font-semibold">{{ houses?.length || 0 }}</p>
      </div>
      <div class="border border-line bg-white px-4 py-3">
        <p class="text-xs uppercase tracking-wider text-mute">Publicadas</p>
        <p class="mt-1 font-display text-3xl font-semibold">{{ publishedCount }}</p>
      </div>
      <div class="border border-line bg-white px-4 py-3">
        <p class="text-xs uppercase tracking-wider text-mute">Fotos</p>
        <p class="mt-1 font-display text-3xl font-semibold">{{ photoCount }}</p>
      </div>
      <NuxtLink to="/admin/consultas" class="border border-line bg-white px-4 py-3 transition hover:border-ink">
        <p class="text-xs uppercase tracking-wider text-mute">{{ t('admin.inquiries') }}</p>
        <p class="mt-1 font-display text-3xl font-semibold">{{ unread }}</p>
      </NuxtLink>
    </div>

    <p
      class="mt-5 border px-4 py-3 text-sm"
      :class="hasInsforgeConfig()
        ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
        : 'border-amber-200 bg-amber-50 text-amber-950'"
    >
      <template v-if="hasInsforgeConfig()">
        InsForge conectado · los cambios se reflejan en la web pública.
      </template>
      <template v-else>
        Falta configurar NUXT_PUBLIC_INSFORGE_URL y NUXT_PUBLIC_INSFORGE_ANON_KEY.
      </template>
    </p>

    <p v-if="error" class="mt-3 text-sm text-red-700">{{ error }}</p>

    <div class="mt-8 flex items-center justify-between gap-3">
      <h2 class="font-display text-xl font-semibold text-ink">{{ t('admin.houses') }}</h2>
      <button
        type="button"
        class="text-sm text-mute hover:text-ink"
        :disabled="pending"
        @click="refresh()"
      >
        Actualizar
      </button>
    </div>

    <div class="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <AdminHouseCard
        v-for="house in houses"
        :key="house.id"
        :house="house"
        @toggle-published="onToggle"
      />
    </div>

    <p v-if="!pending && !houses?.length" class="mt-8 text-sm text-mute">
      No hay propiedades todavía.
      <NuxtLink to="/admin/casas/nueva" class="underline">Crear la primera</NuxtLink>
    </p>
  </div>
</template>
