<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="h-5 w-5"
    aria-hidden="true"
  >
    <!-- mountain bike -->
    <template v-if="name === 'mtb'">
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M6 17 10 8h3l2 4h3" />
      <path d="m12 12 2-4" />
    </template>

    <!-- surf -->
    <template v-else-if="name === 'surf'">
      <path d="M3 15c3-2 6-3 9-3s6 1 9 3" />
      <path d="M4 18c3-1.5 6-2.2 8-2.2S17 16.5 20 18" />
      <path d="M12 4v8" />
      <path d="m9 8 3-4 3 4" />
    </template>

    <!-- hiking / senderismo -->
    <template v-else-if="name === 'hiking'">
      <circle cx="13" cy="5" r="2" />
      <path d="m9 21 3-7 2 2 3 5" />
      <path d="m7 11 4 1 2-4 4 2" />
    </template>

    <!-- canoe / piragüismo -->
    <template v-else-if="name === 'canoe'">
      <path d="M3 15c2.5 2 5.5 3 9 3s6.5-1 9-3" />
      <path d="M5 15c1.5-3 4-5 7-5s5.5 2 7 5" />
      <path d="M12 6v4" />
    </template>

    <!-- museum / prado -->
    <template v-else-if="name === 'museum'">
      <path d="M4 10h16" />
      <path d="M6 10v8" />
      <path d="M10 10v8" />
      <path d="M14 10v8" />
      <path d="M18 10v8" />
      <path d="M3 18h18" />
      <path d="m12 3 9 5H3z" />
    </template>

    <!-- park / retiro -->
    <template v-else-if="name === 'park'">
      <path d="M12 22v-7" />
      <path d="M9 9a3 3 0 1 0 6 0 5 5 0 0 0-6 0" />
      <path d="M8 15c-2 0-4-1.5-4-4 3 0 4 2 4 4Z" />
      <path d="M16 15c2 0 4-1.5 4-4-3 0-4 2-4 4Z" />
    </template>

    <!-- beach -->
    <template v-else-if="name === 'beach'">
      <path d="M3 18c3-1 6-1.5 9-1.5S18 17 21 18" />
      <path d="M12 4v9" />
      <path d="M8 8c2-2 4-3 4-3s2 1 4 3" />
      <circle cx="17" cy="6" r="2" />
    </template>

    <!-- food / gastronomy -->
    <template v-else-if="name === 'food'">
      <path d="M8 3v8" />
      <path d="M6 3v4a2 2 0 0 0 4 0V3" />
      <path d="M8 11v10" />
      <path d="M16 3v18" />
      <path d="M16 3a3 3 0 0 1 3 3v2h-6V6a3 3 0 0 1 3-3Z" />
    </template>

    <!-- city / urban -->
    <template v-else-if="name === 'city'">
      <path d="M4 21V9l6-4 6 4v12" />
      <path d="M10 21V11" />
      <path d="M14 21v-6h4v6" />
      <path d="M7 12h1" />
      <path d="M7 15h1" />
    </template>

    <!-- wine / leisure -->
    <template v-else-if="name === 'wine'">
      <path d="M8 4h8l-1 7a4 4 0 0 1-6 0L8 4Z" />
      <path d="M12 11v9" />
      <path d="M9 20h6" />
    </template>

    <!-- default -->
    <template v-else>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2 2" />
    </template>
  </svg>
</template>
