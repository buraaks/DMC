<script setup lang="ts">
import type { SiteSettings } from '~~/shared/catalog'
import { computed } from 'vue'

const props = defineProps<{
  settings?: SiteSettings
}>()

const socialItems = computed(() => {
  const settings = props.settings

  return [
    { label: 'Instagram', href: settings?.socialLinks.instagram, icon: 'instagram' as const },
    { label: 'WhatsApp', href: settings?.socialLinks.whatsapp, icon: 'whatsapp' as const },
    { label: 'Facebook', href: settings?.socialLinks.facebook, icon: 'facebook' as const },
    { label: 'LinkedIn', href: settings?.socialLinks.linkedin, icon: 'linkedin' as const },
  ].filter(item => item.href)
})
</script>

<template>
  <footer class="mt-24 border-t border-[color:var(--surface-border)] bg-[linear-gradient(180deg,rgba(248,251,255,0.92),rgba(231,239,247,0.98))] text-[color:var(--text-primary)]">
    <div class="section-shell py-14">
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
              <p class="text-xs font-black uppercase tracking-[0.28em] text-[color:var(--brand-green)]">
                {{ settings?.siteName || 'DMC Otomasyon' }}
              </p>
              <h2 class="mt-2 text-2xl font-semibold">
                PLC ve otomasyon ürünlerinde güvenilir tedarik.
              </h2>
            </div>
          </div>
          <p class="max-w-xl text-sm leading-7 text-[color:var(--text-secondary)]">
            {{ settings?.footerNote }}
          </p>
        </div>

        <div class="space-y-4">
          <p class="text-xs font-black uppercase tracking-[0.3em] text-[color:var(--text-muted)]">
            İletişim
          </p>
          <div class="space-y-3 text-sm text-[color:var(--text-secondary)]">
            <p>{{ settings?.address }}</p>
            <p>{{ settings?.phone }}</p>
            <a :href="`mailto:${settings?.email}`">{{ settings?.email }}</a>
          </div>
        </div>

        <div class="space-y-4">
          <p class="text-xs font-black uppercase tracking-[0.3em] text-[color:var(--text-muted)]">
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
              class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--surface-border)] bg-white/80 text-[color:var(--brand-blue)] transition hover:-translate-y-0.5 hover:border-[color:var(--brand-green)] hover:text-[color:var(--brand-green)]"
            >
              <SiteSocialIcon :name="item.icon" />
            </a>
          </div>
        </div>
      </div>

      <div class="thin-divider my-8" />

      <p class="text-sm text-[color:var(--text-muted)]">
        © {{ new Date().getFullYear() }} {{ settings?.siteName || 'DMC Otomasyon' }}. Tüm hakları saklıdır.
      </p>
    </div>
  </footer>
</template>
