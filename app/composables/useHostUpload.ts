import { ref } from 'vue'

export function useHostUpload() {
  const uploading = ref(false)
  const uploadError = ref('')

  async function uploadImage(file: File) {
    uploadError.value = ''
    uploading.value = true

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await $fetch<{ path: string }>('/api/host/upload', {
        method: 'POST',
        body: formData,
      })

      return response.path
    }
    catch (error) {
      uploadError.value = error instanceof Error ? error.message : 'Görsel yüklenemedi.'
      throw error
    }
    finally {
      uploading.value = false
    }
  }

  return {
    uploading,
    uploadError,
    uploadImage,
  }
}
