<script setup lang="ts">
import type { Product, SiteSettings } from '~~/shared/catalog'
import { defaultSiteSettings } from '~~/shared/catalog'

definePageMeta({
  layout: 'host',
})

const { data: settings } = await useAsyncData<SiteSettings>('site-settings', () => $fetch('/api/site-settings'))
const { data: products } = await useAsyncData<Product[]>('host-products', () => $fetch('/api/products'))

const { uploadImage, uploading, uploadError } = useHostUpload()
const saving = ref(false)
const statusMessage = ref('')
const errorMessage = ref('')

function cloneSettings(source: SiteSettings) {
  return JSON.parse(JSON.stringify(source)) as SiteSettings
}

const form = reactive(cloneSettings(settings.value ?? defaultSiteSettings))

async function uploadInto(target: 'logoPath' | 'heroImagePath', event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  try {
    const imagePath = await uploadImage(file)

    if (target === 'logoPath') {
      form.logoPath = imagePath
    }
    else {
      form.hero.imagePath = imagePath
    }
  }
  finally {
    input.value = ''
  }
}

async function saveSettings() {
  saving.value = true
  statusMessage.value = ''
  errorMessage.value = ''

  try {
    await $fetch('/api/host/site-settings', {
      method: 'PUT',
      body: form,
    })
    statusMessage.value = 'Sayfa özelleştirmeleri kaydedildi.'
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
        Sayfa Özelleştirme
      </p>
      <h1 class="mt-3 text-4xl font-semibold">
        Banner görseli, anasayfa içerikleri ve öne çıkan ürünler
      </h1>
    </section>

    <form class="space-y-8" @submit.prevent="saveSettings">
      <section class="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div class="space-y-5">
          <div>
            <label class="field-label">Site Adı</label>
            <input v-model="form.siteName" class="input-shell">
          </div>
          <div>
            <label class="field-label">Site Alt Başlığı</label>
            <input v-model="form.siteTagline" class="input-shell">
          </div>
          <div>
            <label class="field-label">Anasayfa SEO Açıklaması</label>
            <textarea v-model="form.hero.description" class="textarea-shell" />
          </div>
          <div>
            <label class="field-label">Banner Görseli</label>
            <p class="mb-3 text-sm text-[color:var(--text-muted)]">
              Anasayfa giriş alanında yalnızca bu görsel gösterilir.
            </p>
            <input type="file" accept="image/*" class="input-shell" @change="(event) => uploadInto('heroImagePath', event)">
            <img :src="form.hero.imagePath" alt="Banner görseli" class="mt-3 aspect-[16/10] w-full rounded-[1.5rem] object-cover">
          </div>
        </div>

        <div class="space-y-5">
          <div>
            <label class="field-label">Hakkımızda Başlığı</label>
            <input v-model="form.aboutTitle" class="input-shell">
          </div>
          <div>
            <label class="field-label">Hakkımızda Metni</label>
            <textarea v-model="form.aboutBody" class="textarea-shell" />
          </div>
          <div>
            <label class="field-label">Öne Çıkan Ürünler Başlığı</label>
            <input v-model="form.featuredSectionTitle" class="input-shell">
          </div>
          <div>
            <label class="field-label">Logo</label>
            <input type="file" accept="image/*" class="input-shell" @change="(event) => uploadInto('logoPath', event)">
            <div class="mt-3 rounded-[1.5rem] border border-[color:var(--surface-border)] bg-white/75 px-5 py-4">
              <img :src="form.logoPath" alt="Site logosu" class="h-16 w-auto max-w-full object-contain">
            </div>
          </div>
          <div>
            <label class="field-label">Footer Notu</label>
            <textarea v-model="form.footerNote" class="textarea-shell" />
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <p class="field-label">
          Anasayfada Gösterilecek 5 Ürün
        </p>
        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <label
            v-for="product in products"
            :key="product.id"
            class="surface-panel flex items-start gap-3 rounded-[1.5rem] px-4 py-4"
          >
            <input
              v-model="form.featuredProductIds"
              :value="product.id"
              type="checkbox"
              class="mt-1 h-4 w-4"
            >
            <div>
              <p class="text-sm font-semibold">
                {{ product.name }}
              </p>
              <p class="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                {{ product.category }}
              </p>
            </div>
          </label>
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
          <p v-if="uploading" class="text-[color:var(--text-muted)]">
            Görsel yükleniyor...
          </p>
          <p v-if="uploadError" class="text-red-500">
            {{ uploadError }}
          </p>
        </div>
      </div>
    </form>
  </div>
</template>
