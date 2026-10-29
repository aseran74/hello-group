<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen bg-[#f0f2f1] text-ink">
    <header class="border-b border-line bg-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <div class="flex items-center gap-6">
          <NuxtLink to="/admin" class="font-display text-lg font-semibold text-ink">
            Hello Group · Admin
          </NuxtLink>
          <nav class="hidden gap-4 text-sm sm:flex">
            <NuxtLink to="/admin" class="hover:text-mute">{{ t('admin.dashboard') }}</NuxtLink>
            <NuxtLink to="/admin/casas" class="hover:text-mute">{{ t('admin.houses') }}</NuxtLink>
            <NuxtLink to="/admin/consultas" class="hover:text-mute">{{ t('admin.inquiries') }}</NuxtLink>
          </nav>
        </div>
        <NuxtLink to="/" class="text-sm text-mute hover:text-ink">← Web</NuxtLink>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-5 py-8">
      <slot />
    </main>
  </div>
</template>
