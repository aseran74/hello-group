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

const specs = computed(() => {
  const h = house.value!
  const items = [
    { label: t('homes.specType'), value: h.property_type },
    { label: t('homes.specSize'), value: h.size_m2 ? `${h.size_m2} m²` : '—' },
    { label: t('homes.specBedrooms'), value: t('homes.bedrooms', { n: h.bedrooms }) },
    { label: t('homes.specBathrooms'), value: t('homes.bathrooms', { n: h.bathrooms }) },
    { label: t('homes.specGuests'), value: t('homes.capacity', { n: h.capacity }) },
    { label: t('homes.specGarage'), value: h.garage ? t('homes.garageYes') : t('homes.garageNo') },
    { label: t('homes.specPrice'), value: h.price_label },
  ]
  return items
})

useSeoMeta({
  title: () => `${house.value?.name || ''} · Hello Group`,
  description: () => house.value?.description || '',
})
</script>

<template>
  <div v-if="house">
    <section class="page-shell px-5 pb-8 pt-28 md:px-8 md:pb-10 md:pt-32">
      <p class="eyebrow">{{ house.location }}</p>
      <h1 class="mt-2 font-display text-4xl font-bold tracking-tight text-ink md:text-6xl">
        {{ house.name }}
      </h1>
      <p class="mt-3 max-w-3xl text-base text-mute md:text-lg">
        {{ house.property_type }}
        <span class="mx-2 text-line">·</span>
        {{ house.address }}
        <a
          v-if="house.map_url"
          :href="house.map_url"
          target="_blank"
          rel="noopener noreferrer"
          class="ml-2 font-semibold text-ink underline-offset-4 hover:underline"
        >
          {{ t('homes.viewMap') }}
        </a>
      </p>
    </section>

    <section class="page-shell px-5 md:px-8">
      <HouseGallery
        :name="house.name"
        :cover="house.cover_image_url"
        :images="house.images"
      />
    </section>

    <!-- Características tipo HolyDeo -->
    <section class="page-shell px-5 pt-8 md:px-8">
      <div class="flex flex-wrap gap-2 md:gap-3">
        <div
          v-for="spec in specs"
          :key="spec.label"
          class="rounded-full border border-line bg-paper-elevated px-4 py-2 text-sm"
        >
          <span class="text-mute">{{ spec.label }}</span>
          <span class="ml-2 font-semibold text-ink">{{ spec.value }}</span>
        </div>
      </div>
    </section>

    <section class="section-pad !pt-10">
      <div class="page-shell grid gap-12 lg:grid-cols-[1.35fr_0.75fr] lg:gap-14">
        <div class="space-y-12">
          <div>
            <h2 class="font-display text-2xl font-bold tracking-tight text-ink">
              {{ t('homes.description') }}
            </h2>
            <p class="mt-4 max-w-2xl text-lg leading-relaxed text-mute">
              {{ house.description }}
            </p>
          </div>

          <div>
            <h2 class="font-display text-2xl font-bold tracking-tight text-ink">
              {{ t('homes.features') }}
            </h2>
            <dl class="mt-5 divide-y divide-line border-y border-line">
              <div
                v-for="spec in specs"
                :key="`row-${spec.label}`"
                class="grid grid-cols-[1fr_auto] gap-4 py-3.5 text-sm md:text-base"
              >
                <dt class="text-mute">{{ spec.label }}</dt>
                <dd class="font-semibold text-ink">{{ spec.value }}</dd>
              </div>
              <div class="grid grid-cols-[1fr_auto] gap-4 py-3.5 text-sm md:text-base">
                <dt class="text-mute">{{ t('homes.location') }}</dt>
                <dd class="max-w-[18rem] text-right font-semibold text-ink">{{ house.address }}</dd>
              </div>
            </dl>
          </div>

          <div v-if="house.amenities.length">
            <h2 class="font-display text-2xl font-bold tracking-tight text-ink">
              {{ t('homes.amenities') }}
            </h2>
            <ul class="mt-5 grid gap-3 sm:grid-cols-2">
              <li
                v-for="item in house.amenities"
                :key="item.key"
                class="flex items-center gap-3 rounded-2xl border border-line bg-paper-elevated px-4 py-3 text-ink"
              >
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs text-mist" aria-hidden="true">
                  ✓
                </span>
                {{ item.label }}
              </li>
            </ul>
          </div>

          <div>
            <h2 class="font-display text-2xl font-bold tracking-tight text-ink">
              {{ t('homes.location') }}
            </h2>
            <p class="mt-3 text-mute">{{ house.address }}</p>
            <div class="mt-5 overflow-hidden rounded-[1.25rem] border border-line bg-line/40">
              <iframe
                v-if="house.lat != null && house.lng != null"
                class="aspect-[16/10] w-full border-0 grayscale"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                :src="`https://maps.google.com/maps?q=${house.lat},${house.lng}&z=14&output=embed`"
                :title="house.name"
              />
              <div v-else class="flex aspect-[16/10] items-center justify-center text-sm text-mute">
                {{ house.location }}
              </div>
            </div>
            <a
              v-if="house.map_url"
              :href="house.map_url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary mt-4"
            >
              {{ t('homes.viewMap') }}
            </a>
          </div>
        </div>

        <aside class="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div class="rounded-[1.75rem] border border-line bg-paper-elevated p-6 md:p-7">
            <p class="eyebrow">{{ house.name }}</p>
            <p class="mt-3 font-display text-3xl font-bold text-ink">{{ house.price_label }}</p>
            <p class="mt-2 text-sm text-mute">
              {{ house.size_m2 ? `${house.size_m2} m²` : '' }}
              <template v-if="house.size_m2"> · </template>
              {{ t('homes.bedrooms', { n: house.bedrooms }) }}
              <template v-if="house.garage"> · {{ t('homes.garageYes') }}</template>
            </p>
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
