<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-ink text-mist">
    <div class="page-shell flex flex-col gap-10 px-5 py-16 md:flex-row md:items-end md:justify-between md:px-8 md:py-20">
      <div>
        <BrandLogo size="lg" tone="light" />
        <p class="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
          {{ t('footer.tagline') }}
        </p>
      </div>
      <nav
        class="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-white/75"
        aria-label="Pie de página"
      >
        <NuxtLink
          :to="localePath('/casas')"
          class="inline-flex min-h-11 items-center rounded-full px-2 transition duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {{ t('nav.homes') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/caracteristicas')"
          class="inline-flex min-h-11 items-center rounded-full px-2 transition duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {{ t('nav.features') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/faq')"
          class="inline-flex min-h-11 items-center rounded-full px-2 transition duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {{ t('nav.faq') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/blog')"
          class="inline-flex min-h-11 items-center rounded-full px-2 transition duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {{ t('nav.blog') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/nosotros')"
          class="inline-flex min-h-11 items-center rounded-full px-2 transition duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {{ t('nav.about') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/contacto')"
          class="inline-flex min-h-11 items-center rounded-full px-2 transition duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {{ t('nav.contact') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath({ path: '/contacto', query: { reserva: '1' } })"
          class="inline-flex min-h-11 items-center rounded-full px-2 font-semibold text-accent-soft transition duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {{ t('nav.book') }}
        </NuxtLink>
      </nav>
    </div>
    <div class="border-t border-white/10 px-5 py-4 text-center text-xs text-white/40 md:px-8">
      © {{ year }} Hello Group. {{ t('footer.rights') }}
    </div>
  </footer>
</template>
