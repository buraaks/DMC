<script setup lang="ts">
import type { SiteSettings } from '~~/shared/catalog'

const { data: settings } = await useAsyncData<SiteSettings>('site-settings', () => $fetch('/api/site-settings'))
</script>

<template>
  <div>
    <SiteHeader :settings="settings || undefined" />

    <UMain>
      <slot />
    </UMain>

    <SiteFooter :settings="settings || undefined" />
  </div>
</template>
