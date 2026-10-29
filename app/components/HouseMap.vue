<script setup lang="ts">
const props = defineProps<{
  name: string
  address: string
  location: string
  lat: number | null
  lng: number | null
  mapUrl: string | null
}>()

const { t } = useI18n()
const config = useRuntimeConfig()

const apiKey = computed(() => String(config.public.googleMapsApiKey || '').trim())
const hasCoords = computed(() => props.lat != null && props.lng != null)

const embedSrc = computed(() => {
  if (!hasCoords.value || !apiKey.value) return null
  const q = encodeURIComponent(`${props.lat},${props.lng}`)
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey.value}&q=${q}&zoom=14`
})
</script>

<template>
  <div>
    <h2 class="font-display text-2xl font-bold tracking-tight text-ink">
      {{ t('homes.location') }}
    </h2>
    <p class="mt-3 text-mute">{{ address }}</p>

    <div class="mt-5 overflow-hidden rounded-[1.25rem] border border-line bg-line/30">
      <iframe
        v-if="embedSrc"
        class="aspect-[16/10] w-full border-0"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
        :src="embedSrc"
        :title="name"
      />
      <div
        v-else
        class="flex aspect-[16/10] flex-col items-center justify-center gap-3 px-6 text-center"
      >
        <p class="font-display text-lg font-semibold text-ink">{{ location }}</p>
        <p class="max-w-sm text-sm text-mute">
          {{ apiKey ? t('homes.mapUnavailable') : t('homes.mapPending') }}
        </p>
      </div>
    </div>

    <a
      v-if="mapUrl"
      :href="mapUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="btn-secondary mt-4"
    >
      {{ t('homes.viewMap') }}
    </a>
  </div>
</template>
