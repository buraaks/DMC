<script setup lang="ts">
import type { Brand, Product, StockStatus } from '~~/shared/catalog'
import { computed, reactive, ref, watch } from 'vue'
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
const warningMessage = ref('')
const errorMessage = ref('')
const saving = ref(false)
const deleteRequested = ref(false)
const pendingUpload = ref<File | null>(null)

const stockStatusItems: Array<{ label: string, value: StockStatus }> = [
  { label: 'Stokta', value: 'stokta' },
  { label: 'Sınırlı Stok', value: 'sinirli' },
  { label: 'Temin Edilir', value: 'temin' },
]

const formFieldUi = {
  label: 'text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[color:var(--text-muted)]',
  container: 'mt-2',
  description: 'mt-2 text-sm leading-6 text-[color:var(--text-muted)]',
  help: 'mt-2 text-xs text-[color:var(--text-muted)]',
  error: 'mt-2 text-sm text-red-500',
} as const

const controlShellClass = 'w-full rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-panel-strong)] px-4 py-3 text-sm text-[color:var(--text-primary)] shadow-none transition placeholder:text-[color:var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-green)]'

const inputUi = {
  base: controlShellClass,
} as const

const textareaUi = {
  base: `${controlShellClass} min-h-32 resize-y`,
} as const

const selectUi = {
  base: `${controlShellClass} justify-between`,
  placeholder: 'text-[color:var(--text-muted)]',
  content: 'rounded-2xl border border-[color:var(--surface-border)] bg-white p-1 shadow-[var(--shadow-soft)]',
  item: 'rounded-xl px-3 py-2 text-sm text-[color:var(--text-primary)] data-highlighted:not-data-disabled:before:bg-[color:var(--brand-blue-soft)]/60',
  itemDescription: 'text-[color:var(--text-muted)]',
  separator: 'bg-[color:var(--surface-border)]',
} as const

const checkboxUi = {
  root: 'rounded-[1.5rem] border border-[color:var(--surface-border)] bg-[color:var(--surface-panel)] px-4 py-4 shadow-[var(--shadow-soft)] has-data-[state=checked]:border-[color:var(--brand-green)] has-data-[state=checked]:bg-[color:var(--brand-green-soft)]/50',
  label: 'text-sm font-semibold text-[color:var(--text-primary)]',
  description: 'mt-1 text-sm leading-6 text-[color:var(--text-secondary)]',
  wrapper: 'w-full',
} as const

const checkboxGroupUi = {
  item: 'rounded-[1.4rem] border border-[color:var(--surface-border)] bg-[color:var(--surface-panel)] px-4 py-3 shadow-[var(--shadow-soft)] has-data-[state=checked]:border-[color:var(--brand-green)] has-data-[state=checked]:bg-[color:var(--brand-green-soft)]/40',
  label: 'text-sm font-semibold text-[color:var(--text-primary)]',
  description: 'mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--text-muted)]',
} as const

const fileUploadUi = {
  base: 'rounded-[1.75rem] border border-dashed border-[color:var(--surface-border)] bg-[color:var(--surface-panel-strong)] p-4 hover:bg-[color:var(--brand-blue-soft)]/20',
  wrapper: 'items-start text-left',
  label: 'mt-0 text-sm font-semibold text-[color:var(--text-primary)]',
  description: 'mt-1 text-xs text-[color:var(--text-muted)]',
} as const

