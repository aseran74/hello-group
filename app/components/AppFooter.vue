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
      <nav class="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/75">
        <NuxtLink :to="localePath('/casas')" class="transition hover:text-white">{{ t('nav.homes') }}</NuxtLink>
        <NuxtLink :to="localePath('/nosotros')" class="transition hover:text-white">{{ t('nav.about') }}</NuxtLink>
        <NuxtLink :to="localePath('/contacto')" class="transition hover:text-white">{{ t('nav.contact') }}</NuxtLink>
        <NuxtLink
          :to="localePath({ path: '/contacto', query: { reserva: '1' } })"
          class="transition hover:text-white"
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
