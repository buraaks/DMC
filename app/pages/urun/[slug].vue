<script setup lang="ts">
import type { Brand, Product, SiteSettings } from '~~/shared/catalog'
import { computed } from 'vue'
import { defaultSiteSettings, getPrimaryProductImagePath, resolveRelatedCatalogProducts } from '~~/shared/catalog'
import { buildBreadcrumbSchema, buildOrganizationSchema, buildProductSchema, toAbsoluteUrl } from '~/utils/seo'

const siteUrl = useSiteUrl()
const route = useRoute()
const slug = route.params.slug as string

const { data: product } = await useAsyncData<Product>(`product-${slug}`, () => $fetch(`/api/products/${slug}`))
const { data: products } = await useAsyncData<Product[]>('product-list', () => $fetch('/api/products'))
const { data: brands } = await useAsyncData<Brand[]>('brands', () => $fetch('/api/brands'))
const { data: settings } = await useAsyncData<SiteSettings>('site-settings', () => $fetch('/api/site-settings'))

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Ürün bulunamadı.',
  })
}

const siteSettings = computed(() => settings.value ?? defaultSiteSettings)
const brand = computed(() => (brands.value ?? []).find(item => item.id === product.value?.brandId))
const primaryImagePath = computed(() => getPrimaryProductImagePath(product.value?.imagePaths ?? []))
const relatedProducts = computed(() => {
  if (!product.value) {
    return []
  }

  return resolveRelatedCatalogProducts(product.value, products.value ?? [])
})

useSeoMeta({
  title: () => product.value?.seoTitle || `${product.value?.name} | ${siteSettings.value.siteName}`,
  description: () => product.value?.seoDescription || product.value?.shortDescription,
  ogTitle: () => product.value?.seoTitle || `${product.value?.name} | ${siteSettings.value.siteName}`,
  ogDescription: () => product.value?.seoDescription || product.value?.shortDescription,
  ogImage: () => toAbsoluteUrl(siteUrl.value, primaryImagePath.value || siteSettings.value.hero.imagePath),
})

useJsonLd(() => ([
  buildOrganizationSchema(siteUrl.value, siteSettings.value),
  buildProductSchema(siteUrl.value, product.value!, brand.value?.name),
  buildBreadcrumbSchema(siteUrl.value, [
    { name: 'Anasayfa', path: '/' },
    { name: 'Ürünler', path: '/urunler' },
    { name: product.value?.name || 'Ürün', path: `/urun/${product.value?.slug}` },
  ]),
]))
</script>

<template>
  <UContainer class="space-y-12 pb-12">
    <section class="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
      <SiteProductGallery
        :image-paths="product!.imagePaths"
        :product-name="product!.name"
      />

      <div class="surface-panel-strong space-y-6 rounded-[2rem] p-8">
        <div class="flex flex-wrap items-center gap-3">
          <span v-if="brand" class="muted-chip">
            {{ brand.name }}
          </span>
          <SiteStockBadge :status="product!.stockStatus" />
        </div>

        <div class="space-y-4">
          <p class="text-xs font-black uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
            {{ product!.category }}
          </p>
          <h1 class="section-heading text-4xl md:text-5xl">
            {{ product!.name }}
          </h1>
          <p class="text-base leading-8 text-[color:var(--text-secondary)]">
            {{ product!.shortDescription }}
          </p>
        </div>

        <div class="thin-divider" />

        <div class="space-y-4">
          <p class="field-label">
            Teknik Bilgiler
          </p>
          <ul class="grid gap-3">
            <li
              v-for="detail in product!.technicalDetails"
              :key="detail"
              class="surface-panel rounded-2xl px-4 py-3 text-sm leading-7 text-[color:var(--text-secondary)]"
            >
              {{ detail }}
            </li>
          </ul>
        </div>

        <SiteWhatsAppButton
          :phone="siteSettings.whatsappNumber"
          :message="product!.whatsappMessage"
          full-width
        />
      </div>
    </section>

    <section class="space-y-6">
      <div class="flex items-end justify-between">
        <div>
          <p class="section-kicker">
            Benzer Ürünler
          </p>
          <h2 class="section-heading mt-4 text-3xl md:text-4xl">
            Aynı kategoriye yakın seçenekler
          </h2>
        </div>
      </div>

      <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SiteProductCard
          v-for="item in relatedProducts"
          :key="item.id"
          :product="item"
          :brand-name="brands?.find(brandItem => brandItem.id === item.brandId)?.name"
          :whatsapp-number="siteSettings.whatsappNumber"
        />
      </div>
    </section>
  </UContainer>
</template>
