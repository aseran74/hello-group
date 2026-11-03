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
  return [
    { label: t('homes.specType'), value: h.property_type },
    { label: t('homes.specSize'), value: h.size_m2 ? `${h.size_m2} m²` : '—' },
    { label: t('homes.specBedrooms'), value: t('homes.bedrooms', { n: h.bedrooms }) },
    { label: t('homes.specBathrooms'), value: t('homes.bathrooms', { n: h.bathrooms }) },
    { label: t('homes.specGuests'), value: t('homes.capacity', { n: h.capacity }) },
    { label: t('homes.specGarage'), value: h.garage ? t('homes.garageYes') : t('homes.garageNo') },
    { label: t('homes.specPrice'), value: h.price_label },
  ]
})

const mapLink = computed(() => {
  const h = house.value
  if (!h) return null
  if (h.map_url) return h.map_url
  if (h.lat != null && h.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}`
  }
  return null
})

const shareCopied = ref(false)

async function shareListing() {
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const title = house.value?.name || 'Hello Group'
  try {
    if (navigator.share) {
      await navigator.share({ title, url })
      return
    }
  } catch {
    /* fall through to clipboard */
  }
  try {
    await navigator.clipboard.writeText(url)
    shareCopied.value = true
    setTimeout(() => {
      shareCopied.value = false
    }, 2000)
  } catch {
    /* ignore */
  }
}

useSeoMeta({
  title: () => `${house.value?.name || ''} · Hello Group`,
  description: () => house.value?.description || '',
})
</script>

<template>
  <div v-if="house">
    <!-- Cabecera tipo Booking -->
    <section class="mx-auto w-full max-w-[90rem] px-5 pb-5 pt-28 md:px-8 md:pb-6 md:pt-32">
      <NuxtLink
        :to="localePath('/casas')"
        class="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-mute transition hover:text-ink"
      >
        <span aria-hidden="true">←</span>
        {{ t('homes.back') }}
      </NuxtLink>

      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="min-w-0">
          <h1 class="font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
            {{ house.name }}
          </h1>
          <p class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-mute md:text-base">
            <span class="inline-flex items-center gap-1.5">
              <span aria-hidden="true">📍</span>
              <span>{{ house.address }}</span>
            </span>
            <a
              v-if="mapLink"
              :href="mapLink"
              target="_blank"
              rel="noopener noreferrer"
              class="font-semibold text-ink underline-offset-4 hover:underline"
            >
              {{ t('homes.viewMap') }}
            </a>
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink
            :to="localePath({ path: '/contacto', query: { casa: house.slug, reserva: '1' } })"
            class="btn-primary"
          >
            {{ t('nav.book') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Galería 75% + mapa 25% -->
    <section class="mx-auto w-full max-w-[90rem] px-5 md:px-8">
      <div class="grid gap-3 lg:grid-cols-[3fr_1fr] lg:gap-4 lg:items-stretch">
        <HouseGallery
          :name="house.name"
          :cover="house.cover_image_url"
          :images="house.images"
        />
        <HouseSideMap
          class="lg:min-h-full"
          :name="house.name"
          :address="house.address"
          :location="house.location"
          :lat="house.lat"
          :lng="house.lng"
          :map-url="house.map_url"
        />
      </div>

      <!-- Acciones: compartir / contacto / fechas / FAQ -->
      <div class="mt-5 flex flex-wrap gap-2 md:mt-6 md:gap-3">
        <button
          type="button"
          class="btn-secondary"
          @click="shareListing"
        >
          {{ shareCopied ? t('homes.shareDone') : t('homes.share') }}
        </button>
        <NuxtLink
          :to="localePath({ path: '/contacto', query: { casa: house.slug } })"
          class="btn-secondary"
        >
          {{ t('homes.contactCta') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath({ path: '/contacto', query: { casa: house.slug, reserva: '1' } })"
          class="btn-primary"
        >
          {{ t('homes.seeDates') }}
        </NuxtLink>
      </div>
    </section>

    <!-- Chips -->
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

          <div v-if="house.activities.length">
            <h2 class="font-display text-2xl font-bold tracking-tight text-ink">
              {{ t('homes.nearbyServices') }}
            </h2>
            <p class="mt-2 text-sm text-mute">{{ t('homes.nearbyServicesSub') }}</p>
            <ul class="mt-5 grid gap-3 sm:grid-cols-2">
              <li
                v-for="item in house.activities"
                :key="`${item.key}-${item.label}`"
                class="flex items-start gap-3 rounded-2xl border border-line bg-paper-elevated px-4 py-4 text-ink"
              >
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-mist">
                  <ActivityIcon :name="item.key" />
                </span>
                <span>
                  <span class="block font-semibold">{{ item.label }}</span>
                  <span v-if="item.detail" class="mt-0.5 block text-sm text-mute">{{ item.detail }}</span>
                </span>
              </li>
            </ul>
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
