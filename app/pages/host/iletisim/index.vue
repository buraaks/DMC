<script setup lang="ts">
import type { SiteSettings } from '~~/shared/catalog'
import { defaultSiteSettings } from '~~/shared/catalog'

definePageMeta({
  layout: 'host',
})

const { data: settings } = await useAsyncData<SiteSettings>('site-settings', () => $fetch('/api/site-settings'))

function cloneSettings(source: SiteSettings) {
  return JSON.parse(JSON.stringify(source)) as SiteSettings
}

const form = reactive(cloneSettings(settings.value ?? defaultSiteSettings))
const saving = ref(false)
const statusMessage = ref('')
const errorMessage = ref('')

async function saveContactDetails() {
  saving.value = true
  statusMessage.value = ''
  errorMessage.value = ''

  try {
    await $fetch('/api/host/site-settings', {
      method: 'PUT',
      body: form,
    })
    statusMessage.value = 'İletişim bilgileri güncellendi.'
    await refreshNuxtData()
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Kaydetme işlemi başarısız oldu.'
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-8">
    <section>
      <p class="section-kicker">
        İletişim Bilgileri Yönetimi
      </p>
      <h1 class="mt-3 text-4xl font-semibold">
        Footer ve iletişim sayfası verileri
      </h1>
    </section>

    <form class="space-y-6" @submit.prevent="saveContactDetails">
      <section class="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div class="space-y-5">
          <div>
            <label class="field-label">İletişim Başlığı</label>
            <input v-model="form.contactTitle" class="input-shell">
          </div>
          <div>
            <label class="field-label">İletişim Açıklaması</label>
            <textarea v-model="form.contactIntro" class="textarea-shell" />
          </div>
          <div>
            <label class="field-label">Adres</label>
            <textarea v-model="form.address" class="textarea-shell" />
          </div>
          <div>
            <label class="field-label">Google Maps Konum Linki</label>
            <input v-model="form.mapUrl" class="input-shell" placeholder="Google Haritalar linki veya embed kodu">
          </div>
        </div>

        <div class="space-y-5">
          <div>
            <label class="field-label">Telefon</label>
            <input v-model="form.phone" class="input-shell">
          </div>
          <div>
            <label class="field-label">E-Posta</label>
            <input v-model="form.email" class="input-shell">
          </div>
          <div>
            <label class="field-label">WhatsApp Numarası</label>
            <input v-model="form.whatsappNumber" class="input-shell">
          </div>
        </div>
      </section>

      <section class="grid gap-5 md:grid-cols-2">
        <div>
          <label class="field-label">Instagram</label>
          <input v-model="form.socialLinks.instagram" class="input-shell">
        </div>
        <div>
          <label class="field-label">WhatsApp Linki</label>
          <input v-model="form.socialLinks.whatsapp" class="input-shell">
        </div>
        <div>
          <label class="field-label">Facebook</label>
          <input v-model="form.socialLinks.facebook" class="input-shell">
        </div>
        <div>
          <label class="field-label">LinkedIn</label>
          <input v-model="form.socialLinks.linkedin" class="input-shell">
        </div>
      </section>

      <div class="flex flex-col gap-3 border-t border-[color:var(--surface-border)] pt-6 md:flex-row md:items-center md:justify-between">
        <button type="submit" class="button-primary" :disabled="saving">
          {{ saving ? 'Kaydediliyor...' : 'Kaydet' }}
        </button>
        <div class="text-sm">
          <p v-if="statusMessage" class="text-emerald-600">
            {{ statusMessage }}
          </p>
          <p v-if="errorMessage" class="text-red-500">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </form>
  </div>
</template>
