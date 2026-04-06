<script setup lang="ts">
import type { Brand } from '~~/shared/catalog'

definePageMeta({
  layout: 'host',
})

const { data: brands, refresh } = await useAsyncData<Brand[]>('host-brands', () => $fetch('/api/brands'))
const { uploadImage, uploading, uploadError } = useHostUpload()

const saving = ref(false)
const statusMessage = ref('')
const errorMessage = ref('')
const deleteRequested = ref(false)

function createBrandForm(brand?: Brand | null) {
  return {
    id: brand?.id ?? '',
    name: brand?.name ?? '',
    slug: brand?.slug ?? '',
    logoPath: brand?.logoPath ?? '',
    sortOrder: brand?.sortOrder ?? (brands.value?.length || 0) + 1,
  }
}

const form = reactive(createBrandForm())

function resetForm() {
  deleteRequested.value = false
  Object.assign(form, createBrandForm())
}

function selectBrand(brand: Brand) {
  Object.assign(form, createBrandForm(brand))
}

async function onUploadChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  try {
    const imagePath = await uploadImage(file)
    form.logoPath = imagePath
  }
  finally {
    input.value = ''
  }
}

async function saveBrand() {
  saving.value = true
  statusMessage.value = ''
  errorMessage.value = ''

  try {
    const payload = {
      name: form.name,
      slug: form.slug,
      logoPath: form.logoPath,
      sortOrder: Number(form.sortOrder),
    }

    if (form.id) {
      await $fetch(`/api/host/brands/${form.id}`, {
        method: 'PUT',
        body: payload,
      })
      statusMessage.value = 'Marka güncellendi.'
    }
    else {
      await $fetch('/api/host/brands', {
        method: 'POST',
        body: payload,
      })
      statusMessage.value = 'Marka eklendi.'
    }

    await refresh()
    await refreshNuxtData()
    resetForm()
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Marka kaydedilemedi.'
  }
  finally {
    saving.value = false
  }
}

async function removeBrand() {
  if (!form.id) {
    return
  }

  if (!deleteRequested.value) {
    deleteRequested.value = true
    errorMessage.value = 'Markayı silmek üzeresiniz. Tekrar tıklarsanız kayıt kalıcı olarak kaldırılır.'
    return
  }

  await $fetch(`/api/host/brands/${form.id}`, {
    method: 'DELETE',
  })

  await refresh()
  await refreshNuxtData()
  resetForm()
}
</script>

<template>
  <div class="space-y-8">
    <section>
      <p class="section-kicker">
        Marka Yönetimi
      </p>
      <h1 class="mt-3 text-4xl font-semibold">
        Marka kartları ve logolar
      </h1>
    </section>

    <section class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div class="space-y-4">
        <div
          v-for="brand in brands"
          :key="brand.id"
          class="surface-panel flex items-center justify-between gap-4 rounded-[1.6rem] p-4"
        >
          <div class="flex items-center gap-4">
            <img :src="brand.logoPath" :alt="brand.name" class="h-14 w-14 rounded-2xl object-cover">
            <div>
              <p class="text-sm font-semibold">
                {{ brand.name }}
              </p>
              <p class="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                {{ brand.slug }}
              </p>
            </div>
          </div>
          <button type="button" class="button-secondary" @click="selectBrand(brand)">
            Düzenle
          </button>
        </div>
      </div>

      <form class="surface-panel-strong space-y-5 rounded-[2rem] p-6" @submit.prevent="saveBrand">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="field-label">
              Marka Formu
            </p>
            <h2 class="text-2xl font-semibold">
              {{ form.id ? 'Markayı Düzenle' : 'Yeni Marka Ekle' }}
            </h2>
          </div>
          <button type="button" class="button-secondary" @click="resetForm">
            Sıfırla
          </button>
        </div>

        <div>
          <label class="field-label">Marka Adı</label>
          <input v-model="form.name" class="input-shell" required>
        </div>
        <div>
          <label class="field-label">Slug</label>
          <input v-model="form.slug" class="input-shell">
        </div>
        <div>
          <label class="field-label">Sıralama</label>
          <input v-model="form.sortOrder" type="number" class="input-shell">
        </div>
        <div>
          <label class="field-label">Logo Yükle</label>
          <input type="file" accept="image/*" class="input-shell" @change="onUploadChange">
          <img v-if="form.logoPath" :src="form.logoPath" :alt="form.name || 'Marka logosu'" class="mt-3 h-24 w-24 rounded-2xl object-cover">
          <p v-if="uploading" class="mt-2 text-xs text-[color:var(--text-muted)]">
            Görsel yükleniyor...
          </p>
          <p v-if="uploadError" class="mt-2 text-sm text-red-500">
            {{ uploadError }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3 pt-4">
          <button type="submit" class="button-primary" :disabled="saving">
            {{ saving ? 'Kaydediliyor...' : 'Kaydet' }}
          </button>
          <button v-if="form.id" type="button" class="button-secondary" @click="removeBrand">
            {{ deleteRequested ? 'Silmeyi Onayla' : 'Markayı Sil' }}
          </button>
        </div>

        <div class="text-sm">
          <p v-if="statusMessage" class="text-emerald-600">
            {{ statusMessage }}
          </p>
          <p v-if="errorMessage" class="text-red-500">
            {{ errorMessage }}
          </p>
        </div>
      </form>
    </section>
  </div>
</template>
