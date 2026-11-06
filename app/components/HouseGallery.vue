<script setup lang="ts">
const props = defineProps<{
  name: string
  cover: string | null
  images: { id: string; url: string; alt: string }[]
}>()

const { t } = useI18n()

const all = computed(() => {
  const list = [...props.images]
  if (props.cover && !list.some((i) => i.url === props.cover)) {
    list.unshift({ id: 'cover', url: props.cover, alt: props.name })
  }
  return list.length
    ? list
    : [{ id: 'fallback', url: '/placeholders/house-1.svg', alt: props.name }]
})

const main = computed(() => all.value[0])
const sideTop = computed(() => all.value[1] || all.value[0])
const sideBottom = computed(() => all.value[2] || all.value[0])
const thumbs = computed(() => {
  const rest = all.value.slice(3, 7)
  while (rest.length < 4 && all.value.length) {
    rest.push(all.value[rest.length % all.value.length])
  }
  return rest.slice(0, 4)
})

const extraCount = computed(() => Math.max(0, all.value.length - 7))

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

function openAt(i: number) {
  lightboxIndex.value = Math.max(0, Math.min(i, all.value.length - 1))
  lightboxOpen.value = true
}

function openMore() {
  openAt(Math.min(7, all.value.length - 1))
}

function closeLightbox() {
  lightboxOpen.value = false
}

function next() {
  lightboxIndex.value = (lightboxIndex.value + 1) % all.value.length
}

function prev() {
  lightboxIndex.value = (lightboxIndex.value - 1 + all.value.length) % all.value.length
}

function onKey(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div>
    <!-- Mosaic tipo Booking -->
    <div class="grid gap-2 md:grid-cols-[1.55fr_0.85fr] md:gap-2 lg:gap-2.5">
      <button
        type="button"
        class="group relative overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:row-span-2 md:min-h-[24rem] lg:min-h-[28rem]"
        @click="openAt(0)"
      >
        <img
          :src="main.url"
          :alt="main.alt"
          class="h-full min-h-[14rem] w-full object-cover transition duration-500 group-hover:scale-[1.02] md:absolute md:inset-0 md:min-h-0"
        >
      </button>

      <div class="grid grid-rows-2 gap-2">
        <button
          type="button"
          class="group relative min-h-[7rem] overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:min-h-0"
          @click="openAt(1)"
        >
          <img
            :src="sideTop.url"
            :alt="sideTop.alt"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          >
        </button>
        <button
          type="button"
          class="group relative min-h-[7rem] overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:min-h-0"
          @click="openAt(2)"
        >
          <img
            :src="sideBottom.url"
            :alt="sideBottom.alt"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          >
        </button>
      </div>
    </div>

    <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
      <button
        v-for="(img, i) in thumbs"
        :key="`${img.id}-thumb-${i}`"
        type="button"
        class="group relative aspect-[4/3] overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        @click="i === thumbs.length - 1 && extraCount > 0 ? openMore() : openAt(i + 3)"
      >
        <img
          :src="img.url"
          :alt="img.alt"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        >
        <span
          v-if="i === thumbs.length - 1 && extraCount > 0"
          class="absolute inset-0 flex items-center justify-center bg-black/55 px-2 text-center text-sm font-semibold text-white backdrop-blur-[2px]"
        >
          {{ t('homes.morePhotos', { n: extraCount }) }}
        </span>
      </button>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4"
        role="dialog"
        aria-modal="true"
        @click.self="closeLightbox"
      >
        <button
          type="button"
          class="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-2 text-sm text-white hover:bg-white/25"
          @click="closeLightbox"
        >
          ✕
        </button>
        <button
          type="button"
          class="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 px-3 py-3 text-white hover:bg-white/25 md:left-6"
          @click="prev"
        >
          ←
        </button>
        <img
          :src="all[lightboxIndex].url"
          :alt="all[lightboxIndex].alt"
          class="max-h-[85vh] max-w-full rounded-2xl object-contain"
        >
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 px-3 py-3 text-white hover:bg-white/25 md:right-6"
          @click="next"
        >
          →
        </button>
        <p class="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/75">
          {{ lightboxIndex + 1 }} / {{ all.length }}
        </p>
      </div>
    </Teleport>
  </div>
</template>
