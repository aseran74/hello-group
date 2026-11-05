<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const { t } = useI18n()
const { saving, message, error, saveHouse, emptyHouseForm } = useHouseAdmin()
const form = reactive(emptyHouseForm())

const fieldClass = 'mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink'
const labelClass = 'block text-sm text-mute'

async function onCreate() {
  const data = await saveHouse(null, form)
  if (data?.id) {
    await navigateTo(`/admin/casas/${data.id}`)
  }
}
</script>

<template>
  <div>
    <NuxtLink to="/admin/casas" class="text-sm text-mute hover:text-ink">← {{ t('admin.back') }}</NuxtLink>
    <h1 class="mt-4 font-display text-3xl font-semibold text-ink">{{ t('admin.newHouse') }}</h1>
    <p class="mt-2 text-sm text-mute">Crea la ficha y luego sube la portada y la galería.</p>

    <p v-if="message" class="mt-4 text-sm text-emerald-800">{{ message }}</p>
    <p v-if="error" class="mt-4 text-sm text-red-700">{{ error }}</p>

    <form class="mt-8 max-w-2xl space-y-4 border border-line bg-white p-5" @submit.prevent="onCreate">
      <div class="grid gap-3 sm:grid-cols-2">
        <div>
          <label :class="labelClass">Slug</label>
          <input v-model="form.slug" :class="fieldClass" required placeholder="astur">
        </div>
        <div class="flex items-end gap-2 pb-2">
          <input id="pub" v-model="form.published" type="checkbox" class="size-4">
          <label for="pub" class="text-sm">{{ t('admin.published') }}</label>
        </div>
        <div>
          <label :class="labelClass">Nombre ES</label>
          <input v-model="form.name_es" :class="fieldClass" required>
        </div>
        <div>
          <label :class="labelClass">Nombre EN</label>
          <input v-model="form.name_en" :class="fieldClass" required>
        </div>
        <div>
          <label :class="labelClass">Ubicación ES</label>
          <input v-model="form.location_es" :class="fieldClass">
        </div>
        <div>
          <label :class="labelClass">Ubicación EN</label>
          <input v-model="form.location_en" :class="fieldClass">
        </div>
      </div>
      <div>
        <label :class="labelClass">Descripción ES</label>
        <textarea v-model="form.description_es" rows="4" :class="fieldClass" />
      </div>
      <div>
        <label :class="labelClass">Descripción EN</label>
        <textarea v-model="form.description_en" rows="4" :class="fieldClass" />
      </div>
      <button
        type="submit"
        class="bg-ink px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        :disabled="saving"
      >
        {{ saving ? t('common.loading') : 'Crear y continuar' }}
      </button>
    </form>
  </div>
</template>
