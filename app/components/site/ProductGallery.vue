<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ensureProductImagePaths } from '~~/shared/catalog'

const props = defineProps<{
  imagePaths: string[]
  productName: string
}>()

const activeIndex = ref(0)
const galleryImages = computed(() => ensureProductImagePaths(props.imagePaths))

watch(() => props.imagePaths, () => {
  activeIndex.value = 0
})

const activeImage = computed(() => galleryImages.value[activeIndex.value] || galleryImages.value[0])

function showPrevious() {
  activeIndex.value = activeIndex.value === 0 ? galleryImages.value.length - 1 : activeIndex.value - 1
}

function showNext() {
  activeIndex.value = activeIndex.value === galleryImages.value.length - 1 ? 0 : activeIndex.value + 1
}
</script>

<template>
  <div class="space-y-4">
    <div class="surface-panel-strong relative overflow-hidden rounded-[2rem]">
      <img :src="activeImage" :alt="productName" class="aspect-[4/3] w-full object-cover">

      <div v-if="galleryImages.length > 1" class="absolute inset-x-4 bottom-4 flex items-center justify-between">
        <button type="button" class="button-secondary px-4 py-2" @click="showPrevious">
          Geri
        </button>
        <button type="button" class="button-secondary px-4 py-2" @click="showNext">
          İleri
        </button>
      </div>
    </div>

    <div v-if="galleryImages.length > 1" class="grid grid-cols-3 gap-3">
      <button
        v-for="(image, index) in galleryImages"
        :key="image"
        type="button"
        class="overflow-hidden rounded-2xl border transition"
        :class="index === activeIndex ? 'border-[color:var(--brand-green)]' : 'border-[color:var(--surface-border)]'"
        @click="activeIndex = index"
      >
        <img :src="image" :alt="`${productName} ${index + 1}`" class="aspect-[4/3] w-full object-cover">
      </button>
    </div>
  </div>
</template>
