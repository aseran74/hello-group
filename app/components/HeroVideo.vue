<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Contenedor ondulado / con márgenes (estilo landing) */
    framed?: boolean
  }>(),
  { framed: false },
)

const { t } = useI18n()
const localePath = useLocalePath()

const VIDEO_SRC = '/Apple3/gemini_generated_video_c4c919e5.mp4'
const TOTAL_FRAMES = 50
const FRAME_SEQUENCE = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const n = String(i).padStart(3, '0')
  return `/Apple3/gemini_generated_video_c4c919e5_${n}.jpg`
})

/** Altura del runway de scroll en viewports tras el vídeo */
const SCROLL_HEIGHT_VH = 280
/** Intro de vídeo: máximo 5s */
const VIDEO_MAX_MS = 5_000
const VIDEO_MAX_S = VIDEO_MAX_MS / 1000

const sectionRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)

const images: (HTMLImageElement | undefined)[] = []
let currentFrame = 0
let videoCutoffTimer: ReturnType<typeof setTimeout> | null = null

const isLoaded = ref(false)
const videoEnded = ref(false)
const videoPaused = ref(false)
const progress = ref(0)
const reduceMotion = ref(false)
const userPaused = ref(false)

function clearVideoCutoff() {
  if (videoCutoffTimer) {
    clearTimeout(videoCutoffTimer)
    videoCutoffTimer = null
  }
}

function scheduleVideoCutoff() {
  clearVideoCutoff()
  if (videoEnded.value || reduceMotion.value) return
  const video = videoRef.value
  const elapsedMs = video ? Math.max(0, video.currentTime * 1000) : 0
  const remaining = Math.max(0, VIDEO_MAX_MS - elapsedMs)
  videoCutoffTimer = setTimeout(() => {
    const v = videoRef.value
    if (v && !v.paused) v.pause()
    finishVideo()
  }, remaining)
}

function onVideoTimeUpdate() {
  const video = videoRef.value
  if (!video || videoEnded.value) return
  if (video.currentTime >= VIDEO_MAX_S) {
    video.pause()
    finishVideo()
  }
}

function drawFrame(index: number) {
  const canvas = canvasRef.value
  const img = images[index]
  if (!canvas || !img?.complete || !img.naturalWidth) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const parent = canvas.parentElement
  const w = parent?.clientWidth || window.innerWidth
  const h = parent?.clientHeight || window.innerHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const canvasAspect = w / h
  const imgAspect = img.naturalWidth / img.naturalHeight

  let drawWidth: number
  let drawHeight: number

  // Cover a pantalla completa en todos los anchos (sin letterbox)
  if (imgAspect > canvasAspect) {
    drawHeight = h
    drawWidth = drawHeight * imgAspect
  } else {
    drawWidth = w
    drawHeight = drawWidth / imgAspect
  }

  const offsetX = (w - drawWidth) / 2
  const offsetY = (h - drawHeight) / 2

  ctx.clearRect(0, 0, w, h)
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
  currentFrame = index
}

function finishVideo() {
  clearVideoCutoff()
  videoEnded.value = true
}

function onVideoLoaded() {
  const video = videoRef.value
  if (!video) return
  video.play().then(() => scheduleVideoCutoff()).catch(finishVideo)
}

function toggleVideoPlayback() {
  const video = videoRef.value
  if (!video || videoEnded.value) return

  if (video.paused) {
    userPaused.value = false
    video.play().then(() => scheduleVideoCutoff()).catch(finishVideo)
    videoPaused.value = false
  } else {
    userPaused.value = true
    clearVideoCutoff()
    video.pause()
    videoPaused.value = true
  }
}

const sectionHeight = computed(() => {
  if (reduceMotion.value || !videoEnded.value) {
    return props.framed ? undefined : '100svh'
  }
  return props.framed ? `${Math.round(SCROLL_HEIGHT_VH * 0.85)}vh` : `${SCROLL_HEIGHT_VH}vh`
})

