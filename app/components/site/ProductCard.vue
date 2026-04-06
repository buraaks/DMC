<script setup lang="ts">
import type { Product } from '~~/shared/catalog'

const props = defineProps<{
  product: Product
  brandName?: string
  whatsappNumber?: string
  adminHref?: string
}>()

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
        :src="product.imagePaths[0]"
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

      <div class="mt-auto pt-2">
        <SiteWhatsAppButton
          v-if="whatsappNumber"
          :phone="whatsappNumber"
          :message="product.whatsappMessage"
          full-width
          @click.stop
        />
        <NuxtLink
          v-else-if="adminHref"
          :to="adminHref"
          class="button-secondary w-full justify-center"
          @click.stop
        >
          Düzenle
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
