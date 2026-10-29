<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const videoError = ref(false)
const heroSrc = '/hero/Hero-video.mp4'
const heroPoster = '/placeholders/hero-poster.svg'

function onVideoError() {
  videoError.value = true
}
</script>

<template>
  <section class="relative isolate min-h-[100svh] overflow-hidden bg-ink text-mist">
    <div class="absolute inset-0">
      <video
        v-if="!videoError"
        class="h-full w-full object-cover"
        autoplay
        muted
        loop
        playsinline
        :poster="heroPoster"
        :src="heroSrc"
        @error="onVideoError"
      />
      <img
        v-else
        :src="heroPoster"
        alt=""
        class="h-full w-full object-cover"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
    </div>

    <div class="relative z-10 page-shell flex min-h-[100svh] flex-col justify-end px-5 pb-20 pt-28 md:px-8 md:pb-28">
      <p class="eyebrow animate-fade-up text-white/70">Hello Group</p>
      <h1
        class="mt-4 max-w-[14ch] animate-fade-up font-display text-[clamp(2.4rem,6vw,4.75rem)] font-bold leading-[1.02] tracking-tight text-white"
        style="animation-delay: 80ms"
      >
        {{ t('home.welcome') }}
      </h1>
      <p
        class="mt-5 max-w-md animate-fade-up text-base leading-relaxed text-white/80 md:text-lg"
        style="animation-delay: 160ms"
      >
        {{ t('home.headline') }}
      </p>
      <div class="mt-9 flex flex-wrap gap-3 animate-fade-up" style="animation-delay: 240ms">
        <NuxtLink :to="localePath('/casas')" class="btn-primary bg-white text-ink hover:bg-mist">
          {{ t('home.ctaHomes') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/contacto')" class="btn-ghost">
          {{ t('home.ctaContact') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
