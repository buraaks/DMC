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
const reordering = ref(false)
const draggedBrandId = ref<string | null>(null)
const dragOverBrandId = ref<string | null>(null)
const dropPlacement = ref<'before' | 'after' | null>(null)
const localBrands = ref<Brand[]>([])

function createBrandForm(brand?: Brand | null) {
  return {
    id: brand?.id ?? '',
    name: brand?.name ?? '',
    slug: brand?.slug ?? '',
    logoPath: brand?.logoPath ?? '',
  }
}

const form = reactive(createBrandForm())

watch(brands, (nextBrands) => {
  localBrands.value = [...(nextBrands ?? [])]
}, { immediate: true })

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

function onDragStart(event: DragEvent, brandId: string) {
  draggedBrandId.value = brandId

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', brandId)
  }
}

function onDragEnd() {
  draggedBrandId.value = null
  dragOverBrandId.value = null
  dropPlacement.value = null
}

function onDragOver(event: DragEvent, targetBrandId: string) {
  const target = event.currentTarget as HTMLElement | null
  if (!target) {
    return
  }

  const rect = target.getBoundingClientRect()
  const midpoint = rect.top + rect.height / 2
  dropPlacement.value = (event.clientY < midpoint) ? 'before' : 'after'
  dragOverBrandId.value = targetBrandId
}

function reorderBrandsByDrop(sourceBrandId: string, targetBrandId: string): Brand[] {
  const placement = dropPlacement.value
  if (!sourceBrandId || !placement) {
    return localBrands.value
  }

  const currentBrands = [...localBrands.value]
  const sourceIndex = currentBrands.findIndex(brand => brand.id === sourceBrandId)
  const targetIndex = currentBrands.findIndex(brand => brand.id === targetBrandId)

  if (sourceIndex < 0 || targetIndex < 0) {
    return localBrands.value
  }

  let insertionIndex = placement === 'before' ? targetIndex : targetIndex + 1
  if (sourceIndex < insertionIndex) {
    insertionIndex -= 1
  }

  if (sourceIndex === insertionIndex) {
    return localBrands.value
  }

  const nextBrands = [...currentBrands]
  const [movedBrand] = nextBrands.splice(sourceIndex, 1)
  nextBrands.splice(insertionIndex, 0, movedBrand)

  return nextBrands.map((brand, index) => ({
    ...brand,
    sortOrder: index + 1,
  }))
}

async function onDrop(event: DragEvent, targetBrandId: string) {
  const sourceBrandId = event.dataTransfer?.getData('text/plain') || draggedBrandId.value
  if (!sourceBrandId) {
    onDragEnd()
    return
  }

  const nextBrands = reorderBrandsByDrop(sourceBrandId, targetBrandId)
  localBrands.value = nextBrands
  await saveBrandOrder()
  onDragEnd()
}

async function saveBrandOrder() {
  if (reordering.value || localBrands.value.length === 0) {
    return
  }

  reordering.value = true
  statusMessage.value = ''
  errorMessage.value = ''

  try {
    for (const [index, brand] of localBrands.value.entries()) {
      await $fetch(`/api/host/brands/${brand.id}`, {
        method: 'PUT',
        body: {
          sortOrder: index + 1,
        },
      })
    }

    statusMessage.value = 'Marka sırası güncellendi.'
    await refresh()
    await refreshNuxtData()
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Marka sıralaması güncellenemedi.'
    await refresh()
  }
  finally {
    reordering.value = false
  }
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
        <TransitionGroup name="brand-list" tag="div" class="space-y-4">
          <div
            v-for="brand in localBrands"
            :key="brand.id"
          class="surface-panel brand-draggable-card relative flex items-center justify-between gap-4 rounded-[1.6rem] p-4"
            :class="draggedBrandId === brand.id ? 'opacity-60 scale-[0.99]' : ''"
            draggable="true"
            @dragstart="onDragStart($event, brand.id)"
            @dragend="onDragEnd"
          @dragover.prevent="onDragOver($event, brand.id)"
            @drop.prevent="onDrop($event, brand.id)"
          >
          <span
            v-if="dragOverBrandId === brand.id && dropPlacement === 'before'"
            class="absolute -top-1 left-4 right-4 h-1 rounded-full bg-[color:var(--brand-green)]/80"
          />
          <span
            v-if="dragOverBrandId === brand.id && dropPlacement === 'after'"
            class="absolute -bottom-1 left-4 right-4 h-1 rounded-full bg-[color:var(--brand-green)]/80"
          />
            <div class="flex items-center gap-4">
              <UIcon name="lucide:grip-vertical" class="h-5 w-5 text-[color:var(--text-muted)]" />
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
        </TransitionGroup>
        <p class="text-xs text-[color:var(--text-muted)]">
          Sıralamak için markayı tutup sürükleyin.
        </p>
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
          <button type="submit" class="button-primary" :disabled="saving || reordering">
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

<style scoped>
.brand-draggable-card {
  transition: transform 220ms ease, opacity 220ms ease, box-shadow 220ms ease;
}

.brand-draggable-card:hover {
  transform: translateY(-2px);
}

.brand-list-move {
  transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
}

.brand-list-enter-active,
.brand-list-leave-active {
  transition: all 220ms ease;
}

.brand-list-enter-from,
.brand-list-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.99);
}
</style>
