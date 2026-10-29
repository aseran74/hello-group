<script setup lang="ts">
const { t, tm, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  body: string[]
}

const posts = computed(() => tm('blog.posts') as BlogPost[])
const post = computed(() => posts.value.find((p) => p.slug === String(route.params.slug)))

watchEffect(() => {
  if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }
})

useSeoMeta({
  title: () => (post.value ? `${post.value.title} · Hello Group` : 'Hello Group'),
  description: () => post.value?.excerpt || '',
})

const dateLocale = computed(() => (locale.value === 'en' ? 'en-GB' : 'es-ES'))

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(dateLocale.value, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}
</script>

<template>
  <article v-if="post" class="section-pad pt-28 md:pt-32">
    <div class="page-shell max-w-2xl">
      <NuxtLink
        :to="localePath('/blog')"
        class="text-sm font-semibold text-mute transition hover:text-ink"
      >
        ← {{ t('blog.back') }}
      </NuxtLink>

      <time class="mt-8 block text-xs font-semibold uppercase tracking-wider text-mute" :datetime="post.date">
        {{ formatDate(post.date) }}
      </time>
      <h1 class="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
        {{ post.title }}
      </h1>
      <p class="mt-6 text-lg leading-relaxed text-mute">
        {{ post.excerpt }}
      </p>

      <div class="mt-10 space-y-5 text-base leading-relaxed text-ink md:text-lg">
        <p v-for="(paragraph, i) in post.body" :key="i">
          {{ paragraph }}
        </p>
      </div>

      <div class="mt-12 flex flex-wrap gap-3 border-t border-line pt-10">
        <NuxtLink :to="localePath('/casas')" class="btn-primary">
          {{ t('home.ctaHomes') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/blog')" class="btn-secondary">
          {{ t('blog.back') }}
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
