<script setup lang="ts">
import { computed } from 'vue'
import { buildWhatsAppLink } from '~~/shared/catalog'

const props = withDefaults(defineProps<{
  phone: string
  message: string
  fullWidth?: boolean
}>(), {
  fullWidth: false,
})

const href = computed(() => buildWhatsAppLink(props.phone, props.message))
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noreferrer"
    class="button-whatsapp"
    :class="fullWidth ? 'w-full' : ''"
  >
    <UIcon name="mdi:whatsapp" class="h-5 w-5" />
    <span>WhatsApp Sipariş</span>
  </a>
</template>
