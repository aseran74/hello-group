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

const hasCoords = computed(() => props.lat != null && props.lng != null)

/** Embed sin Maps Embed API (no requiere activar APIs de pago en Google Cloud). */
const embedSrc = computed(() => {
  if (!hasCoords.value) return null
  return `https://maps.google.com/maps?q=${props.lat},${props.lng}&z=14&hl=es&output=embed`
})

const externalUrl = computed(
  () =>
    props.mapUrl
    || (hasCoords.value
      ? `https://www.google.com/maps/search/?api=1&query=${props.lat},${props.lng}`
      : null),
)
</script>

<template>
  <aside class="flex flex-col overflow-hidden rounded-xl border border-line bg-paper-elevated">
    <div class="border-b border-line px-4 py-3">
      <p class="text-xs font-semibold uppercase tracking-wider text-mute">
        {{ t('homes.location') }}
      </p>
      <p class="mt-1 line-clamp-2 text-sm font-medium text-ink">
        {{ address || location }}
      </p>
    </div>

    <div class="relative aspect-[4/3] min-h-[14rem] bg-line/30">
      <iframe
        v-if="embedSrc"
        class="absolute inset-0 h-full w-full border-0 grayscale-[0.15]"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
        :src="embedSrc"
        :title="name"
      />
      <div
        v-else
        class="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-mute"
      >
        {{ location }}
      </div>

      <a
        v-if="externalUrl"
        :href="externalUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-md transition hover:bg-mist"
      >
        {{ t('homes.viewOnMap') }}
      </a>
    </div>
  </aside>
</template>
