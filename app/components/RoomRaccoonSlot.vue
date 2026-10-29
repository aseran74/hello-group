<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section
    id="roomraccoon-widget"
    class="rounded-[1.75rem] border border-dashed border-ink/20 bg-paper p-6 md:p-7"
  >
    <p class="eyebrow">RoomRaccoon</p>
    <h2 class="mt-2 font-display text-xl font-bold tracking-tight text-ink">
      {{ t('homes.bookSlot') }}
    </h2>
    <p class="mt-2 text-sm leading-relaxed text-mute">{{ t('homes.bookHint') }}</p>
    <div class="mt-5 min-h-24 rounded-2xl border border-line/80 bg-paper-elevated" data-roomraccoon-root />
  </section>
</template>
