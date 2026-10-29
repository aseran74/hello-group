<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | 'hero'
    /** `light` = blanco (navbar / fondos oscuros) */
    tone?: 'default' | 'light'
  }>(),
  { size: 'md', tone: 'default' },
)

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-7 w-auto'
    case 'lg':
      return 'h-11 w-auto md:h-12'
    case 'hero':
      return 'h-12 w-auto md:h-16 lg:h-20'
    default:
      return 'h-8 w-auto md:h-9'
  }
})
</script>

<template>
  <img
    src="/brand/logo.png"
    alt="Hello Group"
    class="block object-contain"
    :class="[
      sizeClass,
      tone === 'light' && 'brightness-0 invert',
    ]"
    width="500"
    height="140"
  >
</template>
