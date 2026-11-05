<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { t } = useI18n()
const { signIn, signUp, ensureSession, user, loading, error } = useAdminAuth()

const mode = ref<'signin' | 'signup'>('signin')
const email = ref('')
const password = ref('')
const name = ref('')

await ensureSession()
if (user.value) {
  await navigateTo('/admin')
}

async function submit() {
  const ok = mode.value === 'signin'
    ? await signIn(email.value.trim(), password.value)
    : await signUp(email.value.trim(), password.value, name.value.trim() || undefined)
  if (ok) await navigateTo('/admin')
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <h1 class="font-display text-3xl font-semibold text-ink">{{ t('admin.login') }}</h1>
    <p class="mt-2 text-sm text-mute">
      Gestiona las 5 casas, textos y fotos con InsForge.
    </p>

    <form class="mt-8 space-y-4 border border-line bg-white p-6" @submit.prevent="submit">
      <div v-if="mode === 'signup'">
        <label class="block text-sm text-mute" for="admin-name">Nombre</label>
        <input
          id="admin-name"
          v-model="name"
          type="text"
          class="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
          autocomplete="name"
        >
      </div>
      <div>
        <label class="block text-sm text-mute" for="admin-email">{{ t('admin.email') }}</label>
        <input
          id="admin-email"
          v-model="email"
          type="email"
          required
          class="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
          autocomplete="email"
        >
      </div>
      <div>
        <label class="block text-sm text-mute" for="admin-password">{{ t('admin.password') }}</label>
        <input
          id="admin-password"
          v-model="password"
          type="password"
          required
          minlength="6"
          class="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
          autocomplete="current-password"
        >
      </div>

      <p v-if="error" class="text-sm text-red-700">{{ error }}</p>

      <button
        type="submit"
        class="w-full bg-ink px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        :disabled="loading"
      >
        {{ loading ? t('common.loading') : (mode === 'signin' ? t('admin.signIn') : 'Crear cuenta') }}
      </button>

      <button
        type="button"
        class="w-full text-sm text-mute hover:text-ink"
        @click="mode = mode === 'signin' ? 'signup' : 'signin'"
      >
        {{ mode === 'signin' ? '¿Primera vez? Crear cuenta admin' : 'Ya tengo cuenta — Entrar' }}
      </button>
    </form>
  </div>
</template>
