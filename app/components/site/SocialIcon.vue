<script setup lang="ts">
const props = defineProps<{
  name: string
  link?: string
  label?: string
}>()
</script>

<template>
  <a
    v-if="link"
    :href="link"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="label"
  >
    <Icon :name="name" class="h-4 w-4" />
  </a>
  <Icon v-else :name="name" class="h-4 w-4" />
</template>
