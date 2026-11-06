<script setup lang="ts">
withDefaults(
  defineProps<{
    src: string
    alt?: string
    shape?: 'blob-a' | 'blob-b' | 'blob-c' | 'pill' | 'soft'
  }>(),
  { alt: '', shape: 'soft' },
)
</script>

<template>
  <div
    class="curved-media relative overflow-hidden bg-ink/5"
    :class="`shape-${shape}`"
  >
    <img
      :src="src"
      :alt="alt"
      class="h-full w-full object-cover transition duration-700 ease-expo group-hover:scale-[1.04]"
      loading="lazy"
      draggable="false"
    >
    <slot />
  </div>
</template>

<style scoped>
.curved-media {
  width: 100%;
  height: 100%;
}

.shape-soft {
  border-radius: 1.75rem;
}

.shape-pill {
  border-radius: 2rem 2rem 2.75rem 2.75rem / 2rem 2rem 3.5rem 3.5rem;
}

.shape-blob-a {
  border-radius: 42% 58% 48% 52% / 48% 42% 58% 52%;
}

.shape-blob-b {
  border-radius: 58% 42% 55% 45% / 45% 60% 40% 55%;
}

.shape-blob-c {
  border-radius: 48% 52% 38% 62% / 55% 38% 62% 45%;
}
</style>
