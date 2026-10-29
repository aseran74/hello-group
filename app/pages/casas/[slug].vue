<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const { fetchHouseBySlug } = useHouses()

const slug = computed(() => String(route.params.slug))

const { data: house } = await useAsyncData(
  () => `house-${slug.value}`,
  () => fetchHouseBySlug(slug.value),
  { watch: [slug] },
)

if (!house.value) {
  throw createError({ statusCode: 404, statusMessage: 'House not found' })
}

useSeoMeta({
  title: () => `${house.value?.name || ''} · Hello Group`,
  description: () => house.value?.description || '',
})
</script>

<template>
  <div v-if="house">
    <section class="relative isolate min-h-[58vh] overflow-hidden bg-ink md:min-h-[68vh]">
      <img
        :src="house.cover_image_url || '/placeholders/house-1.svg'"
        :alt="house.name"
        class="absolute inset-0 h-full w-full object-cover"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/15" />
      <div class="relative page-shell flex min-h-[58vh] flex-col justify-end px-5 pb-12 pt-28 text-mist md:min-h-[68vh] md:px-8 md:pb-16">
        <p class="eyebrow text-white/65">{{ house.location }}</p>
        <h1 class="mt-3 max-w-[12ch] font-display text-5xl font-bold tracking-tight md:text-7xl">
          {{ house.name }}
        </h1>
        <p class="mt-4 text-white/75">
          {{ t('homes.capacity', { n: house.capacity }) }}
          ·
          {{ t('homes.bedrooms', { n: house.bedrooms }) }}
        </p>
      </div>
    </section>

    <section class="section-pad">
      <div class="page-shell grid gap-14 lg:grid-cols-[1.35fr_0.75fr] lg:gap-16">
        <div>
          <p class="max-w-2xl text-xl leading-relaxed text-ink md:text-2xl md:leading-relaxed">
            {{ house.description }}
          </p>

          <div v-if="house.amenities.length" class="mt-14">
            <h2 class="font-display text-2xl font-bold tracking-tight text-ink">
              {{ t('homes.amenities') }}
            </h2>
            <ul class="mt-6 grid gap-3 sm:grid-cols-2">
              <li
                v-for="item in house.amenities"
                :key="item.key"
                class="flex items-center gap-3 border-b border-line py-3 text-mute"
              >
                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-ink" aria-hidden="true" />
                {{ item.label }}
              </li>
            </ul>
          </div>

          <div v-if="house.images.length" class="mt-14">
            <h2 class="font-display text-2xl font-bold tracking-tight text-ink">
              {{ t('homes.gallery') }}
            </h2>
            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <img
                v-for="(img, i) in house.images"
                :key="img.id"
                :src="img.url"
                :alt="img.alt"
                class="w-full object-cover"
                :class="i === 0 ? 'aspect-[16/10] sm:col-span-2' : 'aspect-[4/3]'"
                loading="lazy"
              >
            </div>
          </div>
        </div>

        <aside class="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div class="rounded-[1.75rem] border border-line bg-paper-elevated p-6 md:p-7">
            <p class="eyebrow">{{ t('homes.location') }}</p>
            <p class="mt-3 font-display text-2xl font-bold text-ink">{{ house.location }}</p>
            <NuxtLink
              :to="localePath({ path: '/contacto', query: { casa: house.slug } })"
              class="btn-primary mt-7 w-full"
            >
              {{ t('homes.ask') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath({ path: '/contacto', query: { casa: house.slug, reserva: '1' } })"
              class="btn-secondary mt-3 w-full"
            >
              {{ t('nav.book') }}
            </NuxtLink>
          </div>
          <RoomRaccoonSlot />
        </aside>
      </div>
    </section>
  </div>
</template>
