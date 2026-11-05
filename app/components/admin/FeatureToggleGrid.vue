<script setup lang="ts">
import type { FeatureItem } from '~/data/feature-catalog'

const props = defineProps<{
  title: string
  items: FeatureItem[]
  modelValue: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [keys: string[]]
}>()

function isOn(key: string) {
  return props.modelValue.includes(key)
}

function toggle(key: string) {
  const next = isOn(key)
    ? props.modelValue.filter((k) => k !== key)
    : [...props.modelValue, key]
  emit('update:modelValue', next)
}
</script>

<template>
  <div>
    <h3 class="font-display text-base font-semibold text-ink">{{ title }}</h3>
    <p class="mt-1 text-xs text-mute">Pulsa para activar o desactivar</p>
    <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        class="flex items-center gap-2 border px-3 py-2.5 text-left text-sm transition"
        :class="isOn(item.key)
          ? 'border-ink bg-ink text-white'
          : 'border-line bg-white text-ink hover:border-ink/50'"
        @click="toggle(item.key)"
      >
        <span
          class="flex size-8 shrink-0 items-center justify-center"
          :class="isOn(item.key) ? 'text-white' : 'text-ink'"
        >
          <FeatureIcon :name="item.key" />
        </span>
        <span class="leading-tight">{{ item.label_es }}</span>
      </button>
    </div>
  </div>
</template>
