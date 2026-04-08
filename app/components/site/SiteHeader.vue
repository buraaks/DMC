<script setup lang="ts">
import type { SiteSettings } from '~~/shared/catalog'

defineProps<{
  settings?: SiteSettings
}>()

const route = useRoute()

const navigationItems = [
  { label: 'Anasayfa', to: '/' },
  { label: 'Ürünler', to: '/urunler' },
  { label: 'İletişim', to: '/iletisim' },
]

function isActive(target: string) {
  return target === '/'
    ? route.path === target
    : route.path.startsWith(target)
}
</script>

<template>
  <UHeader
    class="fixed inset-x-0 top-0 z-40 bg-transparent px-4 sm:px-6 lg:px-8"
    :ui="{
      root: 'border-none bg-transparent backdrop-blur-none shadow-none',
      container: 'mx-auto px-4 sm:px-6 lg:px-10 max-w-[88rem] mt-4 surface-panel rounded-full py-8 md:px-6 flex items-center justify-between gap-4',
      toggle: 'surface-panel inline-flex h-11 w-11 items-center justify-center rounded-full text-xl md:hidden',
    }"
  >
    <template #left>
      <NuxtLink to="/" class="flex min-w-0 items-center gap-3">
        <img
          v-if="settings?.logoPath"
          :src="settings.logoPath"
          :alt="settings.siteName"
          class="h-11 w-auto object-contain"
        >
        <div class="min-w-0">
          <p class="truncate text-sm font-extrabold uppercase tracking-[0.22em] text-[color:var(--brand-green)]">
            {{ settings?.siteName || 'DMC Otomasyon' }}
          </p>
          <p class="hidden truncate text-sm text-[color:var(--text-secondary)] md:block">
            {{ settings?.siteTagline || 'PLC ve endüstriyel otomasyon çözümleri' }}
          </p>
        </div>
      </NuxtLink>
    </template>

    <template #right>
      <div class="hidden items-center gap-2 md:flex">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          class="rounded-full px-4 py-2 text-sm font-semibold transition"
          :class="isActive(item.to) ? 'bg-[color:var(--brand-blue-soft)] text-[color:var(--brand-blue)]' : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'"
        >
          {{ item.label }}
        </NuxtLink>
      </div>
    </template>

    <template #body>
      <UContainer class="mt-3 md:hidden">
        <div class="surface-panel flex flex-col gap-2 rounded-[1.75rem] p-3">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.to"
            :to="item.to"
            class="rounded-2xl px-4 py-3 text-sm font-semibold"
            :class="isActive(item.to) ? 'bg-[color:var(--brand-blue-soft)] text-[color:var(--brand-blue)]' : 'text-[color:var(--text-secondary)]'"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
      </UContainer>
    </template>
  </UHeader>
</template>
