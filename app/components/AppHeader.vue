<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const { fetchHouses } = useHouses()

const open = ref(false)
const scrolled = ref(false)

const { data: houses } = await useAsyncData('nav-houses', () => fetchHouses())

const houseLinks = computed(() =>
  (houses.value || []).map((h) => ({
    to: localePath(`/casas/${h.slug}`),
    label: h.name,
  })),
)

const secondaryLinks = computed(() => [
  { to: localePath('/caracteristicas'), label: t('nav.features') },
  { to: localePath('/blog'), label: t('nav.blog') },
  { to: localePath('/contacto'), label: t('nav.contact') },
])

watch(() => route.fullPath, () => {
  open.value = false
})

function onScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
    <div
      class="pointer-events-auto mx-auto flex max-w-content items-center gap-2 rounded-full border px-2.5 py-2 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 md:gap-3 md:px-4 md:py-2.5"
      :class="
        scrolled
          ? 'border-white/20 bg-black/40 shadow-[0_12px_48px_rgba(0,0,0,0.35)] backdrop-blur-2xl'
          : 'border-white/10 bg-black/[0.08] shadow-none backdrop-blur-md'
      "
    >
      <NuxtLink
        :to="localePath('/')"
        class="inline-flex shrink-0 items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Hello Group"
      >
        <BrandLogo size="sm" tone="light" />
      </NuxtLink>

      <nav class="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1">
        <NuxtLink
          v-for="house in houseLinks"
          :key="house.to"
          :to="house.to"
          class="max-w-[7.5rem] truncate rounded-full px-2 py-1.5 text-[13px] font-medium text-white/85 transition hover:bg-white/10 hover:text-white xl:max-w-none xl:px-2.5"
        >
          {{ house.label }}
        </NuxtLink>

        <span class="mx-1 hidden h-4 w-px bg-white/20 xl:block" aria-hidden="true" />

        <NuxtLink
          v-for="link in secondaryLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-full px-2.5 py-1.5 text-[13px] font-medium text-white/85 transition hover:bg-white/10 hover:text-white xl:px-3"
        >
          {{ link.label }}
        </NuxtLink>
        <NuxtLink
          :to="localePath({ path: '/contacto', query: { reserva: '1' } })"
          class="rounded-full bg-white/90 px-4 py-1.5 text-[13px] font-semibold text-black transition hover:bg-white"
        >
          {{ t('nav.book') }}
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-1 lg:ml-0">
        <NuxtLink
          :to="localePath({ path: '/contacto', query: { reserva: '1' } })"
          class="rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-black transition hover:bg-white lg:hidden"
        >
          {{ t('nav.book') }}
        </NuxtLink>

        <div class="hidden items-center gap-0.5 text-[11px] font-semibold uppercase tracking-wider text-white/70 lg:flex">
          <NuxtLink
            :to="switchLocalePath('es')"
            class="rounded-full px-2 py-1 transition"
            :class="locale === 'es' ? 'bg-white/15 text-white' : 'hover:text-white'"
          >
            ES
          </NuxtLink>
          <NuxtLink
            :to="switchLocalePath('en')"
            class="rounded-full px-2 py-1 transition"
            :class="locale === 'en' ? 'bg-white/15 text-white' : 'hover:text-white'"
          >
            EN
          </NuxtLink>
        </div>

        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10 lg:hidden"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          @click="open = !open"
        >
          <span class="sr-only">{{ t('nav.menu') }}</span>
          <span class="flex flex-col gap-1.5">
            <span class="block h-0.5 w-4 bg-current transition" :class="open && 'translate-y-[7px] rotate-45'" />
            <span class="block h-0.5 w-4 bg-current transition" :class="open && 'opacity-0'" />
            <span class="block h-0.5 w-4 bg-current transition" :class="open && '-translate-y-[7px] -rotate-45'" />
          </span>
        </button>
      </div>
    </div>

    <div
      id="mobile-nav"
      class="pointer-events-auto mx-auto mt-2 max-w-content overflow-hidden transition-all duration-300 lg:hidden"
      :class="open ? 'max-h-[42rem] opacity-100' : 'max-h-0 opacity-0'"
    >
      <nav
        class="rounded-[1.75rem] border p-4 text-white shadow-xl backdrop-blur-xl transition-[background-color,border-color] duration-300"
        :class="scrolled ? 'border-white/20 bg-black/55' : 'border-white/15 bg-black/35'"
      >
        <div class="flex flex-col gap-0.5">
          <NuxtLink
            v-for="house in houseLinks"
            :key="house.to"
            :to="house.to"
            class="rounded-full px-3 py-2.5 text-sm font-medium transition hover:bg-white/10"
            @click="open = false"
          >
            {{ house.label }}
          </NuxtLink>
        </div>
        <div class="mt-3 flex flex-col gap-1 border-t border-white/10 pt-3">
          <NuxtLink
            v-for="link in secondaryLinks"
            :key="link.to"
            :to="link.to"
            class="rounded-full px-3 py-2.5 text-sm font-medium transition hover:bg-white/10"
            @click="open = false"
          >
            {{ link.label }}
          </NuxtLink>
          <NuxtLink
            :to="localePath({ path: '/contacto', query: { reserva: '1' } })"
            class="rounded-full bg-white px-3 py-2.5 text-center text-sm font-semibold text-black"
            @click="open = false"
          >
            {{ t('nav.book') }}
          </NuxtLink>
        </div>
        <div class="mt-3 flex gap-2 border-t border-white/10 px-2 pt-3 text-xs font-semibold uppercase tracking-wider text-white/80">
          <NuxtLink :to="switchLocalePath('es')" @click="open = false">ES</NuxtLink>
          <NuxtLink :to="switchLocalePath('en')" @click="open = false">EN</NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>
