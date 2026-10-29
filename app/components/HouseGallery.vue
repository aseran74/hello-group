<script setup lang="ts">
const props = defineProps<{
  name: string
  cover: string | null
  images: { id: string; url: string; alt: string }[]
}>()

const all = computed(() => {
  const list = [...props.images]
  if (props.cover && !list.some((i) => i.url === props.cover)) {
    list.unshift({ id: 'cover', url: props.cover, alt: props.name })
  }
  return list.length ? list : [{ id: 'fallback', url: '/placeholders/house-1.svg', alt: props.name }]
})

const active = ref(0)
const current = computed(() => all.value[active.value] || all.value[0])

function select(i: number) {
  active.value = i
}

function next() {
  active.value = (active.value + 1) % all.value.length
}

function prev() {
  active.value = (active.value - 1 + all.value.length) % all.value.length
}
</script>

<template>
  <div>
    <div class="relative overflow-hidden bg-ink">
      <img
        :src="current.url"
        :alt="current.alt"
        class="aspect-[16/10] w-full object-cover md:aspect-[16/9]"
      >
      <div class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/60 to-transparent p-4">
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-white hover:text-ink"
          :aria-label="'Anterior'"
          @click="prev"
        >
          ←
        </button>
        <p class="text-xs font-medium text-white/80">
          {{ active + 1 }} / {{ all.length }}
        </p>
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-white hover:text-ink"
          :aria-label="'Siguiente'"
          @click="next"
        >
          →
        </button>
      </div>
    </div>

    <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="(img, i) in all"
        :key="img.id"
        type="button"
        class="relative h-16 w-24 shrink-0 overflow-hidden border transition md:h-20 md:w-28"
        :class="i === active ? 'border-ink' : 'border-transparent opacity-70 hover:opacity-100'"
        @click="select(i)"
      >
        <img :src="img.url" :alt="img.alt" class="h-full w-full object-cover" loading="lazy">
      </button>
    </div>
  </div>
</template>
