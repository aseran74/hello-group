<script setup lang="ts">
const props = withDefaults(defineProps<{
  bookingUrl?: string | null
  houseName?: string
  /** panel = ancho completo desplegable; sidebar = recuadro lateral */
  variant?: 'panel' | 'sidebar'
}>(), {
  variant: 'panel',
})

const { t } = useI18n()

const hasBooking = computed(() => Boolean(props.bookingUrl))
/** Lateral: abierto por defecto; panel superior: cerrado hasta desplegar */
const open = ref(props.variant === 'sidebar')
const calendarId = computed(() =>
  props.variant === 'sidebar' ? 'roomraccoon-calendar-sidebar' : 'roomraccoon-calendar',
)

function toggle() {
  open.value = !open.value
}
</script>

<template>
  <!-- Lateral: debajo de consultar tarifa -->
  <section
    v-if="variant === 'sidebar'"
    :id="calendarId"
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
      <button
        type="button"
        class="btn-primary mt-5 inline-flex w-full items-center justify-center gap-2"
        :aria-expanded="open"
        :aria-controls="`${calendarId}-frame`"
        @click="toggle"
      >
        {{ open ? t('homes.bookClose') : t('homes.bookOpen') }}
        <span
          class="inline-block text-sm transition-transform duration-200"
          :class="open ? 'rotate-180' : ''"
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      <a
        :href="bookingUrl!"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-secondary mt-3 w-full text-center"
      >
        {{ t('homes.bookExternal') }}
      </a>
      <div
        v-if="open"
        :id="`${calendarId}-frame`"
        class="mt-5 overflow-hidden rounded-2xl border border-line bg-paper-elevated"
      >
        <iframe
          :src="bookingUrl!"
          :title="t('homes.bookSlot')"
          class="h-[28rem] w-full border-0"
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

  <!-- Panel superior ancho completo -->
  <section
    v-else
    id="roomraccoon-widget"
    class="w-full rounded-[1.75rem] border border-line bg-paper p-5 md:p-8"
    :class="!hasBooking && 'border-dashed border-ink/20'"
  >
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div class="min-w-0">
        <p class="eyebrow">RoomRaccoon</p>
        <h2 class="mt-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
          {{ t('homes.bookSlot') }}
        </h2>
        <p v-if="hasBooking" class="mt-2 max-w-2xl text-sm leading-relaxed text-mute md:text-base">
          {{ t('homes.bookReady', { name: houseName || '' }) }}
        </p>
        <p v-else class="mt-2 text-sm leading-relaxed text-mute">{{ t('homes.bookHint') }}</p>
      </div>

      <div v-if="hasBooking" class="flex flex-wrap gap-2">
        <button
          type="button"
          class="btn-primary inline-flex items-center gap-2"
          :aria-expanded="open"
          :aria-controls="calendarId"
          @click="toggle"
        >
          {{ open ? t('homes.bookClose') : t('homes.bookOpen') }}
          <span
            class="inline-block text-sm transition-transform duration-200"
            :class="open ? 'rotate-180' : ''"
            aria-hidden="true"
          >
            ▾
          </span>
        </button>
        <a
          :href="bookingUrl!"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-secondary"
        >
          {{ t('homes.bookExternal') }}
        </a>
      </div>
    </div>

    <div
      v-if="hasBooking && open"
      :id="calendarId"
      class="mt-6 overflow-hidden rounded-2xl border border-line bg-paper-elevated"
    >
      <iframe
        :src="bookingUrl!"
        :title="t('homes.bookSlot')"
        class="h-[min(70vh,42rem)] w-full border-0 md:h-[min(75vh,48rem)]"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      />
    </div>

    <div
      v-else-if="!hasBooking"
      class="mt-6 min-h-24 rounded-2xl border border-line/80 bg-paper-elevated"
      data-roomraccoon-root
    />
  </section>
</template>
