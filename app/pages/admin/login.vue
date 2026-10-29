<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const { t } = useI18n()
const client = useSupabaseClient()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function signIn() {
  loading.value = true
  error.value = ''
  const { error: authError } = await client.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  loading.value = false
  if (authError) {
    error.value = authError.message
    return
  }
  await navigateTo('/admin')
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <h1 class="font-display text-3xl font-semibold text-moss">{{ t('admin.login') }}</h1>
    <form class="mt-8 space-y-4" @submit.prevent="signIn">
      <div>
        <label class="label" for="admin-email">{{ t('admin.email') }}</label>
        <input id="admin-email" v-model="email" type="email" class="field" required autocomplete="username">
      </div>
      <div>
        <label class="label" for="admin-password">{{ t('admin.password') }}</label>
        <input id="admin-password" v-model="password" type="password" class="field" required autocomplete="current-password">
      </div>
      <p v-if="error" class="text-sm text-red-700">{{ error }}</p>
      <button type="submit" class="btn-primary w-full" :disabled="loading">
        {{ t('admin.signIn') }}
      </button>
    </form>
  </div>
</template>
