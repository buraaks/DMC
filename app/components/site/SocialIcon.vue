<script setup lang="ts">
const props = defineProps<{
  name: 'instagram' | 'whatsapp' | 'facebook' | 'linkedin'
}>()
</script>

<template>
  <svg
    v-if="props.name === 'instagram'"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="h-4 w-4"
    aria-hidden="true"
  >
    <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5.25" stroke="currentColor" stroke-width="1.8" />
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.8" />
    <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
  </svg>

  <svg
    v-else-if="props.name === 'whatsapp'"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M12 3.25C7.17 3.25 3.25 7.07 3.25 11.8C3.25 13.55 3.79 15.18 4.71 16.53L4 20.75L8.41 19.61C9.53 20.25 10.82 20.6 12 20.6C16.83 20.6 20.75 16.78 20.75 12.05C20.75 7.32 16.83 3.25 12 3.25Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M9.2 8.95C9.53 8.2 9.84 8.15 10.12 8.16C10.34 8.17 10.6 8.16 10.83 8.16C11.06 8.16 11.43 8.24 11.57 8.58C11.71 8.91 12.05 10.02 12.1 10.11C12.15 10.2 12.17 10.32 12.09 10.44C12.01 10.55 11.97 10.63 11.81 10.81C11.66 10.98 11.5 11.19 11.37 11.33C11.23 11.48 11.08 11.64 11.25 11.94C11.41 12.24 11.99 13.19 12.86 13.95C13.98 14.94 14.92 15.25 15.24 15.39C15.56 15.53 15.74 15.51 15.88 15.37C16.03 15.22 16.48 14.7 16.66 14.44C16.84 14.17 17.02 14.22 17.3 14.33C17.57 14.43 19.05 15.15 19.35 15.31C19.65 15.47 19.85 15.55 19.93 15.68C20.01 15.82 20.01 16.47 19.7 17.07C19.39 17.66 17.87 18.2 17.2 18.28C16.54 18.36 15.71 18.39 13.07 17.28C10.1 16.03 8.14 12.99 7.99 12.79C7.85 12.6 6.82 11.25 6.82 9.86C6.82 8.47 7.55 7.78 7.81 7.48C8.07 7.18 8.38 7.11 8.56 7.11C8.74 7.11 8.91 7.12 9.06 7.13C9.19 7.13 9.38 7.08 9.53 7.43L9.2 8.95Z" fill="currentColor" />
  </svg>

  <svg
    v-else-if="props.name === 'facebook'"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M13.6 20.75V12.9H16.22L16.63 9.86H13.6V7.92C13.6 7.03 13.85 6.42 15.12 6.42H16.74V3.7C15.95 3.61 15.16 3.57 14.36 3.58C11.99 3.58 10.37 5.03 10.37 7.69V9.86H7.75V12.9H10.37V20.75H13.6Z" fill="currentColor" />
  </svg>

  <svg
    v-else
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="h-4 w-4"
    aria-hidden="true"
  >
    <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="3.2" stroke="currentColor" stroke-width="1.8" />
    <path d="M8 10.25V16.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M12 16.4V12.75C12 11.48 12.7 10.25 14.4 10.25C16.1 10.25 16.5 11.62 16.5 12.96V16.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="8" cy="7.6" r="1.05" fill="currentColor" />
  </svg>
</template>