const textOpacity = computed(() => {
  if (!videoEnded.value || reduceMotion.value) return 1
  // Se mantiene visible a mitad del scroll y desaparece al final
  const p = progress.value
  if (p < 0.45) return 1
  return Math.max(0, 1 - (p - 0.45) / 0.55)
})

const textY = computed(() => {
  if (!videoEnded.value || reduceMotion.value) return 0
  const p = Math.max(0, progress.value - 0.45)
  return p * 72
})

const scrollHintVisible = computed(() => !videoEnded.value || progress.value < 0.85)

const textInteractive = computed(() => textOpacity.value > 0.08)

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Precarga frames mientras suena el vídeo (evita apagones)
  let loaded = 0
  FRAME_SEQUENCE.forEach((src, index) => {
    const img = new Image()
    img.src = src
    img.decoding = 'async'
    const done = () => {
      images[index] = img
      loaded += 1
      if (loaded === TOTAL_FRAMES) {
        isLoaded.value = true
        drawFrame(0)
      }
    }
    img.onload = done
    img.onerror = done
  })

  if (!reduceMotion.value) {
    videoRef.value?.play().then(() => scheduleVideoCutoff()).catch(finishVideo)
  }

  const section = sectionRef.value
  const video = videoRef.value
  if (section && video && !reduceMotion.value) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (!entry.isIntersecting) {
          clearVideoCutoff()
          video.pause()
          return
        }
        if (!userPaused.value && !videoEnded.value) {
          video.play().then(() => scheduleVideoCutoff()).catch(finishVideo)
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(section)
    onUnmounted(() => {
      observer.disconnect()
      clearVideoCutoff()
    })
  }
})

watch([videoEnded, isLoaded], ([ended, loaded]) => {
  if (ended && loaded) drawFrame(0)
})

watch(
  [isLoaded, videoEnded, reduceMotion],
  ([loaded, ended, reduced], _prev, onCleanup) => {
    if (!import.meta.client || !loaded || !ended) return

    if (reduced) {
      drawFrame(0)
      progress.value = 0
      return
    }

    const onScroll = () => {
      const section = sectionRef.value
      if (!section) return

      const rect = section.getBoundingClientRect()
      const total = section.offsetHeight - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), total)
      const p = total > 0 ? scrolled / total : 0
      progress.value = p

      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(p * (TOTAL_FRAMES - 1))),
      )
      if (frameIndex !== currentFrame) {
        requestAnimationFrame(() => drawFrame(frameIndex))
      }
    }

    const onResize = () => {
      drawFrame(currentFrame)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    onScroll()

    onCleanup(() => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    })
  },
)
</script>

