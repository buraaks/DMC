<script setup lang="ts">
import type { SiteSettings } from '~~/shared/catalog'
import { computed } from 'vue'
import { defaultSiteSettings } from '~~/shared/catalog'
import { buildBreadcrumbSchema, buildOrganizationSchema, toAbsoluteUrl } from '~/utils/seo'

const runtimeConfig = useRuntimeConfig()

const { data: settings } = await useAsyncData<SiteSettings>('site-settings', () => $fetch('/api/site-settings'))
const siteSettings = computed(() => settings.value ?? defaultSiteSettings)

const socialItems = computed(() => [
  { label: 'Instagram', href: siteSettings.value.socialLinks.instagram },
  { label: 'WhatsApp', href: siteSettings.value.socialLinks.whatsapp },
  { label: 'Facebook', href: siteSettings.value.socialLinks.facebook },
  { label: 'LinkedIn', href: siteSettings.value.socialLinks.linkedin },
])

useSeoMeta({
  title: () => `İletişim | ${siteSettings.value.siteName}`,
  description: () => siteSettings.value.contactIntro,
  ogTitle: () => `İletişim | ${siteSettings.value.siteName}`,
  ogDescription: () => siteSettings.value.contactIntro,
  ogImage: () => toAbsoluteUrl(runtimeConfig.public.siteUrl, siteSettings.value.hero.imagePath),
})

useJsonLd(() => ([
  buildOrganizationSchema(runtimeConfig.public.siteUrl, siteSettings.value),
  buildBreadcrumbSchema(runtimeConfig.public.siteUrl, [
    { name: 'Anasayfa', path: '/' },
    { name: 'İletişim', path: '/iletisim' },
  ]),
]))
</script>

<template>
  <div class="section-shell space-y-10 pb-12">
    <section class="surface-panel-strong rounded-[2.4rem] p-8 md:p-10">
      <p class="section-kicker">
        İletişim
      </p>
      <h1 class="section-heading mt-4">
        {{ siteSettings.contactTitle }}
      </h1>
      <p class="section-copy mt-4">
        {{ siteSettings.contactIntro }}
      </p>
    </section>

    <section class="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
      <div class="surface-panel rounded-[2rem] p-8">
        <p class="text-xs font-black uppercase tracking-[0.26em] text-[color:var(--brand-green)]">
          Doğrudan Hatlar
        </p>
        <div class="mt-6 space-y-6">
          <div>
            <p class="field-label">
              Adres
            </p>
            <p class="text-base leading-7 text-[color:var(--text-secondary)]">
              {{ siteSettings.address }}
            </p>
          </div>
          <div>
            <p class="field-label">
              Telefon
            </p>
            <a :href="`tel:${siteSettings.phone}`" class="text-base font-semibold">
              {{ siteSettings.phone }}
            </a>
          </div>
          <div>
            <p class="field-label">
              E-Posta
            </p>
            <a :href="`mailto:${siteSettings.email}`" class="text-base font-semibold">
              {{ siteSettings.email }}
            </a>
          </div>
        </div>
      </div>

      <div class="surface-panel rounded-[2rem] p-8">
        <p class="text-xs font-black uppercase tracking-[0.26em] text-[color:var(--brand-green)]">
          Hızlı Erişim
        </p>
        <div class="mt-6 space-y-5">
          <SiteWhatsAppButton
            :phone="siteSettings.whatsappNumber"
            message="Merhaba, ürün ve teklif bilgisi almak istiyorum."
            full-width
          />

          <div class="thin-divider" />

          <div class="grid gap-3">
            <a
              v-for="item in socialItems"
              :key="item.label"
              :href="item.href"
              target="_blank"
              rel="noreferrer"
              class="surface-panel-strong flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-[color:var(--text-secondary)]"
            >
              <span>{{ item.label }}</span>
              <span class="text-[color:var(--brand-green)]">Aç</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
