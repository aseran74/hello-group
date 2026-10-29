<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const VIDEO_SRC = '/Apple/gemini_generated_video_3ae6ed2e.mp4'
const TOTAL_FRAMES = 10
const FRAME_SEQUENCE = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const n = String(i + 1).padStart(3, '0')
  return `/Apple/frame_${n}.jpg`
})

/** Altura del runway de scroll en viewports tras el vídeo */
const SCROLL_HEIGHT_VH = 180

const sectionRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)

const images: (HTMLImageElement | undefined)[] = []
let currentFrame = 0

const isLoaded = ref(false)
const videoEnded = ref(false)
const videoPaused = ref(false)
const progress = ref(0)
const reduceMotion = ref(false)
const userPaused = ref(false)

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

  const scaleBoost = w < 768 ? 1.08 : 1.02
  const canvasAspect = w / h
  const imgAspect = img.naturalWidth / img.naturalHeight

  let drawWidth: number
  let drawHeight: number
  if (imgAspect > canvasAspect) {
    drawHeight = h * scaleBoost
    drawWidth = drawHeight * imgAspect
  } else {
    drawWidth = w * scaleBoost
    drawHeight = drawWidth / imgAspect
  }

  const offsetX = (w - drawWidth) / 2
  const offsetY = (h - drawHeight) / 2

  ctx.clearRect(0, 0, w, h)
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
  currentFrame = index
}

function finishVideo() {
  videoEnded.value = true
}

function onVideoLoaded() {
  videoRef.value?.play().catch(finishVideo)
}

function toggleVideoPlayback() {
  const video = videoRef.value
  if (!video || videoEnded.value) return

  if (video.paused) {
    userPaused.value = false
    video.play().catch(finishVideo)
    videoPaused.value = false
  } else {
    userPaused.value = true
    video.pause()
    videoPaused.value = true
  }
}

const sectionHeight = computed(() => {
  if (reduceMotion.value || !videoEnded.value) return '100svh'
  return `${SCROLL_HEIGHT_VH}vh`
})

const textOpacity = computed(() => {
  if (!videoEnded.value || reduceMotion.value) return 1
  return Math.max(0, 1 - progress.value * 1.35)
})

const textY = computed(() => {
  if (!videoEnded.value || reduceMotion.value) return 0
  return progress.value * 48
})

const scrollHintVisible = computed(() => !videoEnded.value || progress.value < 0.9)

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
    videoRef.value?.play().catch(finishVideo)
  }

  const section = sectionRef.value
  const video = videoRef.value
  if (section && video && !reduceMotion.value) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (!entry.isIntersecting) {
          video.pause()
          return
        }
        if (!userPaused.value && !videoEnded.value) {
          video.play().catch(finishVideo)
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(section)
    onUnmounted(() => observer.disconnect())
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
    :style="{ height: sectionHeight }"
    :aria-label="t('home.welcome')"
  >
    <div class="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink text-mist">
      <img
        v-if="!isLoaded && videoEnded"
        :src="FRAME_SEQUENCE[0]"
        alt=""
        class="absolute inset-0 h-full w-full object-cover"
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
        class="absolute inset-0 z-[2] h-full w-full object-cover"
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
        @ended="finishVideo"
        @error="finishVideo"
      />

      <img
        v-if="reduceMotion"
        :src="FRAME_SEQUENCE[0]"
        alt=""
        class="absolute inset-0 z-[2] h-full w-full object-cover"
        @load="finishVideo"
      >

      <div class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/45 via-black/15 to-black/10" />

      <div
        class="absolute inset-0 z-20 flex items-end"
        :style="{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }"
      >
        <div class="page-shell pointer-events-auto w-full px-5 pb-20 pt-28 md:px-8 md:pb-28">
          <p class="eyebrow text-white/70">Hello Group</p>
          <h1 class="mt-4 max-w-[14ch] font-display text-[clamp(2.4rem,6vw,4.75rem)] font-bold leading-[1.02] tracking-tight text-white">
            {{ t('home.welcome') }}
          </h1>
          <p class="mt-5 max-w-md text-base leading-relaxed text-white/80 md:text-lg">
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
