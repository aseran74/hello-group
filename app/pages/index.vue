<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { fetchHouses } = useHouses()
const { fetchFaqs } = useFaqs()

const { data: houses } = await useAsyncData('home-houses', () => fetchHouses())
const { data: faqs } = await useAsyncData('home-faqs', () => fetchFaqs({ publishedOnly: true }))

const apartmentHomes = computed(() =>
  (houses.value || []).filter((h) => (h.apartments?.length || 0) > 0),
)
const roomHomes = computed(() =>
  (houses.value || []).filter((h) => (h.rooms?.length || 0) > 0),
)

const homeFaqs = computed(() => faqs.value || [])
const faqOpen = ref(false)
const openFaqId = ref<string | null>(null)

function toggleFaqSection() {
  faqOpen.value = !faqOpen.value
  if (!faqOpen.value) openFaqId.value = null
}

function toggleFaq(id: string) {
  openFaqId.value = openFaqId.value === id ? null : id
}

useSeoMeta({
  title: 'Hello Group',
  description: () => t('home.sub'),
})
</script>

<template>
  <div class="bg-paper">
    <HeroVideo />

    <section id="casas" class="section-pad !py-14 md:!py-20">
      <div class="page-shell">
        <header class="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p class="eyebrow text-accent">Hello Group</p>
        </header>

        <div v-if="apartmentHomes.length" class="mt-8 md:mt-10">
          <header class="mx-auto mb-6 max-w-2xl text-center md:mb-8">
            <h3 class="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              {{ t('home.groupApartments') }}
            </h3>
            <p class="mt-3 text-base leading-relaxed text-mute md:text-lg">
              {{ t('home.groupApartmentsSub') }}
            </p>
          </header>
          <div class="grid grid-cols-3 gap-2 sm:gap-3 md:gap-6">
            <HouseCard
              v-for="(house, i) in apartmentHomes"
              :key="`apt-${house.id}`"
              :house="house"
              :index="i"
            />
          </div>
        </div>

        <div v-if="roomHomes.length" class="mt-12 md:mt-16">
          <header class="mx-auto mb-6 max-w-2xl text-center md:mb-8">
            <h3 class="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              {{ t('home.groupRooms') }}
            </h3>
            <p class="mt-3 text-base leading-relaxed text-mute md:text-lg">
              {{ t('home.groupRoomsSub') }}
            </p>
          </header>
          <div class="grid grid-cols-3 gap-2 sm:gap-3 md:gap-6">
            <HouseCard
              v-for="(house, i) in roomHomes"
              :key="`room-${house.id}`"
              :house="house"
              :index="i"
            />
          </div>
        </div>

        <div class="mt-10 flex justify-center">
          <NuxtLink :to="localePath('/casas')" class="btn-primary">
            {{ t('home.ctaHomes') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <HomeMission />

    <HomeMoments />

    <section class="px-4 pb-8 md:px-8 md:pb-12">
      <div class="page-shell overflow-hidden rounded-[2rem] bg-ink text-mist shadow-soft md:rounded-[2.5rem]">
        <div class="grid gap-8 px-6 py-14 md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-12 md:px-10 md:pt-20 md:pb-12">
          <div>
            <p class="eyebrow text-accent-soft">{{ t('nav.about') }}</p>
            <h2 class="mt-3 font-display text-3xl font-bold tracking-tight md:text-5xl md:leading-[1.08]">
              {{ t('home.aboutBandTitle') }}
            </h2>
            <p class="mt-4 max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
              {{ t('about.lead') }}
            </p>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row md:justify-end">
            <NuxtLink
              :to="localePath('/nosotros')"
              class="btn-ghost border-white/25 text-center"
            >
              {{ t('home.aboutBandCta') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath({ path: '/contacto', query: { reserva: '1' } })"
              class="btn-primary text-center"
            >
              {{ t('nav.book') }}
            </NuxtLink>
          </div>
        </div>

        <div
          v-if="homeFaqs.length"
          id="faq"
          class="border-t border-white/10 px-6 pb-10 md:px-10 md:pb-14"
        >
          <button
            type="button"
            class="flex w-full items-start justify-between gap-4 py-5 text-left md:items-center"
            :aria-expanded="faqOpen"
            @click="toggleFaqSection"
          >
            <span class="min-w-0 pr-2">
              <span class="block font-display text-lg font-bold tracking-tight text-mist md:text-xl">
                {{ t('home.faqTitle') }}
              </span>
              <span class="mt-1 block text-sm leading-snug text-white/55">
                {{ t('home.faqSub') }}
              </span>
            </span>
            <span
              class="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 text-mist transition md:mt-0"
              :class="faqOpen && 'rotate-45 border-accent bg-accent text-white'"
              aria-hidden="true"
            >
              +
            </span>
          </button>

          <ul
            v-show="faqOpen"
            class="divide-y divide-white/10 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5"
          >
            <li v-for="item in homeFaqs" :key="item.id" class="px-4">
              <button
                type="button"
                class="flex w-full items-start justify-between gap-4 py-4 text-left md:items-center"
                :aria-expanded="openFaqId === item.id"
                @click="toggleFaq(item.id)"
              >
                <span class="min-w-0 font-display text-[0.95rem] font-semibold leading-snug tracking-tight text-mist md:text-sm">
                  {{ item.title }}
                </span>
                <span
                  class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center text-accent-soft transition md:mt-0"
                  :class="openFaqId === item.id && 'rotate-45'"
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              <div
                v-show="openFaqId === item.id"
                class="pb-4 pr-2 text-sm leading-relaxed text-white/60 whitespace-pre-line md:pr-8"
              >
                {{ item.message }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
