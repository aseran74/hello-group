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
  <section v-if="distances.length" class="overflow-hidden rounded-xl border border-line bg-paper-elevated">
    <div class="border-b border-line px-4 py-3">
      <h2 class="font-display text-base font-bold tracking-tight text-ink md:text-lg">
        {{ t('homes.distances') }}
      </h2>
      <p class="mt-1 text-xs text-mute md:text-sm">
        {{ t('homes.distancesSub') }}
      </p>
    </div>

    <ul class="divide-y divide-line">
      <li
        v-for="item in distances"
        :key="item.id"
        class="flex items-center justify-between gap-3 px-4 py-3"
      >
        <div class="min-w-0">
          <p class="text-sm font-medium text-ink">{{ item.label }}</p>
          <p class="mt-0.5 text-sm text-mute">{{ item.distanceLabel }}</p>
        </div>
        <a
          :href="item.mapsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="shrink-0 text-sm font-semibold text-ink underline-offset-4 hover:underline"
        >
          {{ t('homes.route') }}
        </a>
      </li>
    </ul>
  </section>
</template>
