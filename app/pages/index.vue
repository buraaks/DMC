<script setup lang="ts">
import type { Brand, Product, SiteSettings } from '~~/shared/catalog'
import { computed } from 'vue'
import { defaultSiteSettings } from '~~/shared/catalog'
import { buildBreadcrumbSchema, buildOrganizationSchema, toAbsoluteUrl } from '~/utils/seo'

const runtimeConfig = useRuntimeConfig()

const { data: settings } = await useAsyncData<SiteSettings>('site-settings', () => $fetch('/api/site-settings'))
const { data: brands } = await useAsyncData<Brand[]>('brands', () => $fetch('/api/brands'))
const { data: products } = await useAsyncData<Product[]>('home-products', () => $fetch('/api/products'))

const siteSettings = computed(() => settings.value ?? defaultSiteSettings)
const brandList = computed(() => brands.value ?? [])
const featuredProducts = computed(() => {
  const productMap = new Map((products.value ?? []).map(product => [product.id, product]))
  const selectedProducts = siteSettings.value.featuredProductIds
    .map(productId => productMap.get(productId))
    .filter((product): product is Product => Boolean(product))

  return selectedProducts.length > 0
    ? selectedProducts
    : (products.value ?? []).filter(product => product.featured).slice(0, 5)
})

useSeoMeta({
  title: () => `${siteSettings.value.siteName} | PLC ve Endüstriyel Otomasyon`,
  description: () => siteSettings.value.hero.description,
  ogTitle: () => `${siteSettings.value.siteName} | PLC ve Endüstriyel Otomasyon`,
  ogDescription: () => siteSettings.value.hero.description,
  ogImage: () => toAbsoluteUrl(runtimeConfig.public.siteUrl, siteSettings.value.hero.imagePath),
})

useJsonLd(() => ([
  buildOrganizationSchema(runtimeConfig.public.siteUrl, siteSettings.value),
  buildBreadcrumbSchema(runtimeConfig.public.siteUrl, [
    { name: 'Anasayfa', path: '/' },
  ]),
]))
</script>

<template>
  <div class="space-y-20 pb-10 md:space-y-28">
    <section class="px-4 pt-4 sm:px-6 lg:px-10">
      <div class="overflow-hidden rounded-[2.2rem] border border-black/5 bg-[color:var(--surface-panel-strong)] shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <div class="relative aspect-[16/8] min-h-[13rem] md:min-h-[16rem] lg:min-h-[18rem]">
          <img
            v-if="siteSettings.hero.imagePath"
            :src="siteSettings.hero.imagePath"
            :alt="siteSettings.siteName"
            class="h-full w-full object-cover"
          >
          <div
            v-else
            class="h-full w-full bg-[linear-gradient(135deg,rgba(229,243,238,0.96),rgba(211,231,240,0.92))]"
          />
        </div>
      </div>
    </section>

    <section class="section-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
      <div class="space-y-5">
        <p class="section-kicker">
          Hakkımızda
        </p>
        <h2 class="section-heading">
          {{ siteSettings.aboutTitle }}
        </h2>
      </div>
      <p class="section-copy max-w-3xl">
        {{ siteSettings.aboutBody }}
      </p>
    </section>

    <section class="section-shell">
      <div class="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        <NuxtLink
          v-for="brand in brandList"
          :key="brand.id"
          :to="{ path: '/urunler', query: { brand: brand.slug } }"
          class="surface-panel card-lift flex min-h-28 items-center justify-center rounded-[1.7rem] px-5 py-6"
        >
          <img :src="brand.logoPath" :alt="brand.name" class="max-h-14 w-auto object-contain">
        </NuxtLink>
      </div>
    </section>

    <section class="section-shell space-y-8">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="space-y-4">
          <p class="section-kicker">
            Katalog
          </p>
          <h2 class="section-heading">
            {{ siteSettings.featuredSectionTitle }}
          </h2>
        </div>
        <NuxtLink to="/urunler" class="button-secondary justify-center">
          Tüm Ürünleri Aç
        </NuxtLink>
      </div>

      <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <SiteProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
          :brand-name="brandList.find(brand => brand.id === product.brandId)?.name"
          :whatsapp-number="siteSettings.whatsappNumber"
        />
      </div>
    </section>

    <section class="section-shell">
      <div class="surface-panel-strong grid gap-8 rounded-[2.2rem] p-8 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div class="space-y-4">
          <p class="section-kicker">
            Son Adım
          </p>
          <h2 class="section-heading text-3xl md:text-4xl">
            {{ siteSettings.contactTitle }}
          </h2>
          <p class="section-copy max-w-3xl">
            {{ siteSettings.contactIntro }}
          </p>
        </div>
        <SiteWhatsAppButton
          :phone="siteSettings.whatsappNumber"
          :message="siteSettings.contactTitle"
        />
      </div>
    </section>
  </div>
</template>
