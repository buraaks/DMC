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
    class="surface-panel-strong card-lift group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl"
    role="link"
    tabindex="0"
    @click="openCard"
    @keydown.enter="openCard"
    @keydown.space.prevent="openCard"
  >
    <div class="relative aspect-16/11 overflow-hidden">
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
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-(--text-muted)">
          {{ product.category }}
        </p>
        <h3 class="text-xl font-semibold leading-tight">
          {{ product.name }}
        </h3>
        <p class="line-clamp-3 text-sm leading-6 text-(--text-secondary)">
          {{ product.shortDescription }}
        </p>
      </div>

      <div class="mt-auto pt-2 space-y-4">
        <div class="flex items-center gap-2 font-medium">
          <UIcon name="lucide:tag" class="h-4.5 w-4.5 text-(--brand-green)" />
          <span :class="product.priceText ? 'text-lg text-[color:var(--text-primary)]' : 'text-sm text-(--text-secondary)'">
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
