<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <UApp>
    <div class="min-h-screen flex items-center justify-center bg-(--page-bg) p-6">
      <UError :error="error" />
    </div>
  </UApp>
</template>
