<script setup lang="ts">
import type { Brand, Product } from '~~/shared/catalog'

definePageMeta({
  layout: 'host',
})

const { data: products } = await useAsyncData<Product[]>('host-products', () => $fetch('/api/products'))
const { data: brands } = await useAsyncData<Brand[]>('host-brands', () => $fetch('/api/brands'))

const latestProducts = computed(() => (products.value ?? []).slice(0, 4))
</script>

<template>
  <div class="space-y-8">
    <section class="space-y-3">
      <p class="section-kicker">
        Dashboard
      </p>
      <h1 class="text-4xl font-semibold">
        Site yönetim özeti
      </h1>
      <p class="max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
        Ürün sayısı, aktif markalar ve hızlı düzenleme bağlantıları bu ekranda toplanır.
      </p>
    </section>

    <section class="host-grid">
      <div class="surface-panel stat-block">
        <p class="field-label">
          Toplam Ürün
        </p>
        <p class="text-4xl font-semibold">
          {{ products?.length || 0 }}
        </p>
      </div>
      <div class="surface-panel stat-block">
        <p class="field-label">
          Aktif Marka
        </p>
        <p class="text-4xl font-semibold">
          {{ brands?.length || 0 }}
        </p>
      </div>
      <div class="surface-panel stat-block">
        <p class="field-label">
          Öne Çıkan
        </p>
        <p class="text-4xl font-semibold">
          {{ products?.filter(product => product.featured).length || 0 }}
        </p>
      </div>
      <div class="surface-panel stat-block">
        <p class="field-label">
          Hızlı Erişim
        </p>
        <NuxtLink to="/host/urunler/yeni" class="button-secondary mt-3 justify-center">
          Yeni Ürün
        </NuxtLink>
      </div>
    </section>

    <section class="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <div class="surface-panel rounded-[2rem] p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="field-label">
              Son Eklenen Ürünler
            </p>
            <h2 class="text-2xl font-semibold">
              Son kayıtlara hızlı erişim
            </h2>
          </div>
          <NuxtLink to="/host/urunler" class="button-secondary">
            Tümü
          </NuxtLink>
        </div>

        <div class="mt-6 grid gap-3">
          <NuxtLink
            v-for="product in latestProducts"
            :key="product.id"
            :to="`/host/urunler/${product.id}`"
            class="surface-panel-strong rounded-[1.4rem] px-4 py-4"
          >
            <p class="text-sm font-semibold">
              {{ product.name }}
            </p>
            <p class="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
              {{ product.category }}
            </p>
          </NuxtLink>
        </div>
      </div>

      <div class="surface-panel rounded-[2rem] p-6">
        <p class="field-label">
          Hızlı Düzenleme
        </p>
        <div class="mt-4 grid gap-3">
          <NuxtLink to="/host/ozellestirme" class="button-secondary justify-center">
            Banner ve Anasayfa
          </NuxtLink>
          <NuxtLink to="/host/iletisim" class="button-secondary justify-center">
            İletişim Bilgileri
          </NuxtLink>
          <NuxtLink to="/host/markalar" class="button-secondary justify-center">
            Marka Yönetimi
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
