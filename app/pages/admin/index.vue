<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { t } = useI18n()
const { fetchRawHouses, hasSupabaseConfig } = useHouses()

const { data: houses } = await useAsyncData('admin-dash-houses', () => fetchRawHouses())

const unread = ref(0)
try {
  const local = await $fetch<Array<{ status: string }>>('/api/admin/local-inquiries')
  unread.value = local.filter((i) => i.status === 'new').length
}
catch {
  unread.value = 0
}
</script>

<template>
  <div>
    <h1 class="font-display text-3xl font-semibold text-ink">{{ t('admin.dashboard') }}</h1>

    <p class="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      Modo demo: Supabase no es necesario por ahora. Las casas salen del seed y las consultas se guardan en memoria del servidor.
      <span v-if="hasSupabaseConfig()"> Supabase detectado — se activará en una próxima iteración.</span>
    </p>

    <div class="mt-8 grid gap-4 sm:grid-cols-2">
      <NuxtLink to="/admin/casas" class="border border-line bg-white p-6 transition hover:border-ink">
        <p class="text-sm text-mute">{{ t('admin.houses') }}</p>
        <p class="mt-2 font-display text-4xl font-semibold text-ink">{{ houses?.length || 0 }}</p>
      </NuxtLink>
      <NuxtLink to="/admin/consultas" class="border border-line bg-white p-6 transition hover:border-ink">
        <p class="text-sm text-mute">{{ t('admin.inquiries') }} · {{ t('admin.unread') }}</p>
        <p class="mt-2 font-display text-4xl font-semibold text-ink">{{ unread }}</p>
      </NuxtLink>
    </div>
  </div>
</template>
