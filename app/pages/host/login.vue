<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()
const { data: session } = await useAsyncData<{ authenticated: boolean, configured: boolean }>(
  'host-login-session',
  () => $fetch('/api/host/session'),
)
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function login() {
  if (session.value && !session.value.configured) {
    errorMessage.value = 'HOST_ADMIN_PASSWORD tanımlı değil. Önce .env dosyanızı güncelleyin.'
    return
  }

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
      <p v-if="session && !session.configured" class="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
        Host paneli için önce <code>.env</code> içinde <code>HOST_ADMIN_PASSWORD</code> tanımlanmalı.
      </p>

      <form class="mt-8 space-y-5" @submit.prevent="login">
        <div>
          <label class="field-label" for="host-password">Yönetici Şifresi</label>
          <input id="host-password" v-model="password" type="password" class="input-shell" required>
        </div>

        <button type="submit" class="button-primary w-full justify-center" :disabled="loading || (session ? !session.configured : false)">
          {{ loading ? 'Kontrol ediliyor...' : 'Panele Gir' }}
        </button>

        <p v-if="errorMessage" class="text-sm text-red-500">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </div>
</template>
