<script setup lang="ts">
import type { StockStatus } from '~~/shared/catalog'
import { computed } from 'vue'
import { stockStatusLabels } from '~~/shared/catalog'

const props = defineProps<{
  status: StockStatus
}>()

const tone = computed(() => {
  if (props.status === 'stokta') {
    return 'text-emerald-700'
  }

  if (props.status === 'sinirli') {
    return 'text-amber-700'
  }

  return 'text-sky-700'
})
</script>

<template>
  <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" :class="tone">
    {{ stockStatusLabels[status] }}
  </span>
</template>
