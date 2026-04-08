<script setup lang="ts">
import type { Brand, Product, SiteSettings } from '~~/shared/catalog'
import { computed, ref } from 'vue'
import { defaultSiteSettings } from '~~/shared/catalog'
import { buildBreadcrumbSchema, buildOrganizationSchema, toAbsoluteUrl } from '~/utils/seo'

const siteUrl = useSiteUrl()

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
const featuredProductsForHome = computed(() => featuredProducts.value.slice(0, 4))

const heroSliderRef = ref<HTMLElement | null>(null)
function scrollHero(direction: 'left' | 'right') {
  if (!heroSliderRef.value) return
  const amount = heroSliderRef.value.clientWidth
  heroSliderRef.value.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' })
}

const featuredSliderRef = ref<HTMLElement | null>(null)
function scrollFeatured(direction: 'left' | 'right') {
  if (!featuredSliderRef.value) return
  const amount = featuredSliderRef.value.clientWidth * 0.8
  featuredSliderRef.value.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' })
}

useSeoMeta({
  title: () => `${siteSettings.value.siteName} | PLC ve Endüstriyel Otomasyon`,
  description: () => siteSettings.value.hero.description,
  ogTitle: () => `${siteSettings.value.siteName} | PLC ve Endüstriyel Otomasyon`,
  ogDescription: () => siteSettings.value.hero.description,
  ogImage: () => toAbsoluteUrl(siteUrl.value, siteSettings.value.hero.imagePath),
})

useJsonLd(() => ([
  buildOrganizationSchema(siteUrl.value, siteSettings.value),
  buildBreadcrumbSchema(siteUrl.value, [
    { name: 'Anasayfa', path: '/' },
  ]),
]))
</script>

<template>
  <div class="space-y-20 pt-12 pb-10 md:space-y-28 md:pt-16 lg:pt-20">
    <UContainer as="section">
      <div class="group relative overflow-hidden rounded-[2.2rem] border border-black/5 bg-[color:var(--surface-panel-strong)] shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <div 
          ref="heroSliderRef"
          class="relative flex aspect-video sm:aspect-21/9 md:aspect-2.5/1 lg:aspect-3/1 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <template v-if="siteSettings.hero.imagePaths && siteSettings.hero.imagePaths.length">
            <img
              v-for="(path, i) in siteSettings.hero.imagePaths"
              :key="i"
              :src="path"
              :alt="siteSettings.siteName"
              class="h-full w-full shrink-0 snap-center object-cover"
            >
          </template>
          <div
            v-else
            class="h-full w-full shrink-0 snap-center bg-[linear-gradient(135deg,rgba(229,243,238,0.96),rgba(211,231,240,0.92))]"
          />
        </div>
        <button 
          class="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
          @click="scrollHero('left')"
        >
          <UIcon name="lucide:chevron-left" class="h-5 w-5" />
        </button>
        <button 
          class="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
          @click="scrollHero('right')"
        >
          <UIcon name="lucide:chevron-right" class="h-5 w-5" />
        </button>
      </div>
    </UContainer>

    <UContainer as="section" class="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
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
    </UContainer>

    <UContainer as="section">
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
    </UContainer>

    <UContainer as="section" class="space-y-8">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="space-y-4">
          <p class="section-kicker">
            Katalog
          </p>
          <h2 class="section-heading">
            {{ siteSettings.featuredSectionTitle }}
          </h2>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex gap-2 md:hidden">
            <button class="flex h-10 w-10 items-center justify-center rounded-full surface-panel-strong transition-colors hover:bg-[color:var(--brand-green)] hover:text-white" @click="scrollFeatured('left')">
              <UIcon name="lucide:chevron-left" class="h-5 w-5" />
            </button>
            <button class="flex h-10 w-10 items-center justify-center rounded-full surface-panel-strong transition-colors hover:bg-[color:var(--brand-green)] hover:text-white" @click="scrollFeatured('right')">
              <UIcon name="lucide:chevron-right" class="h-5 w-5" />
            </button>
          </div>
          <NuxtLink to="/urunler" class="button-secondary justify-center">
            Tüm Ürünleri Göster
          </NuxtLink>
        </div>
      </div>

      <div class="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div 
          ref="featuredSliderRef"
          class="flex snap-x snap-mandatory gap-5 overflow-x-auto pt-3 pb-6 [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent_0,black_18px,black_calc(100%-18px),transparent_100%)] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible md:pt-0 md:[mask-image:none] lg:grid-cols-4"
        >
          <SiteProductCard
            v-for="(product, index) in featuredProductsForHome"
            :key="product.id"
            :product="product"
            :brand-name="brandList.find(brand => brand.id === product.brandId)?.name"
            :whatsapp-number="siteSettings.whatsappNumber"
            :class="[
              'w-[80vw] min-w-[280px] shrink-0 snap-start sm:w-[300px] md:w-auto md:min-w-0 md:shrink md:snap-none',
              index === 3 ? 'md:hidden lg:block' : ''
            ]"
          />
        </div>
      </div>
    </UContainer>

    <UContainer as="section">
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
    </UContainer>
  </div>
</template>
