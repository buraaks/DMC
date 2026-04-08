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
      if (!Array.isArray(form.hero.imagePaths)) {
        form.hero.imagePaths = []
      }
      form.hero.imagePaths.push(imagePath)
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
            <label class="field-label">Banner Görselleri (Slider)</label>
            <p class="mb-3 text-sm text-[color:var(--text-muted)]">
              Anasayfa giriş alanında gösterilecek banner görselleri.
            </p>
            <input type="file" accept="image/*" class="input-shell" @change="(event) => uploadInto('heroImagePath', event)">
            <div class="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
              <div v-for="(path, i) in form.hero.imagePaths" :key="i" class="relative group">
                <img :src="path" alt="Banner görseli" class="aspect-[16/10] w-full rounded-[1rem] object-cover">
                <button type="button" @click="form.hero.imagePaths.splice(i, 1)" class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-black shadow hover:bg-red-500 hover:text-white transition-colors">
                  <UIcon name="lucide:x" class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <p v-if="!form.hero.imagePaths || form.hero.imagePaths.length === 0" class="mt-3 text-sm text-red-500">En az bir görsel eklemelisiniz.</p>
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
          Anasayfada Gösterilecek 4 Ürün
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
