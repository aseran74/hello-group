<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const { t } = useI18n()
const { fetchRawHouses, hasSupabaseConfig } = useHouses()
const client = useSupabaseClient()

const { data: houses } = await useAsyncData('admin-dash-houses', () => fetchRawHouses())

const unread = ref(0)
if (hasSupabaseConfig()) {
  const { count } = await client
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')
  unread.value = count || 0
}
</script>

<template>
  <div>
    <h1 class="font-display text-3xl font-semibold text-moss">{{ t('admin.dashboard') }}</h1>
    <div class="mt-8 grid gap-4 sm:grid-cols-2">
      <NuxtLink to="/admin/casas" class="border border-fog bg-white p-6 transition hover:border-moss">
        <p class="text-sm text-slate-muted">{{ t('admin.houses') }}</p>
        <p class="mt-2 font-display text-4xl font-semibold text-moss">{{ houses?.length || 0 }}</p>
      </NuxtLink>
      <NuxtLink to="/admin/consultas" class="border border-fog bg-white p-6 transition hover:border-moss">
        <p class="text-sm text-slate-muted">{{ t('admin.inquiries') }} · {{ t('admin.unread') }}</p>
        <p class="mt-2 font-display text-4xl font-semibold text-moss">{{ unread }}</p>
      </NuxtLink>
    </div>
    <p v-if="!hasSupabaseConfig()" class="mt-8 rounded-sm border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      Supabase no está configurado. Añade <code>SUPABASE_URL</code> y <code>SUPABASE_KEY</code> en <code>.env</code>.
      Mientras tanto la web usa datos seed.
    </p>
  </div>
</template>
