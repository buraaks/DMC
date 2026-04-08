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
  <UButton
    :to="href"
    target="_blank"
    size="lg"
    color="primary"
    :block="fullWidth"
    class="button-whatsapp border-0"
  >
    <template #leading>
      <UIcon name="mdi:whatsapp" class="h-5 w-5" />
    </template>
    WhatsApp Sipariş
  </UButton>
</template>
