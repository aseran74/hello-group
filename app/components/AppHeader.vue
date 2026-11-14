<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const { fetchHouses } = useHouses()

const open = ref(false)
const moreOpen = ref(false)
const scrolled = ref(false)
const moreRef = ref<HTMLElement | null>(null)

const { data: houses } = await useAsyncData('nav-houses', () => fetchHouses())

const houseLinks = computed(() =>
  (houses.value || []).map((h) => ({
    to: localePath(`/casas/${h.slug}`),
    label: h.name,
  })),
)

const secondaryLinks = computed(() => [
  { to: localePath('/faq'), label: t('nav.faq') },
  { to: localePath('/blog'), label: t('nav.blog') },
  { to: localePath('/contacto'), label: t('nav.contact') },
])

const secondaryActive = computed(() =>
  secondaryLinks.value.some((link) => route.path === link.to || route.path.startsWith(`${link.to}/`)),
)

watch(() => route.fullPath, () => {
  open.value = false
  moreOpen.value = false
})

function onScroll() {
  scrolled.value = window.scrollY > 20
}

function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  if (moreOpen.value) moreOpen.value = false
  if (open.value) open.value = false
}

function onPointerDown(e: PointerEvent) {
  if (!moreOpen.value || !moreRef.value) return
  if (!moreRef.value.contains(e.target as Node)) moreOpen.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('pointerdown', onPointerDown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('pointerdown', onPointerDown)
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

      <nav class="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1" aria-label="Principal">
        <NuxtLink
          v-for="house in houseLinks"
          :key="house.to"
          :to="house.to"
          class="max-w-[7.5rem] truncate rounded-full px-2 py-2 text-[13px] font-medium text-white/85 transition duration-200 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white xl:max-w-none xl:px-2.5"
        >
          {{ house.label }}
        </NuxtLink>

        <span class="mx-1 hidden h-4 w-px bg-white/20 xl:block" aria-hidden="true" />

        <div ref="moreRef" class="relative">
          <button
            type="button"
            class="inline-flex min-h-9 items-center gap-1 rounded-full px-2.5 py-2 text-[13px] font-medium text-white/85 transition duration-200 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white xl:px-3"
            :class="(moreOpen || secondaryActive) && 'bg-white/10 text-white'"
            :aria-expanded="moreOpen"
            aria-haspopup="menu"
            aria-controls="nav-more-menu"
            @click="moreOpen = !moreOpen"
          >
            {{ t('nav.more') }}
            <svg
              class="size-3.5 opacity-80 motion-safe:transition-transform"
              :class="moreOpen && 'rotate-180'"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd" />
            </svg>
          </button>

          <div
            id="nav-more-menu"
            role="menu"
            class="absolute left-1/2 top-full z-50 mt-2 min-w-[11rem] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/15 bg-black/75 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            :class="moreOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'"
            :aria-hidden="!moreOpen"
          >
            <NuxtLink
              v-for="link in secondaryLinks"
              :key="link.to"
              :to="link.to"
              role="menuitem"
              class="flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-medium text-white/85 transition duration-200 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              @click="moreOpen = false"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>

        <NuxtLink
          :to="localePath({ path: '/contacto', query: { reserva: '1' } })"
          class="min-h-9 inline-flex items-center rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(255,107,53,0.35)] transition duration-200 hover:bg-accent-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {{ t('nav.book') }}
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-1 lg:ml-0">
        <NuxtLink
          :to="localePath({ path: '/contacto', query: { reserva: '1' } })"
          class="inline-flex min-h-11 items-center rounded-full bg-accent px-3.5 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-accent-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
        >
          {{ t('nav.book') }}
        </NuxtLink>

        <div
          class="hidden items-center gap-0.5 text-[11px] font-semibold uppercase tracking-wider text-white/70 lg:flex"
          role="group"
          aria-label="Idioma"
        >
          <NuxtLink
            :to="switchLocalePath('es')"
            class="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full px-2 py-1 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            :class="locale === 'es' ? 'bg-white/15 text-white' : 'hover:text-white'"
            :aria-current="locale === 'es' ? 'true' : undefined"
          >
            ES
          </NuxtLink>
          <NuxtLink
            :to="switchLocalePath('en')"
            class="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full px-2 py-1 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            :class="locale === 'en' ? 'bg-white/15 text-white' : 'hover:text-white'"
            :aria-current="locale === 'en' ? 'true' : undefined"
          >
            EN
          </NuxtLink>
        </div>

        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          aria-haspopup="true"
          @click="open = !open"
        >
          <span class="sr-only">{{ t('nav.menu') }}</span>
          <span class="flex flex-col gap-1.5" aria-hidden="true">
            <span class="block h-0.5 w-4 bg-current motion-safe:transition" :class="open && 'translate-y-[7px] rotate-45'" />
            <span class="block h-0.5 w-4 bg-current motion-safe:transition" :class="open && 'opacity-0'" />
            <span class="block h-0.5 w-4 bg-current motion-safe:transition" :class="open && '-translate-y-[7px] -rotate-45'" />
          </span>
        </button>
      </div>
    </div>

    <div
      id="mobile-nav"
      class="pointer-events-auto mx-auto mt-2 max-w-content overflow-hidden motion-safe:transition-all motion-safe:duration-300 lg:hidden"
      :class="open ? 'max-h-[42rem] opacity-100' : 'max-h-0 opacity-0'"
      :aria-hidden="!open"
    >
      <nav
        class="rounded-[1.75rem] border p-4 text-white shadow-xl backdrop-blur-xl transition-[background-color,border-color] duration-300"
        :class="scrolled ? 'border-white/20 bg-black/55' : 'border-white/15 bg-black/35'"
        aria-label="Móvil"
      >
        <div class="flex flex-col gap-0.5">
          <NuxtLink
            v-for="house in houseLinks"
            :key="house.to"
            :to="house.to"
            class="min-h-11 rounded-full px-3 py-2.5 text-sm font-medium transition duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            @click="open = false"
          >
            {{ house.label }}
          </NuxtLink>
        </div>
        <div class="mt-3 border-t border-white/10 pt-3">
          <p class="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/45">
            {{ t('nav.more') }}
          </p>
          <div class="flex flex-col gap-1">
            <NuxtLink
              v-for="link in secondaryLinks"
              :key="link.to"
              :to="link.to"
              class="min-h-11 rounded-full px-3 py-2.5 text-sm font-medium transition duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              @click="open = false"
            >
              {{ link.label }}
            </NuxtLink>
            <NuxtLink
              :to="localePath({ path: '/contacto', query: { reserva: '1' } })"
              class="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-3 py-2.5 text-center text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              @click="open = false"
            >
              {{ t('nav.book') }}
            </NuxtLink>
          </div>
        </div>
        <div
          class="mt-3 flex gap-2 border-t border-white/10 px-2 pt-3 text-xs font-semibold uppercase tracking-wider text-white/80"
          role="group"
          aria-label="Idioma"
        >
          <NuxtLink
            :to="switchLocalePath('es')"
            class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            :aria-current="locale === 'es' ? 'true' : undefined"
            @click="open = false"
          >
            ES
          </NuxtLink>
          <NuxtLink
            :to="switchLocalePath('en')"
            class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            :aria-current="locale === 'en' ? 'true' : undefined"
            @click="open = false"
          >
            EN
          </NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>