function createFormState(product?: Product | null) {
  return {
    productCode: product?.productCode ?? '',
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    shortDescription: product?.shortDescription ?? '',
    priceText: product?.priceText ?? '',
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

type ProductFormState = ReturnType<typeof createFormState>

const form = reactive<ProductFormState>(createFormState(props.initialProduct))

const brandItems = computed(() => [
  { label: 'Marka Seçin', value: '' },
  ...props.brands.map(brand => ({
    label: brand.name,
    value: brand.id,
  })),
])

const relatedProductItems = computed(() => props.products
  .filter(product => product.id !== props.initialProduct?.id)
  .map(product => ({
    label: product.name,
    description: product.category,
    value: product.id,
  })))

const previewHref = computed(() => {
  const identifier = (form.productCode || form.slug || createSlugFromText(form.name)).trim()
  return identifier ? `/urun/${identifier}` : ''
})

watch(() => props.initialProduct, (product) => {
  Object.assign(form, createFormState(product))
  deleteRequested.value = false
  warningMessage.value = ''
  pendingUpload.value = null
})

function validateProductForm(state: Partial<ProductFormState>) {
  const errors = []

  if (!state.name?.trim()) {
    errors.push({
      name: 'name',
      message: 'Ürün adı gerekli.',
    })
  }

  return errors
}

async function handleUploadSelection(file: File | null | undefined) {
  if (!file) {
    return
  }

  warningMessage.value = ''
  errorMessage.value = ''

  try {
    const imagePath = await uploadImage(file)
    form.imagePaths = [...form.imagePaths, imagePath]
    statusMessage.value = `"${file.name}" eklendi.`
  }
  catch {
    errorMessage.value = uploadError.value || 'Görsel yüklenemedi.'
  }
  finally {
    pendingUpload.value = null
  }
}

function removeImage(imagePath: string) {
  form.imagePaths = form.imagePaths.filter(path => path !== imagePath)
  warningMessage.value = ''
}

async function saveProduct() {
  statusMessage.value = ''
  warningMessage.value = ''
  errorMessage.value = ''
  saving.value = true

  try {
    const payload = {
      productCode: form.productCode,
      name: form.name,
      slug: form.slug || createSlugFromText(form.name),
      shortDescription: form.shortDescription,
      priceText: form.priceText,
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

    deleteRequested.value = false
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
    warningMessage.value = 'Bu ürünü silmek istediğinize emin misiniz? Tekrar tıklarsanız ürün kalıcı olarak silinir.'
    return
  }

  warningMessage.value = ''
  errorMessage.value = ''

  try {
    await $fetch(`/api/host/products/${props.initialProduct.id}`, {
      method: 'DELETE',
    })

    await refreshNuxtData()
    await navigateTo('/host/urunler')
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Silme işlemi başarısız oldu.'
  }
}
</script>

<template>
  <UForm
    :state="form"
    :validate="validateProductForm"
    :loading-auto="false"
    class="space-y-8"
    @submit="saveProduct"
  >
    <section class="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
      <div class="space-y-5">
        <UFormField
          name="productCode"
          label="Ürün Kodu"
          :help="mode === 'create' ? 'Kaydedince otomatik üretilir (MARKA3-KATEGORI3-12345).' : 'Sistem tarafından otomatik üretilen ürün kodu.'"
          :ui="formFieldUi"
        >
          <UInput
            id="product-code"
            :model-value="form.productCode || 'Henüz oluşturulmadı'"
            variant="none"
            readonly
            :ui="inputUi"
          />
        </UFormField>

        <UFormField
          name="name"
          label="Ürün Adı"
          required
          :ui="formFieldUi"
        >
          <UInput
            id="product-name"
            v-model="form.name"
            variant="none"
            :ui="inputUi"
          />
        </UFormField>

        <UFormField
          name="slug"
          label="Slug"
          help="Boş bırakırsanız ürün adına göre otomatik oluşturulur."
          :ui="formFieldUi"
        >
          <UInput
            id="product-slug"
            v-model="form.slug"
            variant="none"
            :ui="inputUi"
          />
        </UFormField>

        <UFormField
          name="shortDescription"
          label="Kısa Açıklama"
          :ui="formFieldUi"
        >
          <UTextarea
            id="product-short-description"
            v-model="form.shortDescription"
            variant="none"
            autoresize
            :rows="4"
            :ui="textareaUi"
          />
        </UFormField>

        <UFormField
          name="priceText"
          label="Fiyat Bilgisi"
          :ui="formFieldUi"
        >
          <UInput
            id="product-price"
            v-model="form.priceText"
            variant="none"
            placeholder="Örn: 12.500 TL + KDV"
            :ui="inputUi"
          />
        </UFormField>

        <UFormField
          name="technicalDetailsText"
          label="Teknik Bilgiler"
          help="Her satıra bir teknik bilgi girin."
          :ui="formFieldUi"
        >
          <UTextarea
            id="product-technical-details"
            v-model="form.technicalDetailsText"
            variant="none"
            autoresize
            :rows="6"
            :maxrows="12"
            :ui="textareaUi"
          />
        </UFormField>
      </div>

      <div class="space-y-5">
        <UFormField
          name="brandId"
          label="Marka"
          :ui="formFieldUi"
        >
          <USelect
            id="product-brand"
            v-model="form.brandId"
            :items="brandItems"
            variant="none"
            :ui="selectUi"
          />
        </UFormField>

        <UFormField
          name="category"
          label="Kategori"
          :ui="formFieldUi"
        >
          <UInput
            id="product-category"
            v-model="form.category"
            variant="none"
            :ui="inputUi"
          />
        </UFormField>

        <UFormField
          name="stockStatus"
          label="Stok Durumu"
          :ui="formFieldUi"
        >
          <USelect
            id="product-stock-status"
            v-model="form.stockStatus"
            :items="stockStatusItems"
            variant="none"
            :ui="selectUi"
          />
        </UFormField>

        <UFormField
          name="whatsappMessage"
          label="WhatsApp Mesajı"
          :ui="formFieldUi"
        >
          <UTextarea
            id="product-whatsapp-message"
            v-model="form.whatsappMessage"
            variant="none"
            autoresize
            :rows="4"
            :ui="textareaUi"
          />
        </UFormField>

        <UCheckbox
          v-model="form.featured"
          color="primary"
          variant="card"
          indicator="end"
          label="Öne çıkan ürünlerde göster"
          description="Seçiliyse anasayfa veya vitrin alanlarında öncelikli gösterilir."
          :ui="checkboxUi"
        />
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <div class="space-y-5">
        <UFormField
          name="seoTitle"
          label="SEO Title"
          :ui="formFieldUi"
        >
          <UInput
            id="product-seo-title"
            v-model="form.seoTitle"
            variant="none"
            :ui="inputUi"
          />
        </UFormField>

        <UFormField
          name="seoDescription"
          label="SEO Description"
          :ui="formFieldUi"
        >
          <UTextarea
            id="product-seo-description"
            v-model="form.seoDescription"
            variant="none"
            autoresize
            :rows="4"
            :ui="textareaUi"
          />
        </UFormField>

        <UFormField
          name="imagePaths"
          label="Ürün Görselleri"
          help="Yüklenen görseller aşağıdaki listeye eklenir."
          :ui="formFieldUi"
        >
          <div class="space-y-4">
            <UFileUpload
              v-model="pendingUpload"
              accept="image/*"
              color="primary"
              highlight
              label="Görsel yükleyin"
              description="PNG, JPG veya WebP dosyası ekleyebilirsiniz."
              :disabled="uploading"
              :ui="fileUploadUi"
              @update:model-value="handleUploadSelection"
            />

            <UAlert
              v-if="uploading"
              color="info"
              variant="soft"
              icon="lucide:loader-circle"
              title="Görsel yükleniyor..."
              class="rounded-[1.5rem]"
            />

            <div v-if="form.imagePaths.length" class="grid gap-3 md:grid-cols-2">
              <div
                v-for="imagePath in form.imagePaths"
                :key="imagePath"
                class="surface-panel rounded-[1.4rem] p-3"
              >
                <img :src="imagePath" :alt="imagePath" class="aspect-[4/3] w-full rounded-2xl object-cover">
                <UButton
                  type="button"
                  color="neutral"
                  variant="outline"
                  block
                  class="mt-3 rounded-full"
                  @click="removeImage(imagePath)"
                >
                  Görseli Kaldır
                </UButton>
              </div>
            </div>
          </div>
        </UFormField>
      </div>

      <div class="space-y-4">
        <UFormField
          name="relatedProductIds"
          label="Benzer Ürünler"
          description="Detay sayfasında birlikte önerilecek ürünleri seçin."
          :ui="formFieldUi"
        >
          <UCheckboxGroup
            v-model="form.relatedProductIds"
            :items="relatedProductItems"
            color="primary"
            :ui="checkboxGroupUi"
          />
        </UFormField>
      </div>
    </section>

    <div class="flex flex-col gap-4 border-t border-[color:var(--surface-border)] pt-6 md:flex-row md:items-start md:justify-between">
      <div class="flex flex-wrap gap-3">
        <UButton type="submit" color="primary" class="rounded-full px-5 py-3">
          {{ saving ? 'Kaydediliyor...' : 'Kaydet' }}
        </UButton>

        <UButton
          v-if="previewHref"
          :to="previewHref"
          target="_blank"
          color="neutral"
          variant="outline"
          class="rounded-full px-5 py-3"
        >
          Önizleme
        </UButton>

        <UButton
          v-if="mode === 'edit'"
          type="button"
          color="error"
          variant="outline"
          class="rounded-full px-5 py-3"
          @click="deleteProduct"
        >
          {{ deleteRequested ? 'Silmeyi Onayla' : 'Ürünü Sil' }}
        </UButton>
      </div>

      <div class="space-y-3 text-sm md:max-w-xl">
        <UAlert
          v-if="statusMessage"
          color="success"
          variant="soft"
          icon="lucide:check-circle-2"
          :title="statusMessage"
          class="rounded-[1.5rem]"
        />

        <UAlert
          v-if="warningMessage"
          color="warning"
          variant="soft"
          icon="lucide:triangle-alert"
          :title="warningMessage"
          class="rounded-[1.5rem]"
        />

        <UAlert
          v-if="errorMessage"
          color="error"
          variant="soft"
          icon="lucide:circle-alert"
          :title="errorMessage"
          class="rounded-[1.5rem]"
        />

        <p class="text-[color:var(--text-muted)]">
          {{ mode === 'create' ? 'Yeni ürün kaydı oluşturuluyor.' : `Düzenlenen ürün kimliği: ${route.params.id || initialProduct?.id}` }}
        </p>
      </div>
    </div>
  </UForm>
</template>
