<script setup lang="ts">
const route = useRoute()

const links = [
  { label: 'Dashboard', to: '/host' },
  { label: 'Ürün Yönetimi', to: '/host/urunler' },
  { label: 'Sayfa Özelleştirme', to: '/host/ozellestirme' },
  { label: 'İletişim Bilgileri', to: '/host/iletisim' },
  { label: 'Marka Yönetimi', to: '/host/markalar' },
]

async function logout() {
  await $fetch('/api/host/logout', { method: 'POST' })
  await navigateTo('/host/login')
}
</script>

<template>
  <aside class="surface-panel-strong flex w-full flex-col gap-6 rounded-[2rem] border border-[color:var(--surface-border)] p-5 shadow-[var(--shadow-soft)] lg:sticky lg:top-6 lg:w-72 lg:self-start">
    <div class="space-y-2">
      <p class="text-xs font-black uppercase tracking-[0.3em] text-[color:var(--brand-green)]">
        DMC Host
      </p>
      <h2 class="text-2xl font-semibold">
        Yönetim Paneli
      </h2>
      <p class="text-sm leading-6 text-[color:var(--text-secondary)]">
        Ürün, marka ve site içeriklerini tek noktadan yönetin.
      </p>
    </div>

    <nav class="flex flex-col gap-2">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="rounded-2xl px-4 py-3 text-sm font-semibold transition"
        :class="route.path === link.to ? 'bg-[color:var(--brand-blue)] text-white' : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--brand-blue-soft)] hover:text-[color:var(--brand-blue)]'"
      >
        {{ link.label }}
      </NuxtLink>
    </nav>

    <button type="button" class="button-secondary justify-center" @click="logout">
      Çıkış Yap
    </button>
  </aside>
</template>
