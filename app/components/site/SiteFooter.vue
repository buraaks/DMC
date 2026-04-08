<script setup lang="ts">
import type { SiteSettings } from '~~/shared/catalog'
import { computed } from 'vue'

const props = defineProps<{
  settings?: SiteSettings
}>()

const socialItems = computed(() => {
  const settings = props.settings

  return [
    { label: 'Instagram', href: settings?.socialLinks.instagram, icon: 'lucide:instagram' },
    { label: 'WhatsApp', href: settings?.socialLinks.whatsapp, icon: 'mdi:whatsapp' },
    { label: 'Facebook', href: settings?.socialLinks.facebook, icon: 'mdi:facebook' },
    { label: 'LinkedIn', href: settings?.socialLinks.linkedin, icon: 'mdi:linkedin' },
  ].filter(item => item.href)
})
</script>

<template>
  <UFooter class="mt-24 border-t border-(--surface-border) bg-[linear-gradient(180deg,rgba(248,251,255,0.92),rgba(231,239,247,0.98))] text-(--text-primary)">
    <UContainer class="py-14">
      <div class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.7fr]">
        <div class="space-y-5">
          <div class="flex items-center gap-4">
            <img
              v-if="settings?.logoPath"
              :src="settings.logoPath"
              :alt="settings.siteName"
              class="h-14 w-auto object-contain"
            >
            <div>
              <p class="text-xs font-black uppercase tracking-[0.28em] text-(--brand-green)">
                {{ settings?.siteName || 'DMC Otomasyon' }}
              </p>
              <h2 class="mt-2 text-2xl font-semibold">
                PLC ve otomasyon ürünlerinde güvenilir tedarik.
              </h2>
            </div>
          </div>
          <p class="max-w-xl text-sm leading-7 text-(--text-secondary)">
            {{ settings?.footerNote }}
          </p>
        </div>

        <div class="space-y-4">
          <p class="text-xs font-black uppercase tracking-[0.3em] text-(--text-muted)">
            İletişim
          </p>
          <div class="space-y-3 text-sm text-(--text-secondary)">
            <p>{{ settings?.address }}</p>
            <p>{{ settings?.phone }}</p>
            <a :href="`mailto:${settings?.email}`">{{ settings?.email }}</a>
          </div>
        </div>

        <div class="space-y-4">
          <p class="text-xs font-black uppercase tracking-[0.3em] text-(--text-muted)">
            Sosyal
          </p>
          <div class="flex flex-wrap gap-3">
            <a
              v-for="item in socialItems"
              :key="item.label"
              :href="item.href"
              :aria-label="item.label"
              :title="item.label"
              target="_blank"
              rel="noreferrer"
              class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-(--surface-border) bg-white/80 text-(--brand-blue) transition hover:-translate-y-0.5 hover:border-(--brand-green) hover:text-(--brand-green)"
            >
              <UIcon :name="item.icon" class="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div class="thin-divider my-8" />

      <p class="text-sm text-(--text-muted)">
        © {{ new Date().getFullYear() }} {{ settings?.siteName || 'DMC Otomasyon' }}. Tüm hakları saklıdır.
      </p>
    </UContainer>
  </UFooter>
</template>