<template>
  <section
    ref="sectionRef"
    class="relative z-30"
    :class="[
      framed && 'px-4 pt-20 md:px-6 md:pt-24',
      framed && !videoEnded && 'min-h-[min(78svh,44rem)] md:min-h-[min(82svh,48rem)]',
    ]"
    :style="sectionHeight ? { height: sectionHeight } : undefined"
    :aria-label="t('home.welcome')"
  >
    <div
      class="sticky w-full overflow-hidden bg-ink text-mist"
      :class="
        framed
          ? 'hero-framed top-3 h-[min(78svh,44rem)] md:top-4 md:h-[min(82svh,48rem)]'
          : 'top-0 h-[100svh]'
      "
    >
      <div
        v-if="framed"
        class="absolute right-4 top-4 z-30 max-w-[11rem] overflow-hidden rounded-[1.35rem] border border-white/25 bg-black/35 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-md md:right-6 md:top-6 md:max-w-[13rem]"
      >
        <img
          src="/landing/madrid-retiro.jpg"
          alt=""
          class="aspect-[4/3] w-full object-cover"
          loading="lazy"
        >
        <p class="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
          {{ t('home.heroChip') }}
        </p>
      </div>
      <img
        v-if="!isLoaded && videoEnded"
        :src="FRAME_SEQUENCE[0]"
        alt=""
        class="hero-media absolute inset-0 h-full w-full"
      >

      <canvas
        ref="canvasRef"
        class="absolute inset-0 z-[1] block h-full w-full"
        :style="{
          opacity: videoEnded && isLoaded ? 1 : 0,
          transition: 'opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
        }"
      />

      <video
        v-if="!reduceMotion"
        ref="videoRef"
        class="hero-media absolute inset-0 z-[2] h-full w-full"
        :style="{
          opacity: videoEnded ? 0 : 1,
          transition: 'opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
          pointerEvents: videoEnded ? 'none' : 'auto',
        }"
        muted
        playsinline
        preload="auto"
        :poster="FRAME_SEQUENCE[0]"
        :src="VIDEO_SRC"
        @loadeddata="onVideoLoaded"
        @timeupdate="onVideoTimeUpdate"
        @ended="finishVideo"
        @error="finishVideo"
      />

      <img
        v-if="reduceMotion"
        :src="FRAME_SEQUENCE[0]"
        alt=""
        class="hero-media absolute inset-0 z-[2] h-full w-full"
        @load="finishVideo"
      >

      <div class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/45 via-black/15 to-black/10" />

      <div
        class="absolute inset-0 z-20 flex items-end transition-[opacity,transform] duration-150 ease-out"
        :class="textInteractive ? 'pointer-events-auto' : 'pointer-events-none'"
        :style="{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }"
      >
        <div class="page-shell w-full px-5 pb-20 pt-28 md:px-8 md:pb-28">
          <p class="eyebrow text-white/70">Hello Group</p>
          <h1 class="mt-4 max-w-[14ch] font-display text-[clamp(2.4rem,6vw,4.75rem)] font-bold leading-[1.02] tracking-tight text-white">
            {{ t('home.welcome') }}
          </h1>
          <p
            class="mt-5 inline-block max-w-2xl rounded-2xl bg-neutral-500/45 px-4 py-3 text-lg font-medium leading-snug text-white shadow-[0_8px_28px_rgba(0,0,0,0.22)] backdrop-blur-md md:px-5 md:py-3.5 md:text-xl lg:text-2xl"
          >
            {{ t('home.headline') }}
          </p>
          <div class="mt-9 flex flex-wrap gap-3">
            <NuxtLink :to="localePath('/casas')" class="btn-primary bg-white text-ink hover:bg-mist">
              {{ t('home.ctaHomes') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/contacto')" class="btn-ghost">
              {{ t('home.ctaContact') }}
            </NuxtLink>
          </div>

          <div class="mt-10 flex items-center gap-4">
            <div
              v-if="videoEnded && !reduceMotion"
              class="h-0.5 w-28 overflow-hidden rounded-full bg-white/20"
              aria-hidden="true"
            >
              <div
                class="h-full origin-left rounded-full bg-white"
                :style="{ transform: `scaleX(${Math.max(0.04, progress)})` }"
              />
            </div>
            <p
              v-if="scrollHintVisible"
              class="text-xs font-medium uppercase tracking-wider text-white/55"
            >
              {{ t('home.scrollHint') }}
            </p>
          </div>
        </div>
      </div>

      <button
        v-if="!reduceMotion && !videoEnded"
        type="button"
        class="absolute bottom-6 right-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/25"
        :aria-label="videoPaused ? 'Play' : 'Pause'"
        @click="toggleVideoPlayback"
      >
        <span v-if="videoPaused" aria-hidden="true" class="ml-0.5 text-sm">▶</span>
        <span v-else aria-hidden="true" class="text-sm">❚❚</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.hero-media {
  object-fit: cover;
  object-position: center center;
  width: 100%;
  height: 100%;
}

.hero-framed {
  border-radius: 2rem 2rem 42% 42% / 2rem 2rem 10% 10%;
}

@media (min-width: 768px) {
  .hero-framed {
    border-radius: 2.75rem 2.75rem 46% 46% / 2.75rem 2.75rem 12% 12%;
  }
}
</style>
