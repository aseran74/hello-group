<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { fetchHouses } = useHouses()
const { fetchFaqs } = useFaqs()

const { data: houses } = await useAsyncData('home-houses', () => fetchHouses())
const { data: faqs } = await useAsyncData('home-faqs', () => fetchFaqs({ publishedOnly: true }))

const madridHomes = computed(() =>
  (houses.value || []).filter((h) => h.slug !== 'astur'),
)
const asturiasHomes = computed(() =>
  (houses.value || []).filter((h) => h.slug === 'astur'),
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
  <div>
    <HeroVideo />

    <section id="casas" class="section-pad !py-16 md:!py-20">
      <div class="page-shell">
        <header class="mx-auto max-w-xl text-center">
          <h2 class="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {{ t('home.previewTitle') }}
          </h2>
          <p class="mt-3 text-base leading-relaxed text-mute">
            {{ t('home.previewSub') }}
          </p>
        </header>

        <div class="mt-10 space-y-12 md:mt-12 md:space-y-14">
          <div>
            <header class="mb-5 border-b border-line pb-3 md:mb-6">
              <p class="eyebrow text-mute">Hello Group</p>
              <h3 class="mt-1 font-display text-xl font-bold tracking-tight text-ink md:text-2xl">
                {{ t('home.groupMadrid') }}
              </h3>
            </header>
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 md:gap-4">
              <HouseCard
                v-for="(house, i) in madridHomes"
                :key="house.id"
                :house="house"
                :index="i"
              />
            </div>
          </div>

          <div>
            <header class="mb-5 border-b border-line pb-3 md:mb-6">
              <p class="eyebrow text-mute">Hello Group</p>
              <h3 class="mt-1 font-display text-xl font-bold tracking-tight text-ink md:text-2xl">
                {{ t('home.groupAsturias') }}
              </h3>
            </header>
            <div class="grid gap-3 md:gap-4">
              <HouseCard
                v-for="(house, i) in asturiasHomes"
                :key="house.id"
                :house="house"
                :index="i"
                wide
                carousel
              />
            </div>
          </div>
        </div>

        <div class="mt-10 flex justify-center">
          <NuxtLink :to="localePath('/casas')" class="btn-secondary">
            {{ t('home.ctaHomes') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <section v-if="homeFaqs.length" id="faq" class="border-y border-line bg-paper">
      <div class="page-shell max-w-3xl px-5 py-1 md:px-8">
        <button
          type="button"
          class="flex w-full items-start justify-between gap-4 py-4 text-left md:items-center md:py-3.5"
          :aria-expanded="faqOpen"
          @click="toggleFaqSection"
        >
          <span class="min-w-0 pr-2">
            <span class="block font-display text-base font-semibold tracking-tight text-ink md:text-lg">
              {{ t('home.faqTitle') }}
            </span>
            <span class="mt-1 block text-sm leading-snug text-mute">
              {{ t('home.faqSub') }}
            </span>
          </span>
          <span
            class="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-mute transition md:mt-0"
            :class="faqOpen && 'rotate-45'"
            aria-hidden="true"
          >
            +
          </span>
        </button>

        <ul
          v-show="faqOpen"
          class="mb-3 divide-y divide-line border-t border-line md:mb-2"
        >
          <li v-for="item in homeFaqs" :key="item.id" class="py-1">
            <button
              type="button"
              class="flex w-full items-start justify-between gap-4 py-3.5 text-left md:items-center md:py-3"
              :aria-expanded="openFaqId === item.id"
              @click="toggleFaq(item.id)"
            >
              <span class="min-w-0 font-display text-[0.9375rem] font-semibold leading-snug tracking-tight text-ink md:text-sm">
                {{ item.title }}
              </span>
              <span
                class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center text-mute transition md:mt-0"
                :class="openFaqId === item.id && 'rotate-45'"
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              v-show="openFaqId === item.id"
              class="pb-4 pr-2 text-sm leading-relaxed text-mute whitespace-pre-line md:pr-8"
            >
              {{ item.message }}
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="bg-ink text-mist">
      <div class="page-shell grid gap-8 px-5 py-14 md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-12 md:px-8 md:py-20">
        <div>
          <p class="eyebrow text-white/45">{{ t('nav.about') }}</p>
          <h2 class="mt-3 font-display text-2xl font-bold tracking-tight md:text-4xl">
            {{ t('home.aboutBandTitle') }}
          </h2>
          <p class="mt-4 max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
            {{ t('about.lead') }}
          </p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row md:flex-col md:items-stretch lg:flex-row">
          <NuxtLink
            :to="localePath('/nosotros')"
            class="btn-ghost border-white/25 text-center"
          >
            {{ t('home.aboutBandCta') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath({ path: '/contacto', query: { reserva: '1' } })"
            class="btn-primary bg-white text-center text-ink hover:bg-mist"
          >
            {{ t('nav.book') }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
