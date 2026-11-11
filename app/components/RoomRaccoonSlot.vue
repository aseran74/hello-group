<script setup lang="ts">
const props = defineProps<{
  bookingUrl?: string | null
  houseName?: string
}>()

const { t } = useI18n()

const hasBooking = computed(() => Boolean(props.bookingUrl))
</script>

<template>
  <section
    id="roomraccoon-widget"
    class="rounded-[1.75rem] border border-line bg-paper p-6 md:p-7"
    :class="!hasBooking && 'border-dashed border-ink/20'"
  >
    <p class="eyebrow">RoomRaccoon</p>
    <h2 class="mt-2 font-display text-xl font-bold tracking-tight text-ink">
      {{ t('homes.bookSlot') }}
    </h2>

    <template v-if="hasBooking">
      <p class="mt-2 text-sm leading-relaxed text-mute">
        {{ t('homes.bookReady', { name: houseName || '' }) }}
      </p>
      <a
        :href="bookingUrl!"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-primary mt-5 w-full"
      >
        {{ t('nav.book') }}
      </a>
      <div class="mt-5 overflow-hidden rounded-2xl border border-line bg-paper-elevated">
        <iframe
          :src="bookingUrl!"
          :title="t('homes.bookSlot')"
          class="h-[32rem] w-full border-0 md:h-[36rem]"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        />
      </div>
    </template>

    <template v-else>
      <p class="mt-2 text-sm leading-relaxed text-mute">{{ t('homes.bookHint') }}</p>
      <div class="mt-5 min-h-24 rounded-2xl border border-line/80 bg-paper-elevated" data-roomraccoon-root />
    </template>
  </section>
</template>
