<script setup lang="ts">
import type { Faq } from '~/types/faq'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const { t } = useI18n()
const { fetchRawFaqs, togglePublished, deleteFaq, error, hasInsforgeConfig } = useFaqs()

const { data: faqs, refresh, pending } = await useAsyncData('admin-faqs', () => fetchRawFaqs())

const copiedId = ref<string | null>(null)
const busyId = ref<string | null>(null)

async function onToggle(faq: Faq) {
  busyId.value = faq.id
  const updated = await togglePublished(faq)
  busyId.value = null
  if (updated) await refresh()
}

async function onDelete(faq: Faq) {
  if (!confirm(`¿Eliminar «${faq.title_es}»?`)) return
  busyId.value = faq.id
  const ok = await deleteFaq(faq.id)
  busyId.value = null
  if (ok) await refresh()
}

async function copyMessage(faq: Faq) {
  try {
    await navigator.clipboard.writeText(faq.message_es)
    copiedId.value = faq.id
    setTimeout(() => {
      if (copiedId.value === faq.id) copiedId.value = null
    }, 1600)
  }
  catch {
    // ignore
  }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-mute">Hello Group</p>
        <h1 class="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
          {{ t('admin.faq') }}
        </h1>
        <p class="mt-2 max-w-xl text-sm text-mute">
          {{ t('admin.faqSub') }}
        </p>
      </div>
      <NuxtLink
        to="/admin/faq/nueva"
        class="bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-black"
      >
        {{ t('admin.newFaq') }}
      </NuxtLink>
    </div>

    <p
      class="mt-5 border px-4 py-3 text-sm"
      :class="hasInsforgeConfig()
        ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
        : 'border-amber-200 bg-amber-50 text-amber-950'"
    >
      <template v-if="hasInsforgeConfig()">
        InsForge conectado · los cambios se reflejan en /faq.
      </template>
      <template v-else>
        Falta configurar InsForge; se muestran datos locales de respaldo.
      </template>
    </p>

    <p v-if="error" class="mt-3 text-sm text-red-700">{{ error }}</p>

    <div class="mt-6 flex items-center justify-between gap-3">
      <p class="text-sm text-mute">
        {{ faqs?.length || 0 }} respuestas
      </p>
      <button
        type="button"
        class="text-sm text-mute hover:text-ink"
        :disabled="pending"
        @click="refresh()"
      >
        Actualizar
      </button>
    </div>

    <ul class="mt-4 space-y-3">
      <li
        v-for="faq in faqs"
        :key="faq.id"
        class="border border-line bg-white p-4"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="font-display text-lg font-semibold text-ink">
                {{ faq.title_es }}
              </h2>
              <span
                class="text-[11px] uppercase tracking-wider"
                :class="faq.published ? 'text-emerald-700' : 'text-mute'"
              >
                {{ faq.published ? t('admin.published') : 'Borrador' }}
              </span>
            </div>
            <p class="mt-1 text-xs text-mute">
              /{{ faq.slug }} · orden {{ faq.sort_order }}
            </p>
            <div v-if="faq.shortcuts.length" class="mt-2 flex flex-wrap gap-1.5">
              <span
                v-for="shortcut in faq.shortcuts"
                :key="shortcut"
                class="border border-line bg-paper px-2 py-0.5 text-xs text-mute"
              >
                {{ shortcut }}
              </span>
            </div>
            <p class="mt-3 line-clamp-2 text-sm leading-relaxed text-mute whitespace-pre-line">
              {{ faq.message_es }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="border border-line px-3 py-1.5 text-xs hover:border-ink"
              :disabled="busyId === faq.id"
              @click="copyMessage(faq)"
            >
              {{ copiedId === faq.id ? t('admin.copied') : t('admin.copyMessage') }}
            </button>
            <button
              type="button"
              class="border border-line px-3 py-1.5 text-xs hover:border-ink"
              :disabled="busyId === faq.id"
              @click="onToggle(faq)"
            >
              {{ faq.published ? 'Despublicar' : 'Publicar' }}
            </button>
            <NuxtLink
              :to="`/admin/faq/${faq.id}`"
              class="border border-line px-3 py-1.5 text-xs hover:border-ink"
            >
              Editar
            </NuxtLink>
            <button
              type="button"
              class="border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:border-red-700"
              :disabled="busyId === faq.id"
              @click="onDelete(faq)"
            >
              {{ t('admin.delete') }}
            </button>
          </div>
        </div>
      </li>
    </ul>

    <p v-if="!pending && !faqs?.length" class="mt-8 text-sm text-mute">
      No hay FAQ todavía.
      <NuxtLink to="/admin/faq/nueva" class="underline">Crear la primera</NuxtLink>
    </p>
  </div>
</template>
