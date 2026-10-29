<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => `${t('about.title')} · Hello Group`,
  description: () => t('about.lead'),
})
</script>

<template>
  <div>
    <section class="section-pad pt-28 md:pt-32">
      <div class="page-shell grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
        <div>
          <p class="eyebrow">Hello Group</p>
          <h1 class="mt-3 max-w-[10ch] font-display text-5xl font-bold tracking-tight text-ink md:text-7xl">
            {{ t('about.title') }}
          </h1>
          <p class="mt-8 max-w-xl text-xl leading-relaxed text-ink md:text-2xl">
            {{ t('about.lead') }}
          </p>
        </div>
        <div class="relative min-h-[22rem] overflow-hidden bg-ink md:min-h-[28rem]">
          <img
            src="/placeholders/about.svg"
            alt=""
            class="h-full w-full object-cover opacity-90 mix-blend-luminosity"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      </div>
    </section>

    <section class="border-t border-line bg-paper-elevated">
      <div class="page-shell section-pad max-w-3xl">
        <p class="text-lg leading-relaxed text-mute md:text-xl md:leading-relaxed">
          {{ t('about.body') }}
        </p>
        <div class="mt-10 flex flex-wrap gap-3">
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
