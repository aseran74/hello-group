<script setup lang="ts">
import type { LocalizedHouse } from '~/types/house'

const props = withDefaults(
  defineProps<{
    house: LocalizedHouse
    index?: number
    /** En escritorio, foto a todo el ancho (formato más panorámico) */
    wide?: boolean
    /** Carrusel automático de fotos de la galería */
    carousel?: boolean
  }>(),
  { index: undefined, wide: false, carousel: false },
)

const { t } = useI18n()
const localePath = useLocalePath()

const orderLabel = computed(() =>
  props.index != null ? String(props.index + 1).padStart(2, '0') : null,
)

const slides = computed(() => {
  const urls: string[] = []
  if (props.house.cover_image_url) urls.push(props.house.cover_image_url)
  for (const img of props.house.images || []) {
    if (img.url && !urls.includes(img.url)) urls.push(img.url)
  }
  if (!urls.length) urls.push('/placeholders/house-1.svg')
  // Evitar demasiadas capas en el DOM
  return urls.slice(0, 10)
})

const useCarousel = computed(() => props.carousel && slides.value.length > 1)

const active = ref(0)
const rootRef = ref<HTMLElement | null>(null)

const INTERVAL_MS = 3000
let timer: ReturnType<typeof setInterval> | null = null

function clearTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function nextSlide() {
  if (slides.value.length < 2) return
  active.value = (active.value + 1) % slides.value.length
}

function startTimer() {
  clearTimer()
  if (!useCarousel.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(nextSlide, INTERVAL_MS)
}

onMounted(() => {
  if (!useCarousel.value) return

  // Precarga para que el fade no se note vacío
  slides.value.forEach((src) => {
    const img = new Image()
    img.src = src
  })

  startTimer()

  const el = rootRef.value
  if (!el) return

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) startTimer()
      else clearTimer()
    },
    { threshold: 0.15 },
  )
  observer.observe(el)

  const onVisibility = () => {
    if (document.hidden) clearTimer()
    else startTimer()
  }
  document.addEventListener('visibilitychange', onVisibility)

  onUnmounted(() => {
    observer.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    clearTimer()
  })
})

onUnmounted(() => {
  clearTimer()
})
</script>

<template>
  <NuxtLink
    :to="localePath(`/casas/${house.slug}`)"
    class="group relative isolate block overflow-hidden rounded-2xl bg-ink outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
  >
    <div
      ref="rootRef"
      class="relative overflow-hidden rounded-2xl"
      :class="wide ? 'aspect-[4/3] md:aspect-[21/9]' : 'aspect-[4/3]'"
    >
      <template v-if="useCarousel">
        <img
          v-for="(src, i) in slides"
          :key="`${house.id}-${src}`"
          :src="src"
          alt=""
          class="absolute inset-0 h-full w-full object-cover"
          :class="i === active ? 'z-[1] opacity-100' : 'z-0 opacity-0'"
          :style="{
            transition: 'opacity 900ms cubic-bezier(0.32, 0.72, 0, 1)',
          }"
          :loading="i === 0 ? 'eager' : 'lazy'"
          draggable="false"
        >
      </template>
      <img
        v-else
        :src="slides[0]"
        alt=""
        class="h-full w-full object-cover transition duration-700 ease-expo group-hover:scale-[1.04]"
        loading="lazy"
      >

      <div class="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <span
        v-if="orderLabel"
        class="absolute left-3 top-3 z-[3] font-display text-[10px] font-semibold tracking-[0.18em] text-white/50 md:left-4 md:top-4"
      >
        {{ orderLabel }}
      </span>

      <div
        v-if="useCarousel"
        class="absolute bottom-16 left-4 z-[3] flex gap-1.5 md:bottom-20 md:left-5"
        aria-hidden="true"
      >
        <span
          v-for="(_, i) in slides"
          :key="i"
          class="h-1 rounded-full bg-white/40"
          :class="i === active ? '!w-6 !bg-white' : 'w-1.5'"
          :style="{
            width: i === active ? '1.5rem' : '0.375rem',
            transition: 'width 400ms cubic-bezier(0.32, 0.72, 0, 1), background-color 400ms ease',
          }"
        />
      </div>

      <div class="absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between gap-3 p-4 md:p-5">
        <div class="min-w-0">
          <h3 class="truncate font-display text-xl font-bold tracking-tight text-white md:text-2xl">
            {{ house.name }}
          </h3>
          <p class="mt-1 truncate text-xs text-white/70 md:text-sm">
            <span>{{ house.location }}</span>
            <span class="mx-1.5 text-white/35" aria-hidden="true">·</span>
            <span>{{ t('homes.capacity', { n: house.capacity }) }}</span>
          </p>
        </div>

        <span
          class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-sm text-white backdrop-blur-md transition duration-300 group-hover:bg-white group-hover:text-ink"
          :aria-label="t('homes.view')"
        >
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
