<script setup lang="ts">
import type { SiteSettings } from '~~/shared/catalog'
import { ref, watch } from 'vue'

defineProps<{
  settings?: SiteSettings
}>()

const route = useRoute()
const mobileMenuOpen = ref(false)

const navigationItems = [
  { label: 'Anasayfa', to: '/' },
  { label: 'Ürünler', to: '/urunler' },
  { label: 'İletişim', to: '/iletisim' },
]

watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false
})

function isActive(target: string) {
  return target === '/'
    ? route.path === target
    : route.path.startsWith(target)
}
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-40">
    <div class="section-shell py-4">
      <div class="surface-panel flex items-center justify-between gap-4 rounded-full px-4 py-3 md:px-6">
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

        <div class="flex items-center gap-2 md:hidden">
          <button
            type="button"
            class="surface-panel inline-flex h-11 w-11 items-center justify-center rounded-full"
            :aria-expanded="mobileMenuOpen"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            {{ mobileMenuOpen ? '×' : '☰' }}
          </button>
        </div>
      </div>

      <div v-if="mobileMenuOpen" class="surface-panel mt-3 rounded-[1.75rem] p-3 md:hidden">
        <div class="flex flex-col gap-2">
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
      </div>
    </div>
  </header>
</template>
