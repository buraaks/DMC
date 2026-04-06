<script setup lang="ts">
import type { SiteSettings } from '~~/shared/catalog'

const { data: settings } = await useAsyncData<SiteSettings>('site-settings', () => $fetch('/api/site-settings'))
</script>

<template>
  <div class="relative min-h-screen">
    <SiteHeader :settings="settings || undefined" />
    <main class="pt-20">
      <slot />
    </main>
    <SiteFooter :settings="settings || undefined" />
  </div>
</template>
