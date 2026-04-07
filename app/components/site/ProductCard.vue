<script setup lang="ts">
import type { Product } from '~~/shared/catalog'
import { computed } from 'vue'
import { getPrimaryProductImagePath } from '~~/shared/catalog'

const props = defineProps<{
  product: Product
  brandName?: string
  whatsappNumber?: string
  adminHref?: string
}>()

const primaryImagePath = computed(() => getPrimaryProductImagePath(props.product.imagePaths))

function openCard() {
  if (props.adminHref) {
    return navigateTo(props.adminHref)
  }

  return navigateTo(`/urun/${props.product.slug}`)
}
</script>

<template>
  <article
    class="surface-panel-strong card-lift group flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.75rem]"
    @click="openCard"
  >
    <div class="relative aspect-[16/11] overflow-hidden">
      <img
        :src="primaryImagePath"
        :alt="product.name"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
      >
      <div class="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
        <span v-if="brandName" class="muted-chip">
          {{ brandName }}
        </span>
        <SiteStockBadge :status="product.stockStatus" />
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-4 p-5">
      <div class="space-y-3">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
          {{ product.category }}
        </p>
        <h3 class="text-xl font-semibold leading-tight">
          {{ product.name }}
        </h3>
        <p class="line-clamp-3 text-sm leading-6 text-[color:var(--text-secondary)]">
          {{ product.shortDescription }}
        </p>
      </div>

      <div class="mt-auto pt-2 space-y-4">
        <div class="flex items-center gap-2 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[color:var(--brand-green)]"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          <span :class="product.priceText ? 'text-lg text-[color:var(--text-main)]' : 'text-sm text-[color:var(--text-secondary)]'">
            {{ product.priceText || 'Fiyat için iletişime geçin' }}
          </span>
        </div>

        <template v-if="whatsappNumber">
          <SiteWhatsAppButton
            :phone="whatsappNumber"
            :message="product.whatsappMessage"
            full-width
            @click.stop
          />
        </template>
        <template v-else-if="adminHref">
          <NuxtLink
            :to="adminHref"
            class="button-secondary w-full justify-center"
            @click.stop
          >
            Düzenle
          </NuxtLink>
        </template>
      </div>
    </div>
  </article>
</template>
