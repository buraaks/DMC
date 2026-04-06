<script setup lang="ts">
import type { Brand, Product } from '~~/shared/catalog'

definePageMeta({
  layout: 'host',
})

const route = useRoute()
const { data: products } = await useAsyncData<Product[]>('host-products', () => $fetch('/api/products'))
const { data: brands } = await useAsyncData<Brand[]>('host-brands', () => $fetch('/api/brands'))

const currentProduct = computed(() => (products.value ?? []).find(product => product.id === route.params.id))

if (!currentProduct.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Düzenlenecek ürün bulunamadı.',
  })
}
</script>

<template>
  <div class="space-y-8">
    <section>
      <p class="section-kicker">
        Ürün Düzenleme
      </p>
      <h1 class="mt-3 text-4xl font-semibold">
        {{ currentProduct?.name }}
      </h1>
    </section>

    <HostProductEditorForm
      mode="edit"
      :initial-product="currentProduct || undefined"
      :brands="brands || []"
      :products="products || []"
    />
  </div>
</template>
