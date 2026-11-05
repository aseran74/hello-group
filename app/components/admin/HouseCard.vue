<script setup lang="ts">
import type { House } from '~/types/house'

const props = defineProps<{
  house: House
}>()

const emit = defineEmits<{
  togglePublished: [house: House]
}>()

const photoCount = computed(() => props.house.house_images?.length ?? 0)
const roomCount = computed(() => props.house.rooms?.length ?? props.house.bedrooms ?? 0)
</script>

<template>
  <article class="group flex flex-col overflow-hidden border border-line bg-white transition hover:border-ink/40">
    <NuxtLink :to="`/admin/casas/${house.id}`" class="relative block aspect-[4/3] overflow-hidden bg-mist">
      <img
        :src="house.cover_image_url || '/placeholders/house-1.svg'"
        :alt="house.name_es"
        class="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
      >
      <span
        class="absolute left-3 top-3 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
        :class="house.published ? 'bg-emerald-700 text-white' : 'bg-white/95 text-mute'"
      >
        {{ house.published ? 'Publicada' : 'Borrador' }}
      </span>
    </NuxtLink>

    <div class="flex flex-1 flex-col p-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h2 class="font-display text-xl font-semibold text-ink">{{ house.name_es }}</h2>
          <p class="mt-1 text-sm text-mute">{{ house.location_es }}</p>
        </div>
        <span class="shrink-0 text-xs text-mute">#{{ house.sort_order }}</span>
      </div>

      <p class="mt-3 line-clamp-2 text-sm leading-relaxed text-ink/80">
        {{ house.description_es || 'Sin descripción' }}
      </p>

      <dl class="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3 text-center text-xs text-mute">
        <div>
          <dt>Huéspedes</dt>
          <dd class="mt-0.5 font-semibold text-ink">{{ house.capacity }}</dd>
        </div>
        <div>
          <dt>Hab.</dt>
          <dd class="mt-0.5 font-semibold text-ink">{{ roomCount }}</dd>
        </div>
        <div>
          <dt>Fotos</dt>
          <dd class="mt-0.5 font-semibold text-ink">{{ photoCount }}</dd>
        </div>
      </dl>

      <div class="mt-4 flex flex-wrap gap-2">
        <NuxtLink
          :to="`/admin/casas/${house.id}`"
          class="flex-1 bg-ink px-3 py-2 text-center text-sm font-medium text-white hover:bg-black"
        >
          Editar
        </NuxtLink>
        <button
          type="button"
          class="border border-line px-3 py-2 text-sm text-mute hover:border-ink hover:text-ink"
          @click="emit('togglePublished', house)"
        >
          {{ house.published ? 'Ocultar' : 'Publicar' }}
        </button>
        <NuxtLink
          :to="`/casas/${house.slug}`"
          target="_blank"
          class="border border-line px-3 py-2 text-sm text-mute hover:border-ink hover:text-ink"
        >
          Ver
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
