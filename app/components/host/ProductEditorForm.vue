<script setup lang="ts">
import type { Brand, Product } from '~~/shared/catalog'
import { reactive, ref, watch } from 'vue'
import { createSlugFromText } from '~~/shared/catalog'

const props = defineProps<{
  mode: 'create' | 'edit'
  brands: Brand[]
  products: Product[]
  initialProduct?: Product | null
}>()

const route = useRoute()
const { uploadImage, uploading, uploadError } = useHostUpload()

const statusMessage = ref('')
const errorMessage = ref('')
const saving = ref(false)
const deleteRequested = ref(false)

function createFormState(product?: Product | null) {
  return {
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    shortDescription: product?.shortDescription ?? '',
    technicalDetailsText: (product?.technicalDetails ?? []).join('\n'),
    brandId: product?.brandId ?? '',
    category: product?.category ?? '',
    stockStatus: product?.stockStatus ?? 'stokta',
    whatsappMessage: product?.whatsappMessage ?? '',
    imagePaths: [...(product?.imagePaths ?? [])],
    relatedProductIds: [...(product?.relatedProductIds ?? [])],
    featured: product?.featured ?? false,
    seoTitle: product?.seoTitle ?? '',
    seoDescription: product?.seoDescription ?? '',
  }
}

const form = reactive(createFormState(props.initialProduct))

watch(() => props.initialProduct, (product) => {
  Object.assign(form, createFormState(product))
})

async function onUploadChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  try {
    const imagePath = await uploadImage(file)
    form.imagePaths = [...form.imagePaths, imagePath]
    statusMessage.value = 'Görsel yüklendi.'
  }
  catch {
    errorMessage.value = uploadError.value || 'Görsel yüklenemedi.'
  }
  finally {
    input.value = ''
  }
}

function removeImage(imagePath: string) {
  form.imagePaths = form.imagePaths.filter(path => path !== imagePath)
}

async function saveProduct() {
  statusMessage.value = ''
  errorMessage.value = ''
  saving.value = true

  try {
    const payload = {
      name: form.name,
      slug: form.slug || createSlugFromText(form.name),
      shortDescription: form.shortDescription,
      technicalDetails: form.technicalDetailsText,
      brandId: form.brandId,
      category: form.category,
      stockStatus: form.stockStatus,
      whatsappMessage: form.whatsappMessage,
      imagePaths: form.imagePaths,
      relatedProductIds: form.relatedProductIds,
      featured: form.featured,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
    }

    if (props.mode === 'create') {
      const createdProduct = await $fetch<Product>('/api/host/products', {
        method: 'POST',
        body: payload,
      })

      await refreshNuxtData()
      await navigateTo(`/host/urunler/${createdProduct.id}`)
      return
    }

    await $fetch(`/api/host/products/${props.initialProduct?.id}`, {
      method: 'PUT',
      body: payload,
    })

    statusMessage.value = 'Ürün kaydedildi.'
    await refreshNuxtData()
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Kaydetme işlemi başarısız oldu.'
  }
  finally {
    saving.value = false
  }
}

async function deleteProduct() {
  if (!props.initialProduct?.id) {
    return
  }

  if (!deleteRequested.value) {
    deleteRequested.value = true
    errorMessage.value = 'Bu ürünü silmek istediğinize emin misiniz? Tekrar tıklarsanız ürün kalıcı olarak silinir.'
    return
  }

  await $fetch(`/api/host/products/${props.initialProduct.id}`, {
    method: 'DELETE',
  })

  await refreshNuxtData()
  await navigateTo('/host/urunler')
}
</script>

