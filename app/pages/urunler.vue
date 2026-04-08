<script setup lang="ts">
import type { Brand, Product, SiteSettings, StockStatus } from '~~/shared/catalog'
import { computed, reactive, watch } from 'vue'
import { defaultSiteSettings, filterCatalogProducts } from '~~/shared/catalog'
import { buildBreadcrumbSchema, buildOrganizationSchema, toAbsoluteUrl } from '~/utils/seo'

const siteUrl = useSiteUrl()
const route = useRoute()
const router = useRouter()

const { data: products } = await useAsyncData<Product[]>('catalog-products', () => $fetch('/api/products'))
const { data: brands } = await useAsyncData<Brand[]>('brands', () => $fetch('/api/brands'))
const { data: settings } = await useAsyncData<SiteSettings>('site-settings', () => $fetch('/api/site-settings'))

const siteSettings = computed(() => settings.value ?? defaultSiteSettings)
const brandList = computed(() => brands.value ?? [])
const productList = computed(() => products.value ?? [])

const filters = reactive<{
  search: string
  brand: string
  category: string
  stock: StockStatus | ''
}>({
  search: '',
  brand: '',
  category: '',
  stock: '',
})

function syncFiltersFromRoute() {
  filters.search = typeof route.query.search === 'string' ? route.query.search : ''
  filters.brand = typeof route.query.brand === 'string' ? route.query.brand : ''
  filters.category = typeof route.query.category === 'string' ? route.query.category : ''
  filters.stock = typeof route.query.stock === 'string' ? route.query.stock as StockStatus : ''
}

function syncRouteFromFilters() {
  const nextQuery = {
    ...(filters.search ? { search: filters.search } : {}),
    ...(filters.brand ? { brand: filters.brand } : {}),
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.stock ? { stock: filters.stock } : {}),
  }

  const currentQuery = JSON.stringify(route.query)
  const nextQueryString = JSON.stringify(nextQuery)

  if (currentQuery !== nextQueryString) {
    router.replace({ query: nextQuery })
  }
}

syncFiltersFromRoute()

watch(() => route.query, syncFiltersFromRoute)
watch([
  () => filters.search,
  () => filters.brand,
  () => filters.category,
  () => filters.stock,
], syncRouteFromFilters)

const categories = computed(() => {
  return [...new Set(productList.value.map(product => product.category).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, 'tr'))
})

const filteredProducts = computed(() => filterCatalogProducts(productList.value, brandList.value, {
  search: filters.search,
  brand: filters.brand,
  category: filters.category,
  stockStatus: filters.stock,
}))

useSeoMeta({
  title: () => `Ürünler | ${siteSettings.value.siteName}`,
  description: () => 'PLC, HMI, sürücü, güvenlik ve sensör ürünlerini filtreleyerek inceleyin.',
  ogTitle: () => `Ürünler | ${siteSettings.value.siteName}`,
  ogDescription: () => 'Marka, kategori ve stok durumuna göre otomasyon ürünleri kataloğu.',
  ogImage: () => toAbsoluteUrl(siteUrl.value, siteSettings.value.hero.imagePath),
})

useJsonLd(() => ([
  buildOrganizationSchema(siteUrl.value, siteSettings.value),
  buildBreadcrumbSchema(siteUrl.value, [
    { name: 'Anasayfa', path: '/' },
    { name: 'Ürünler', path: '/urunler' },
  ]),
]))
</script>

<template>
  <UContainer class="space-y-12 pb-12">
    <section class="surface-panel-strong rounded-[2.4rem] p-8 md:p-10">
      <div class="space-y-4">
        <h1 class="section-heading">
          Tüm Ürünler
        </h1>
        <p class="section-copy max-w-3xl">
          Marka ve kategori bazında filtrelenebilir ürün arşivimiz. Arama kutusunu kullanarak ürün adına göre filtreleyebilir, marka ve stok durumunu kolayca yönetebilirsiniz.
        </p>
      </div>
    </section>

    <section class="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
      <input
        v-model="filters.search"
        type="search"
        placeholder="Ürün ara"
        class="input-shell"
      >

      <select v-model="filters.brand" class="select-shell">
        <option value="">
          Tüm Markalar
        </option>
        <option v-for="brand in brandList" :key="brand.id" :value="brand.slug">
          {{ brand.name }}
        </option>
      </select>

      <select v-model="filters.category" class="select-shell">
        <option value="">
          Tüm Kategoriler
        </option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>

      <select v-model="filters.stock" class="select-shell">
        <option value="">
          Tüm Stok Durumları
        </option>
        <option value="stokta">
          Stokta
        </option>
        <option value="sinirli">
          Sınırlı Stok
        </option>
        <option value="temin">
          Temin Edilir
        </option>
      </select>
    </section>

    <section v-if="filteredProducts.length" class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <SiteProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        :brand-name="brandList.find(brand => brand.id === product.brandId)?.name"
        :whatsapp-number="siteSettings.whatsappNumber"
      />
    </section>

    <section v-else class="surface-panel-strong rounded-[2rem] p-10 text-center">
      <p class="text-lg font-semibold">
        Bu filtrelerle eşleşen ürün bulunamadı.
      </p>
      <p class="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
        Farklı bir marka veya kategori deneyebilir ya da doğrudan WhatsApp üzerinden bize yazabilirsiniz.
      </p>
      <div class="mt-6 flex justify-center">
        <SiteWhatsAppButton
          :phone="siteSettings.whatsappNumber"
          message="Merhaba, ürün kataloğunda aradığım ürünü bulamadım. Yardımcı olabilir misiniz?"
        />
      </div>
    </section>
  </UContainer>
</template>
