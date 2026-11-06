<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const moments = computed(() => [
  {
    src: '/landing/madrid-granvia-dusk.jpg',
    title: t('home.momentCity'),
    shape: 'soft' as const,
  },
  {
    src: '/landing/madrid-alcala.jpg',
    title: t('home.momentLandmark'),
    shape: 'pill' as const,
  },
  {
    src: '/landing/madrid-retiro.jpg',
    title: t('home.momentPark'),
    shape: 'soft' as const,
  },
  {
    src: '/landing/madrid-metropolis-night.jpg',
    title: t('home.momentNight'),
    shape: 'pill' as const,
  },
])
</script>

<template>
  <section class="section-pad !py-14 md:!py-20">
    <div class="page-shell">
      <header class="mx-auto max-w-2xl text-center">
        <p class="eyebrow">{{ t('home.momentsEyebrow') }}</p>
        <h2 class="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {{ t('home.momentsTitle') }}
        </h2>
        <p class="mt-3 text-base leading-relaxed text-mute">
          {{ t('home.momentsSub') }}
        </p>
      </header>

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
        <NuxtLink
          v-for="moment in moments"
          :key="moment.src"
          :to="localePath('/casas')"
          class="group block"
        >
          <CurvedMedia
            :src="moment.src"
            :alt="moment.title"
            :shape="moment.shape"
            class="aspect-[4/5]"
          >
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div class="absolute inset-x-0 bottom-0 z-[1] flex items-end justify-between gap-2 p-4">
              <p class="font-display text-base font-semibold text-white">
                {{ moment.title }}
              </p>
              <span
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/35 bg-white/15 text-sm text-white backdrop-blur-md transition group-hover:bg-white group-hover:text-ink"
                aria-hidden="true"
              >
                +
              </span>
            </div>
          </CurvedMedia>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