<template>
  <form class="space-y-8" @submit.prevent="saveProduct">
    <section class="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
      <div class="space-y-5">
        <div>
          <label class="field-label" for="product-name">Ürün Adı</label>
          <input id="product-name" v-model="form.name" class="input-shell" required>
        </div>
        <div>
          <label class="field-label" for="product-slug">Slug</label>
          <input id="product-slug" v-model="form.slug" class="input-shell" placeholder="otomatik olusturulur">
        </div>
        <div>
          <label class="field-label" for="product-short-description">Kısa Açıklama</label>
          <textarea id="product-short-description" v-model="form.shortDescription" class="textarea-shell" />
        </div>
        <div>
          <label class="field-label" for="product-technical-details">Teknik Bilgiler</label>
          <textarea
            id="product-technical-details"
            v-model="form.technicalDetailsText"
            class="textarea-shell"
            placeholder="Her satıra bir teknik bilgi girin"
          />
        </div>
      </div>

      <div class="space-y-5">
        <div>
          <label class="field-label" for="product-brand">Marka</label>
          <select id="product-brand" v-model="form.brandId" class="select-shell">
            <option value="">
              Marka Seçin
            </option>
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">
              {{ brand.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="field-label" for="product-category">Kategori</label>
          <input id="product-category" v-model="form.category" class="input-shell">
        </div>
        <div>
          <label class="field-label" for="product-stock-status">Stok Durumu</label>
          <select id="product-stock-status" v-model="form.stockStatus" class="select-shell">
            <option value="stokta">
              Stokta
            </option>
            <option value="sinirli">
              Sınırlı Stok
            </option>
            <option value="temin">
              Temin Edilir
            </option>
          </select>
        </div>
        <div>
          <label class="field-label" for="product-whatsapp-message">WhatsApp Mesajı</label>
          <textarea id="product-whatsapp-message" v-model="form.whatsappMessage" class="textarea-shell" />
        </div>
        <label class="surface-panel flex items-center justify-between rounded-[1.5rem] px-4 py-4">
          <span class="text-sm font-semibold">Öne çıkan ürünlerde göster</span>
          <input v-model="form.featured" type="checkbox" class="h-4 w-4">
        </label>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <div class="space-y-5">
        <div>
          <label class="field-label" for="product-seo-title">SEO Title</label>
          <input id="product-seo-title" v-model="form.seoTitle" class="input-shell">
        </div>
        <div>
          <label class="field-label" for="product-seo-description">SEO Description</label>
          <textarea id="product-seo-description" v-model="form.seoDescription" class="textarea-shell" />
        </div>
        <div>
          <label class="field-label" for="product-upload">Ürün Görselleri</label>
          <input id="product-upload" type="file" accept="image/*" class="input-shell" @change="onUploadChange">
          <p class="mt-2 text-xs text-[color:var(--text-muted)]">
            {{ uploading ? 'Görsel yükleniyor...' : 'Yüklenen görseller aşağıya eklenir.' }}
          </p>
          <p v-if="uploadError" class="mt-2 text-sm text-red-500">
            {{ uploadError }}
          </p>
        </div>
        <div class="grid gap-3 md:grid-cols-2">
          <div
            v-for="imagePath in form.imagePaths"
            :key="imagePath"
            class="surface-panel rounded-[1.4rem] p-3"
          >
            <img :src="imagePath" :alt="imagePath" class="aspect-[4/3] w-full rounded-2xl object-cover">
            <button type="button" class="button-secondary mt-3 w-full justify-center" @click="removeImage(imagePath)">
              Görseli Kaldır
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <p class="field-label">
          Benzer Ürünler
        </p>
        <div class="grid gap-3">
          <label
            v-for="product in products.filter(item => item.id !== initialProduct?.id)"
            :key="product.id"
            class="surface-panel flex items-start gap-3 rounded-[1.4rem] px-4 py-3"
          >
            <input
              v-model="form.relatedProductIds"
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
      </div>
    </section>

    <div class="flex flex-col gap-3 border-t border-[color:var(--surface-border)] pt-6 md:flex-row md:items-center md:justify-between">
      <div class="flex flex-wrap gap-3">
        <button type="submit" class="button-primary" :disabled="saving">
          {{ saving ? 'Kaydediliyor...' : 'Kaydet' }}
        </button>
        <NuxtLink
          v-if="form.slug"
          :to="`/urun/${form.slug}`"
          target="_blank"
          class="button-secondary"
        >
          Önizleme
        </NuxtLink>
        <button
          v-if="mode === 'edit'"
          type="button"
          class="button-secondary"
          @click="deleteProduct"
        >
          {{ deleteRequested ? 'Silmeyi Onayla' : 'Ürünü Sil' }}
        </button>
      </div>

      <div class="text-sm">
        <p v-if="statusMessage" class="text-emerald-600">
          {{ statusMessage }}
        </p>
        <p v-if="errorMessage" class="text-red-500">
          {{ errorMessage }}
        </p>
        <p class="mt-1 text-[color:var(--text-muted)]">
          {{ mode === 'create' ? 'Yeni ürün kaydı oluşturuluyor.' : `Düzenlenen ürün kimliği: ${route.params.id || initialProduct?.id}` }}
        </p>
      </div>
    </div>
  </form>
</template>
