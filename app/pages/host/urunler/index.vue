<script setup lang="ts">
import type { Brand, Product } from '~~/shared/catalog'

definePageMeta({
  layout: 'host',
})

const { data: products } = await useAsyncData<Product[]>('host-products', () => $fetch('/api/products'))
const { data: brands } = await useAsyncData<Brand[]>('host-brands', () => $fetch('/api/brands'))
</script>

<template>
  <div class="space-y-8">
    <section class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="section-kicker">
          Ürün Yönetimi
        </p>
        <h1 class="mt-3 text-4xl font-semibold">
          Katalog kartları ve düzenleme akışı
        </h1>
      </div>
      <NuxtLink to="/host/urunler/yeni" class="button-primary justify-center">
        Yeni Ürün Ekle
      </NuxtLink>
    </section>

    <section class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <SiteProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :brand-name="brands?.find(brand => brand.id === product.brandId)?.name"
        :admin-href="`/host/urunler/${product.id}`"
      />
    </section>
  </div>
</template>
