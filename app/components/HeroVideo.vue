<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const slides = [
  '/Fotos/Ayuntamiento/Gemini_Generated_Image_pzlqf5pzlqf5pzlq.jfif',
  '/Fotos/Ayuntamiento/Gemini_Generated_Image_y8z2w9y8z2w9y8z2.jfif',
  '/Fotos/Ayuntamiento/ilovetattoos-architecture-3269011.jpg',
] as const

const active = ref(0)
const reduceMotion = ref(false)

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion.value) return

  timer = setInterval(() => {
    active.value = (active.value + 1) % slides.length
  }, 5500)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <section class="relative isolate min-h-[100svh] overflow-hidden bg-ink text-mist">
    <div class="absolute inset-0" aria-hidden="true">
      <img
        v-for="(src, i) in slides"
        :key="src"
        :src="src"
        alt=""
        class="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1400ms] will-change-[opacity,transform]"
        :class="i === active ? 'opacity-100 scale-105' : 'opacity-0 scale-100'"
        :style="{ transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)' }"
        :fetchpriority="i === 0 ? 'high' : 'low'"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-black/10" />
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

      <div
        class="mt-10 flex gap-2"
        role="tablist"
        :aria-label="t('home.headline')"
      >
        <button
          v-for="(_, i) in slides"
          :key="i"
          type="button"
          class="h-1.5 w-8 rounded-full transition-[background-color,transform] duration-300"
          :class="i === active ? 'bg-white scale-100' : 'bg-white/35 hover:bg-white/55'"
          :style="{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }"
          :aria-label="`${i + 1} / ${slides.length}`"
          :aria-selected="i === active"
          @click="active = i"
        />
      </div>
    </div>
  </section>
</template>
