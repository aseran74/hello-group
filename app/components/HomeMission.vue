<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const pillars = computed(() => [
  { title: t('home.pillarUrban'), body: t('home.pillarUrbanBody') },
  { title: t('home.pillarRural'), body: t('home.pillarRuralBody') },
  { title: t('home.pillarCare'), body: t('home.pillarCareBody') },
  { title: t('home.pillarStay'), body: t('home.pillarStayBody') },
])
</script>

<template>
  <section class="section-pad !pb-10 !pt-4 md:!pb-14 md:!pt-6">
    <div class="page-shell grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
      <div class="relative mx-auto grid w-full max-w-xl grid-cols-2 gap-3 md:gap-4">
        <CurvedMedia
          src="/landing/bernabeu-noche.jpg"
          :alt="t('home.curvedAlt1')"
          shape="soft"
          class="col-span-2 aspect-[16/10] shadow-card md:aspect-[16/9]"
        />
        <CurvedMedia
          src="/landing/cuatro-torres-noche.jpg"
          :alt="t('home.curvedAlt2')"
          shape="soft"
          class="aspect-square shadow-card"
        />
        <CurvedMedia
          src="/landing/partido-bernabeu.jpg"
          :alt="t('home.curvedAlt3')"
          shape="soft"
          class="mt-4 aspect-[4/5] shadow-card md:mt-8"
        />
      </div>

      <div class="ahead-card p-6 md:p-8">
        <p class="eyebrow">Hello Group</p>
        <h2 class="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-5xl md:leading-[1.08]">
          {{ t('home.missionTitle') }}
        </h2>
        <p class="mt-5 max-w-xl text-base leading-relaxed text-mute md:text-lg">
          {{ t('home.missionBody') }}
        </p>

        <div class="mt-8 grid grid-cols-2 gap-3">
          <div
            v-for="pillar in pillars"
            :key="pillar.title"
            class="rounded-2xl bg-paper px-4 py-4"
          >
            <p class="font-display text-sm font-bold text-ink">{{ pillar.title }}</p>
            <p class="mt-1 text-xs leading-relaxed text-mute md:text-sm">{{ pillar.body }}</p>
          </div>
        </div>

        <div class="mt-8 flex flex-wrap gap-3">
          <NuxtLink :to="localePath('/nosotros')" class="btn-primary">
            {{ t('home.aboutBandCta') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/casas')" class="btn-secondary">
            {{ t('home.ctaHomes') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
