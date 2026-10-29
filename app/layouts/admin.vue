<script setup lang="ts">
const { t } = useI18n()
const user = useSupabaseUser()
const client = useSupabaseClient()

async function signOut() {
  await client.auth.signOut()
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-[#f0f2f1] text-slate-ink">
    <header class="border-b border-fog bg-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <div class="flex items-center gap-6">
          <NuxtLink to="/admin" class="font-display text-lg font-semibold text-moss">
            Hello Group · Admin
          </NuxtLink>
          <nav v-if="user" class="hidden gap-4 text-sm sm:flex">
            <NuxtLink to="/admin" class="hover:text-moss">{{ t('admin.dashboard') }}</NuxtLink>
            <NuxtLink to="/admin/casas" class="hover:text-moss">{{ t('admin.houses') }}</NuxtLink>
            <NuxtLink to="/admin/consultas" class="hover:text-moss">{{ t('admin.inquiries') }}</NuxtLink>
          </nav>
        </div>
        <div class="flex items-center gap-3 text-sm">
          <NuxtLink to="/" class="text-slate-muted hover:text-moss">← Web</NuxtLink>
          <button
            v-if="user"
            type="button"
            class="rounded-sm border border-fog px-3 py-1.5 hover:border-moss"
            @click="signOut"
          >
            {{ t('admin.signOut') }}
          </button>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-5 py-8">
      <slot />
    </main>
  </div>
</template>
