<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const moments = computed(() => [
  {
    src: '/landing/madrid-granvia-dusk.jpg',
    title: t('home.momentCity'),
  },
  {
    src: '/landing/madrid-alcala.jpg',
    title: t('home.momentLandmark'),
  },
  {
    src: '/landing/madrid-retiro.jpg',
    title: t('home.momentPark'),
  },
  {
    src: '/landing/madrid-metropolis-night.jpg',
    title: t('home.momentNight'),
  },
])
</script>

<template>
  <section class="section-pad !py-14 md:!py-20">
    <div class="page-shell">
      <header class="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div class="max-w-xl">
          <p class="eyebrow">{{ t('home.momentsEyebrow') }}</p>
          <h2 class="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {{ t('home.momentsTitle') }}
          </h2>
          <p class="mt-3 text-base leading-relaxed text-mute">
            {{ t('home.momentsSub') }}
          </p>
        </div>
        <NuxtLink :to="localePath('/casas')" class="btn-secondary shrink-0">
          {{ t('home.ctaHomes') }}
        </NuxtLink>
      </header>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
        <NuxtLink
          v-for="moment in moments"
          :key="moment.src"
          :to="localePath('/casas')"
          class="group block"
        >
          <article class="ahead-card overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-soft">
            <div class="relative aspect-[4/5] overflow-hidden">
              <img
                :src="moment.src"
                :alt="moment.title"
                class="h-full w-full object-cover transition duration-700 ease-expo group-hover:scale-[1.04]"
                loading="eager"
                decoding="async"
              >
              <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div class="absolute inset-x-0 bottom-0 z-[1] flex items-end justify-between gap-2 p-4">
                <p class="font-display text-base font-bold text-white">
                  {{ moment.title }}
                </p>
                <span
                  class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm text-white shadow-[0_8px_20px_rgba(255,107,53,0.35)] transition group-hover:bg-accent-deep"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
            </div>
          </article>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
