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
  <section class="section-pad !pb-10 !pt-6 md:!pb-14 md:!pt-8">
    <div class="page-shell grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
      <div class="relative mx-auto grid w-full max-w-xl grid-cols-2 gap-3 md:gap-4">
        <CurvedMedia
          src="/landing/madrid-metropolis-night.jpg"
          :alt="t('home.curvedAlt1')"
          shape="blob-a"
          class="col-span-2 aspect-[16/10] md:aspect-[16/9]"
        />
        <CurvedMedia
          src="/landing/madrid-alcala.jpg"
          :alt="t('home.curvedAlt2')"
          shape="blob-b"
          class="aspect-square"
        />
        <CurvedMedia
          src="/landing/madrid-retiro.jpg"
          :alt="t('home.curvedAlt3')"
          shape="blob-c"
          class="mt-6 aspect-[4/5] md:mt-10"
        />
      </div>

      <div>
        <p class="eyebrow">Hello Group</p>
        <h2 class="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-5xl md:leading-[1.08]">
          {{ t('home.missionTitle') }}
        </h2>
        <p class="mt-5 max-w-xl text-base leading-relaxed text-mute md:text-lg">
          {{ t('home.missionBody') }}
        </p>

        <div class="mt-8 grid grid-cols-2 gap-x-4 gap-y-5">
          <div v-for="pillar in pillars" :key="pillar.title">
            <p class="font-display text-sm font-semibold text-ink">{{ pillar.title }}</p>
            <p class="mt-1 text-xs leading-relaxed text-mute md:text-sm">{{ pillar.body }}</p>
          </div>
        </div>

        <div class="mt-9">
          <NuxtLink :to="localePath('/nosotros')" class="btn-secondary">
            {{ t('home.aboutBandCta') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
