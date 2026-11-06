<script setup lang="ts">
const { t } = useI18n()
const { fetchFaqs } = useFaqs()

const { data: faqs } = await useAsyncData('public-faqs', () => fetchFaqs({ publishedOnly: true }))

const openId = ref<string | null>(null)

watchEffect(() => {
  if (!openId.value && faqs.value?.length) {
    openId.value = faqs.value[0].id
  }
})

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
        <h1 class="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-6xl">
          {{ t('faq.title') }}
        </h1>
        <p class="mt-5 text-lg leading-relaxed text-mute">
          {{ t('faq.subtitle') }}
        </p>
      </header>

      <div v-if="!faqs?.length" class="mt-12 text-mute">
        {{ t('faq.empty') }}
      </div>

      <ul v-else class="mt-12 divide-y divide-line border-y border-line">
        <li v-for="item in faqs" :key="item.id">
          <button
            type="button"
            class="flex w-full items-start justify-between gap-4 py-5 text-left transition hover:text-black"
            :aria-expanded="openId === item.id"
            @click="toggle(item.id)"
          >
            <span class="font-display text-lg font-semibold tracking-tight text-ink md:text-xl">
              {{ item.title }}
            </span>
            <span
              class="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center text-mute transition"
              :class="openId === item.id && 'rotate-45'"
              aria-hidden="true"
            >
              +
            </span>
          </button>
          <div
            v-show="openId === item.id"
            class="pb-6 pr-10 text-base leading-relaxed text-mute whitespace-pre-line"
          >
            {{ item.message }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
