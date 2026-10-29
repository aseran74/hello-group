<script setup lang="ts">
import type { LocalizedHouse } from '~/types/house'

const props = defineProps<{
  houses: LocalizedHouse[]
  preselectSlug?: string
}>()

const { t, locale } = useI18n()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  houseId: '' as string,
  message: '',
})

const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

onMounted(() => {
  if (props.preselectSlug) {
    const match = props.houses.find((h) => h.slug === props.preselectSlug)
    if (match) form.houseId = match.id
  }
})

async function submit() {
  status.value = 'sending'
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        houseId: form.houseId || null,
        message: form.message,
        locale: locale.value,
      },
    })
    status.value = 'success'
    form.name = ''
    form.email = ''
    form.phone = ''
    form.message = ''
  }
  catch {
    status.value = 'error'
  }
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="submit">
    <div class="grid gap-5 md:grid-cols-2">
      <div>
        <label class="label" for="name">{{ t('contact.name') }}</label>
        <input id="name" v-model="form.name" class="field" required autocomplete="name">
      </div>
      <div>
        <label class="label" for="email">{{ t('contact.email') }}</label>
        <input id="email" v-model="form.email" type="email" class="field" required autocomplete="email">
      </div>
    </div>
    <div class="grid gap-5 md:grid-cols-2">
      <div>
        <label class="label" for="phone">{{ t('contact.phone') }}</label>
        <input id="phone" v-model="form.phone" type="tel" class="field" autocomplete="tel">
      </div>
      <div>
        <label class="label" for="house">{{ t('contact.house') }}</label>
        <select id="house" v-model="form.houseId" class="field">
          <option value="">{{ t('contact.houseAny') }}</option>
          <option v-for="h in houses" :key="h.id" :value="h.id">{{ h.name }} — {{ h.location }}</option>
        </select>
      </div>
    </div>
    <div>
      <label class="label" for="message">{{ t('contact.message') }}</label>
      <textarea id="message" v-model="form.message" class="field min-h-36" required rows="5" />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <button
        type="submit"
        class="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="status === 'sending'"
      >
        {{ status === 'sending' ? t('contact.sending') : t('contact.submit') }}
      </button>
      <p v-if="status === 'success'" class="text-sm font-medium text-ink">{{ t('contact.success') }}</p>
      <p v-if="status === 'error'" class="text-sm font-medium text-red-700">{{ t('contact.error') }}</p>
    </div>
  </form>
</template>
