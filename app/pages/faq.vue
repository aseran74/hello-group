<script setup lang="ts">
const { t } = useI18n()
const { fetchFaqs } = useFaqs()

const { data: faqs } = await useAsyncData('public-faqs', () => fetchFaqs({ publishedOnly: true }))

const openId = ref<string | null>(null)

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
}

useSeoMeta({
  title: () => `${t('faq.title')} · Hello Group`,
  description: () => t('faq.subtitle'),
})
</script>

<template>
  <div class="section-pad pt-28 md:pt-32">
    <div class="page-shell max-w-3xl">
      <header>
        <p class="eyebrow">Hello Group</p>
        <h1 class="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          {{ t('faq.title') }}
        </h1>
        <p class="mt-4 text-base leading-relaxed text-mute">
          {{ t('faq.subtitle') }}
        </p>
      </header>

      <div v-if="!faqs?.length" class="mt-10 text-mute">
        {{ t('faq.empty') }}
      </div>

      <ul v-else class="mt-8 divide-y divide-line border-y border-line">
        <li v-for="item in faqs" :key="item.id" class="py-1">
          <button
            type="button"
            class="flex w-full items-start justify-between gap-4 py-3.5 text-left transition hover:text-black md:items-center md:py-3.5"
            :aria-expanded="openId === item.id"
            @click="toggle(item.id)"
          >
            <span class="min-w-0 font-display text-[0.9375rem] font-semibold leading-snug tracking-tight text-ink md:text-base">
              {{ item.title }}
            </span>
            <span
              class="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-mute transition md:mt-0 md:h-6 md:w-6 md:border-0"
              :class="openId === item.id && 'rotate-45'"
              aria-hidden="true"
            >
              +
            </span>
          </button>
          <div
            v-show="openId === item.id"
            class="pb-4 pr-2 text-sm leading-relaxed text-mute whitespace-pre-line md:pr-8"
          >
            {{ item.message }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
