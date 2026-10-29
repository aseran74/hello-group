<script setup lang="ts">
const { t, tm } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => `${t('featuresPage.title')} · Hello Group`,
  description: () => t('featuresPage.lead'),
})

type FeatureItem = { title: string; body: string }

const items = computed(() => tm('featuresPage.items') as FeatureItem[])
</script>

<template>
  <div>
    <section class="section-pad pt-28 md:pt-32">
      <div class="page-shell max-w-3xl">
        <p class="eyebrow">Hello Group</p>
        <h1 class="mt-3 font-display text-5xl font-bold tracking-tight text-ink md:text-7xl">
          {{ t('featuresPage.title') }}
        </h1>
        <p class="mt-6 max-w-2xl text-xl leading-relaxed text-mute">
          {{ t('featuresPage.lead') }}
        </p>
      </div>
    </section>

    <section class="border-t border-line bg-paper-elevated">
      <div class="page-shell section-pad">
        <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="(item, i) in items"
            :key="i"
            class="rounded-[1.5rem] border border-line bg-paper px-6 py-7"
          >
            <h2 class="font-display text-xl font-bold tracking-tight text-ink">
              {{ item.title }}
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-mute">
              {{ item.body }}
            </p>
          </li>
        </ul>

        <div class="mt-12 flex flex-wrap gap-3">
          <NuxtLink :to="localePath('/casas')" class="btn-primary">
            {{ t('home.ctaHomes') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/contacto')" class="btn-secondary">
            {{ t('nav.contact') }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
