<script setup lang="ts">
const { t } = useI18n()
const { fetchHouses } = useHouses()

const { data: houses } = await useAsyncData('houses-list', () => fetchHouses())

const topRow = computed(() => houses.value?.slice(0, 2) || [])
const bottomRow = computed(() => houses.value?.slice(2) || [])

useSeoMeta({
  title: () => `${t('homes.title')} · Hello Group`,
  description: () => t('homes.subtitle'),
})
</script>

<template>
  <div class="section-pad pt-28 md:pt-32">
    <div class="page-shell">
      <header class="max-w-2xl">
        <p class="eyebrow">Hello Group</p>
        <h1 class="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          {{ t('homes.title') }}
        </h1>
        <p class="mt-4 text-base leading-relaxed text-mute md:text-lg">{{ t('homes.subtitle') }}</p>
      </header>

      <div class="mt-10 space-y-3 md:space-y-4">
        <div class="grid gap-3 md:grid-cols-2 md:gap-4">
          <HouseCard
            v-for="(house, i) in topRow"
            :key="house.id"
            :house="house"
            :index="i"
          />
        </div>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
          <HouseCard
            v-for="(house, i) in bottomRow"
            :key="house.id"
            :house="house"
            :index="i + 2"
          />
        </div>
      </div>
    </div>
  </div>
</template>
