<script setup lang="ts">
import type { Inquiry } from '~/types/house'

definePageMeta({
  layout: 'admin',
})

const { t } = useI18n()
const inquiries = ref<Inquiry[]>([])
const errorMsg = ref('')

async function load() {
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
  catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Error'
    inquiries.value = []
  }
}

await load()
</script>

<template>
  <div>
    <h1 class="font-display text-3xl font-semibold text-ink">{{ t('admin.inquiries') }}</h1>
    <p class="mt-3 text-sm text-mute">
      Consultas en memoria del servidor (demo). Se reinician al redeploy.
    </p>
    <p v-if="errorMsg" class="mt-4 text-sm text-red-700">{{ errorMsg }}</p>
    <p v-else-if="!inquiries.length" class="mt-8 text-mute">{{ t('admin.noInquiries') }}</p>

    <ul class="mt-8 space-y-4">
      <li
        v-for="item in inquiries"
        :key="item.id"
        class="border border-line border-l-4 border-l-ink bg-white p-5"
      >
        <div>
          <p class="font-semibold text-ink">{{ item.name }} · {{ item.email }}</p>
          <p class="text-sm text-mute">
            {{ item.phone || '—' }}
            ·
            {{ item.houses?.name_es || 'Sin casa' }}
            ·
            {{ new Date(item.created_at).toLocaleString() }}
          </p>
        </div>
        <p class="mt-3 whitespace-pre-wrap text-ink">{{ item.message }}</p>
      </li>
    </ul>
  </div>
</template>
