<script setup lang="ts">
withDefaults(
  defineProps<{
    flip?: boolean
    fill?: string
  }>(),
  { flip: false, fill: 'var(--color-paper)' },
)
</script>

<template>
  <div
    class="pointer-events-none relative -mt-px h-12 w-full overflow-hidden md:h-16 lg:h-20"
    :class="flip && 'rotate-180'"
    aria-hidden="true"
  >
    <svg
      class="absolute inset-x-0 bottom-0 h-full w-[120%] -translate-x-[8%]"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
    >
      <path
        :fill="fill"
        d="M0,64 C240,120 480,0 720,40 C960,80 1200,120 1440,48 L1440,120 L0,120 Z"
      />
    </svg>
  </div>
</template>
