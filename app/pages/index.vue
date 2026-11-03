<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { fetchHouses } = useHouses()

const { data: houses } = await useAsyncData('home-houses', () => fetchHouses())

const madridHomes = computed(() =>
  (houses.value || []).filter((h) => h.slug !== 'astur'),
)
const asturiasHomes = computed(() =>
  (houses.value || []).filter((h) => h.slug === 'astur'),
)

useSeoMeta({
  title: 'Hello Group',
  description: () => t('home.sub'),
})
</script>

<template>
  <div>
    <HeroVideo />

    <section id="casas" class="section-pad !py-16 md:!py-20">
      <div class="page-shell">
        <header class="mx-auto max-w-xl text-center">
          <h2 class="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {{ t('home.previewTitle') }}
          </h2>
          <p class="mt-3 text-base leading-relaxed text-mute">
            {{ t('home.previewSub') }}
          </p>
        </header>

        <div class="mt-10 space-y-12 md:mt-12 md:space-y-14">
          <div>
            <header class="mb-5 border-b border-line pb-3 md:mb-6">
              <p class="eyebrow text-mute">Hello Group</p>
              <h3 class="mt-1 font-display text-xl font-bold tracking-tight text-ink md:text-2xl">
                {{ t('home.groupMadrid') }}
              </h3>
            </header>
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 md:gap-4">
              <HouseCard
                v-for="(house, i) in madridHomes"
                :key="house.id"
                :house="house"
                :index="i"
              />
            </div>
          </div>

          <div>
            <header class="mb-5 border-b border-line pb-3 md:mb-6">
              <p class="eyebrow text-mute">Hello Group</p>
              <h3 class="mt-1 font-display text-xl font-bold tracking-tight text-ink md:text-2xl">
                {{ t('home.groupAsturias') }}
              </h3>
            </header>
            <div class="grid gap-3 md:gap-4">
              <HouseCard
                v-for="(house, i) in asturiasHomes"
                :key="house.id"
                :house="house"
                :index="i"
                wide
                carousel
              />
            </div>
          </div>
        </div>

        <div class="mt-10 flex justify-center">
          <NuxtLink :to="localePath('/casas')" class="btn-secondary">
            {{ t('home.ctaHomes') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="bg-ink text-mist">
      <div class="page-shell grid gap-8 px-5 py-14 md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-12 md:px-8 md:py-20">
        <div>
          <p class="eyebrow text-white/45">{{ t('nav.about') }}</p>
          <h2 class="mt-3 font-display text-2xl font-bold tracking-tight md:text-4xl">
            {{ t('home.aboutBandTitle') }}
          </h2>
          <p class="mt-4 max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
            {{ t('about.lead') }}
          </p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row md:flex-col md:items-stretch lg:flex-row">
          <NuxtLink
            :to="localePath('/nosotros')"
            class="btn-ghost border-white/25 text-center"
          >
            {{ t('home.aboutBandCta') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath({ path: '/contacto', query: { reserva: '1' } })"
            class="btn-primary bg-white text-center text-ink hover:bg-mist"
          >
            {{ t('nav.book') }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
