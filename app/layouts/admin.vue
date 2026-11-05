<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const { user, signOut } = useAdminAuth()
const isLogin = computed(() => route.path.includes('/admin/login'))

function navClass(kind: 'dashboard' | 'casas' | 'consultas') {
  const path = route.path
  const active =
    kind === 'dashboard'
      ? /\/admin\/?$/.test(path)
      : path.includes(`/admin/${kind}`)
  return active ? 'text-ink font-medium' : 'text-mute hover:text-ink'
}
</script>

<template>
  <div class="min-h-screen bg-[#eef0ee] text-ink">
    <header class="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <div class="flex items-center gap-6">
          <NuxtLink to="/admin" class="font-display text-lg font-semibold tracking-tight text-ink">
            Hello Group · Admin
          </NuxtLink>
          <nav v-if="!isLogin && user" class="hidden gap-5 text-sm sm:flex">
            <NuxtLink to="/admin" :class="navClass('dashboard')">{{ t('admin.dashboard') }}</NuxtLink>
            <NuxtLink to="/admin/casas" :class="navClass('casas')">{{ t('admin.houses') }}</NuxtLink>
            <NuxtLink to="/admin/consultas" :class="navClass('consultas')">{{ t('admin.inquiries') }}</NuxtLink>
          </nav>
        </div>
        <div class="flex items-center gap-4 text-sm">
          <span v-if="user?.email" class="hidden max-w-[12rem] truncate text-mute sm:inline">{{ user.email }}</span>
          <button
            v-if="user && !isLogin"
            type="button"
            class="text-mute hover:text-ink"
            @click="signOut"
          >
            {{ t('admin.signOut') }}
          </button>
          <NuxtLink to="/" class="text-mute hover:text-ink">← Web</NuxtLink>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-5 py-8">
      <slot />
    </main>
  </div>
</template>
