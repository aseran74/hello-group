<script setup lang="ts">
import type { LocalizedHouse } from '~/types/house'

const props = withDefaults(
  defineProps<{
    house: LocalizedHouse
    index?: number
  }>(),
  { index: undefined },
)

const { t } = useI18n()
const localePath = useLocalePath()

const orderLabel = computed(() =>
  props.index != null ? String(props.index + 1).padStart(2, '0') : null,
)
</script>

<template>
  <NuxtLink
    :to="localePath(`/casas/${house.slug}`)"
    class="group relative isolate block overflow-hidden bg-ink outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
  >
    <div class="relative aspect-[4/3] overflow-hidden">
      <img
        :src="house.cover_image_url || '/placeholders/house-1.svg'"
        :alt="''"
        class="h-full w-full object-cover transition duration-700 ease-expo group-hover:scale-[1.04]"
        loading="lazy"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <span
        v-if="orderLabel"
        class="absolute left-3 top-3 font-display text-[10px] font-semibold tracking-[0.18em] text-white/50 md:left-4 md:top-4"
      >
        {{ orderLabel }}
      </span>

      <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-5">
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
