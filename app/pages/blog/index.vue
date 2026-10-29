<script setup lang="ts">
const { t, tm, locale } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => `${t('blog.title')} · Hello Group`,
  description: () => t('blog.lead'),
})

type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
}

const posts = computed(() => tm('blog.posts') as BlogPost[])

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
  <div>
    <section class="section-pad pt-28 md:pt-32">
      <div class="page-shell max-w-3xl">
        <p class="eyebrow">Hello Group</p>
        <h1 class="mt-3 font-display text-5xl font-bold tracking-tight text-ink md:text-7xl">
          {{ t('blog.title') }}
        </h1>
        <p class="mt-6 max-w-2xl text-xl leading-relaxed text-mute">
          {{ t('blog.lead') }}
        </p>
      </div>
    </section>

    <section class="border-t border-line bg-paper-elevated">
      <div class="page-shell section-pad">
        <ul class="mx-auto max-w-3xl divide-y divide-line">
          <li v-for="post in posts" :key="post.slug" class="py-8 first:pt-0 last:pb-0">
            <NuxtLink
              :to="localePath(`/blog/${post.slug}`)"
              class="group block transition"
            >
              <time class="text-xs font-semibold uppercase tracking-wider text-mute" :datetime="post.date">
                {{ formatDate(post.date) }}
              </time>
              <h2 class="mt-2 font-display text-2xl font-bold tracking-tight text-ink transition group-hover:opacity-70 md:text-3xl">
                {{ post.title }}
              </h2>
              <p class="mt-3 text-mute leading-relaxed">
                {{ post.excerpt }}
              </p>
              <span class="mt-4 inline-block text-sm font-semibold text-ink underline-offset-4 group-hover:underline">
                {{ t('blog.readMore') }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
