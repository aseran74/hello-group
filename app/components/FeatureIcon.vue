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
    <template v-if="name === 'wifi'">
      <path d="M5 12.5a10 10 0 0 1 14 0" />
      <path d="M8.5 16a5 5 0 0 1 7 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="name === 'pet'">
      <circle cx="8" cy="10" r="1.5" />
      <circle cx="16" cy="10" r="1.5" />
      <circle cx="6" cy="14" r="1.5" />
      <circle cx="18" cy="14" r="1.5" />
      <path d="M9 17c1.2 1.4 4.8 1.4 6 0-1 2.5-5 2.5-6 0Z" />
    </template>
    <template v-else-if="name === 'kitchen'">
      <path d="M4 3v8a2 2 0 0 0 4 0V3" />
      <path d="M6 11v10" />
      <path d="M14 3v18" />
      <path d="M14 3h4a2 2 0 0 1 0 4h-4" />
    </template>
    <template v-else-if="name === 'heating'">
      <path d="M12 3v4" />
      <path d="M8 7h8" />
      <path d="M9 11c0 4 1.5 7 3 10 1.5-3 3-6 3-10a3 3 0 0 0-6 0Z" />
    </template>
    <template v-else-if="name === 'ac'">
      <path d="M12 4v6" />
      <path d="M8 8h8" />
      <path d="M6 14h12" />
      <path d="M8 18h8" />
      <path d="M10 14v6" />
      <path d="M14 14v6" />
    </template>
    <template v-else-if="name === 'parking'">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 16V8h3.5a2.5 2.5 0 0 1 0 5H9" />
    </template>
    <template v-else-if="name === 'garden'">
      <path d="M12 22v-8" />
      <path d="M7 10c0-4 5-7 5-7s5 3 5 7c-2.5 0-5 2-5 4 0-2-2.5-4-5-4Z" />
    </template>
    <template v-else-if="name === 'terrace'">
      <path d="M4 20h16" />
      <path d="M6 20V10l6-5 6 5v10" />
      <path d="M10 20v-5h4v5" />
    </template>
    <template v-else-if="name === 'fireplace'">
      <path d="M8 21h8" />
      <path d="M9 21V10a3 3 0 0 1 6 0v11" />
      <path d="M12 14c1-1.5 2-2.5 2-4a2 2 0 0 0-4 0c0 1.5 1 2.5 2 4Z" />
    </template>
    <template v-else-if="name === 'tv'">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 18v3" />
    </template>
    <template v-else-if="name === 'washer'">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <circle cx="12" cy="13" r="4" />
      <path d="M8 6h2" />
    </template>
    <template v-else-if="name === 'elevator'">
      <rect x="6" y="3" width="12" height="18" rx="1" />
      <path d="m10 10 2-2 2 2" />
      <path d="m10 15 2 2 2-2" />
    </template>
    <template v-else-if="name === 'workspace'">
      <rect x="3" y="5" width="18" height="12" rx="1" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 9h4" />
    </template>
    <template v-else-if="name === 'pool'">
      <path d="M4 17c2 1 4 1.5 6 1.5S14 18 16 17s4-1.5 6-1.5" />
      <path d="M4 13c2 1 4 1.5 6 1.5S14 14 16 13s4-1.5 6-1.5" />
      <path d="M8 6v5" />
      <path d="M8 6c2-2 4-2 4 0" />
    </template>
    <!-- activities reuse -->
    <template v-else-if="name === 'mtb'">
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M6 17 10 8h3l2 4h3" />
      <path d="m12 12 2-4" />
    </template>
    <template v-else-if="name === 'surf'">
      <path d="M3 15c3-2 6-3 9-3s6 1 9 3" />
      <path d="M4 18c3-1.5 6-2.2 8-2.2S17 16.5 20 18" />
      <path d="M12 4v8" />
    </template>
    <template v-else-if="name === 'hiking'">
      <circle cx="13" cy="5" r="2" />
      <path d="m9 21 3-7 2 2 3 5" />
      <path d="m7 11 4 1 2-4 4 2" />
    </template>
    <template v-else-if="name === 'canoe'">
      <path d="M3 15c2.5 2 5.5 3 9 3s6.5-1 9-3" />
      <path d="M5 15c1.5-3 4-5 7-5s5.5 2 7 5" />
    </template>
    <template v-else-if="name === 'museum'">
      <path d="M4 10h16" />
      <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
      <path d="M3 18h18" />
      <path d="m12 3 9 5H3z" />
    </template>
    <template v-else-if="name === 'park'">
      <path d="M12 22v-7" />
      <path d="M9 9a3 3 0 1 0 6 0 5 5 0 0 0-6 0" />
    </template>
    <template v-else-if="name === 'beach'">
      <path d="M3 18c3-1 6-1.5 9-1.5S18 17 21 18" />
      <path d="M12 4v9" />
      <circle cx="17" cy="6" r="2" />
    </template>
    <template v-else-if="name === 'food'">
      <path d="M8 3v8M6 3v4a2 2 0 0 0 4 0V3M8 11v10" />
      <path d="M16 3v18M16 3a3 3 0 0 1 3 3v2h-6V6a3 3 0 0 1 3-3Z" />
    </template>
    <template v-else-if="name === 'city'">
      <path d="M4 21V9l6-4 6 4v12" />
      <path d="M10 21V11M14 21v-6h4v6" />
    </template>
    <template v-else-if="name === 'wine'">
      <path d="M8 4h8l-1 7a4 4 0 0 1-6 0L8 4Z" />
      <path d="M12 11v9M9 20h6" />
    </template>
    <template v-else>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2 2" />
    </template>
  </svg>
</template>
