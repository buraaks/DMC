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
    <section>
      <p class="section-kicker">
        Yeni Ürün
      </p>
      <h1 class="mt-3 text-4xl font-semibold">
        Kataloğa yeni ürün ekleyin
      </h1>
    </section>

    <HostProductEditorForm
      mode="create"
      :brands="brands || []"
      :products="products || []"
    />
  </div>
</template>
