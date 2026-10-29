<script setup lang="ts">
import type { Inquiry } from '~/types/house'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const { t } = useI18n()
const { hasSupabaseConfig } = useHouses()
const client = useSupabaseClient()

const inquiries = ref<Inquiry[]>([])
const errorMsg = ref('')

async function load() {
  if (!hasSupabaseConfig()) {
    try {
      const local = await $fetch<Array<{
        id: string
        name: string
        email: string
        phone: string | null
        message: string
        locale: string
        status: string
        created_at: string
        house_name: string | null
      }>>('/api/admin/local-inquiries')
      inquiries.value = local.map((item) => ({
        id: item.id,
        house_id: null,
        name: item.name,
        email: item.email,
        phone: item.phone,
        message: item.message,
        locale: item.locale,
        status: item.status as Inquiry['status'],
        created_at: item.created_at,
        houses: item.house_name
          ? { id: '', slug: '', name_es: item.house_name, name_en: item.house_name }
          : null,
      }))
    }
    catch {
      inquiries.value = []
    }
    return
  }
  const { data, error } = await client
    .from('inquiries')
    .select('*, houses(id, slug, name_es, name_en)')
    .order('created_at', { ascending: false })
  if (error) {
    errorMsg.value = error.message
    return
  }
  inquiries.value = (data || []) as Inquiry[]
}

await load()

async function markRead(id: string) {
  const { error } = await client.from('inquiries').update({ status: 'read' }).eq('id', id)
  if (error) {
    errorMsg.value = error.message
    return
  }
  await load()
}
</script>

<template>
  <div>
    <h1 class="font-display text-3xl font-semibold text-moss">{{ t('admin.inquiries') }}</h1>
    <p v-if="errorMsg" class="mt-4 text-sm text-red-700">{{ errorMsg }}</p>
    <p v-if="!hasSupabaseConfig()" class="mt-4 text-sm text-slate-muted">
      Modo demo: consultas en memoria del servidor. Configura Supabase para persistencia real.
    </p>
    <p v-else-if="!inquiries.length" class="mt-8 text-slate-muted">{{ t('admin.noInquiries') }}</p>

    <ul class="mt-8 space-y-4">
      <li
        v-for="item in inquiries"
        :key="item.id"
        class="border border-fog bg-white p-5"
        :class="item.status === 'new' && 'border-l-4 border-l-lichen'"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="font-semibold text-moss">{{ item.name }} · {{ item.email }}</p>
            <p class="text-sm text-slate-muted">
              {{ item.phone || '—' }}
              ·
              {{ item.houses?.name_es || 'Sin casa' }}
              ·
              {{ new Date(item.created_at).toLocaleString() }}
            </p>
          </div>
          <button
            v-if="item.status === 'new'"
            type="button"
            class="btn-secondary py-2 text-xs"
            @click="markRead(item.id)"
          >
            {{ t('admin.markRead') }}
          </button>
          <span v-else class="text-xs uppercase tracking-wide text-slate-muted">{{ item.status }}</span>
        </div>
        <p class="mt-3 whitespace-pre-wrap text-slate-ink">{{ item.message }}</p>
      </li>
    </ul>
  </div>
</template>
