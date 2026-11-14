<script setup lang="ts">
const props = defineProps<{
  lat: number | null
  lng: number | null
}>()

const { t } = useI18n()
const { getDistances } = useMadridDistances()

const distances = computed(() => getDistances(props.lat, props.lng))
</script>

<template>
  <section v-if="distances.length" class="overflow-hidden rounded-md border border-line bg-paper-elevated">
    <div class="border-b border-line px-2.5 py-1.5">
      <h2 class="font-display text-xs font-bold tracking-tight text-ink">
        {{ t('homes.distances') }}
      </h2>
    </div>

    <ul class="divide-y divide-line">
      <li
        v-for="item in distances"
        :key="item.id"
        class="flex items-center justify-between gap-1.5 px-2.5 py-1"
      >
        <p class="min-w-0 truncate text-[11px] leading-tight text-ink">
          <span class="font-medium">{{ item.label }}</span>
          <span class="text-mute"> · {{ item.distanceLabel }}</span>
        </p>
        <a
          :href="item.mapsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-9 min-w-9 shrink-0 items-center justify-center rounded-md px-1.5 text-[10px] font-semibold text-mute underline-offset-2 transition duration-200 hover:bg-paper hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {{ t('homes.route') }}
        </a>
      </li>
    </ul>
  </section>
</template>
