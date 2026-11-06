<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const route = useRoute()
const { t } = useI18n()
const { fetchRawFaq, saveFaq, saving, error, message, faqToForm, emptyFaqForm } = useFaqs()

const id = computed(() => String(route.params.id))
const { data: faq, refresh } = await useAsyncData(
  () => `admin-faq-${id.value}`,
  () => fetchRawFaq(id.value),
  { watch: [id] },
)

const form = reactive(emptyFaqForm())

watchEffect(() => {
  if (faq.value) Object.assign(form, faqToForm(faq.value))
})

async function onSubmit() {
  const saved = await saveFaq(id.value, form)
  if (saved) await refresh()
}
</script>

<template>
  <div class="max-w-3xl">
    <NuxtLink to="/admin/faq" class="text-sm text-mute hover:text-ink">← {{ t('admin.back') }}</NuxtLink>

    <template v-if="faq">
      <h1 class="mt-4 font-display text-3xl font-semibold text-ink">{{ faq.title_es }}</h1>
      <p class="mt-2 text-sm text-mute">/{{ faq.slug }}</p>

      <form class="mt-8 space-y-5 border border-line bg-white p-6" @submit.prevent="onSubmit">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="block text-sm text-mute" for="faq-slug">Slug</label>
            <input id="faq-slug" v-model="form.slug" required class="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink">
          </div>
          <div>
            <label class="block text-sm text-mute" for="faq-order">Orden</label>
            <input id="faq-order" v-model.number="form.sort_order" type="number" class="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink">
          </div>
        </div>

        <div>
          <label class="block text-sm text-mute" for="faq-title-es">Título ES</label>
          <input id="faq-title-es" v-model="form.title_es" required class="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink">
        </div>
        <div>
          <label class="block text-sm text-mute" for="faq-title-en">Title EN</label>
          <input id="faq-title-en" v-model="form.title_en" class="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink">
        </div>

        <div>
          <label class="block text-sm text-mute" for="faq-message-es">Mensaje ES</label>
          <textarea id="faq-message-es" v-model="form.message_es" required rows="6" class="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink" />
        </div>
        <div>
          <label class="block text-sm text-mute" for="faq-message-en">Message EN</label>
          <textarea id="faq-message-en" v-model="form.message_en" rows="6" class="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink" />
        </div>

        <div>
          <label class="block text-sm text-mute" for="faq-shortcuts">{{ t('admin.shortcuts') }}</label>
          <input
            id="faq-shortcuts"
            v-model="form.shortcutsText"
            class="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
            :placeholder="t('admin.shortcutsHint')"
          >
        </div>

        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.published" type="checkbox">
          {{ t('admin.published') }}
        </label>

        <p v-if="error" class="text-sm text-red-700">{{ error }}</p>
        <p v-else-if="message" class="text-sm text-emerald-700">{{ message }}</p>

        <button
          type="submit"
          class="bg-ink px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          :disabled="saving"
        >
          {{ saving ? t('common.loading') : t('admin.save') }}
        </button>
      </form>
    </template>

    <p v-else class="mt-8 text-mute">{{ t('common.notFound') }}</p>
  </div>
</template>
