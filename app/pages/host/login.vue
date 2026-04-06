<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function login() {
  errorMessage.value = ''
  loading.value = true

  try {
    await $fetch('/api/host/login', {
      method: 'POST',
      body: {
        password: password.value,
      },
    })

    const redirectTarget = typeof route.query.redirect === 'string' ? route.query.redirect : '/host'
    await navigateTo(redirectTarget)
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Giriş başarısız.'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-10">
    <div class="surface-panel-strong w-full max-w-md rounded-[2rem] p-8">
      <p class="section-kicker">
        Gizli Erişim
      </p>
      <h1 class="mt-4 text-4xl font-semibold">
        Host Paneli
      </h1>
      <p class="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">
        Bu alan sadece yönetim içindir. Şifreyi sunucu tarafında <code>HOST_ADMIN_PASSWORD</code> ile değiştirebilirsiniz.
      </p>

      <form class="mt-8 space-y-5" @submit.prevent="login">
        <div>
          <label class="field-label" for="host-password">Yönetici Şifresi</label>
          <input id="host-password" v-model="password" type="password" class="input-shell" required>
        </div>

        <button type="submit" class="button-primary w-full justify-center" :disabled="loading">
          {{ loading ? 'Kontrol ediliyor...' : 'Panele Gir' }}
        </button>

        <p v-if="errorMessage" class="text-sm text-red-500">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </div>
</template>
