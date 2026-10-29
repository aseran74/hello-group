<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const { fetchHouses } = useHouses()

const { data: houses } = await useAsyncData('contact-houses', () => fetchHouses())
const preselect = computed(() => (typeof route.query.casa === 'string' ? route.query.casa : undefined))

useSeoMeta({
  title: () => `${t('contact.title')} · Hello Group`,
  description: () => t('contact.subtitle'),
})
</script>

<template>
  <div class="section-pad pt-28 md:pt-32">
    <div class="page-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <header>
        <p class="eyebrow">Hello Group</p>
        <h1 class="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-6xl">
          {{ t('contact.title') }}
        </h1>
        <p class="mt-5 text-lg leading-relaxed text-mute">{{ t('contact.subtitle') }}</p>
      </header>
      <div class="rounded-[1.75rem] border border-line bg-paper-elevated p-6 md:p-10">
        <ContactForm :houses="houses || []" :preselect-slug="preselect" />
      </div>
    </div>
  </div>
</template>
