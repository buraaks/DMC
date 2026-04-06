import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/test-utils/module',
    '@vueuse/nuxt',
  ],

  css: [
    '~/assets/css/main.css',
  ],

  runtimeConfig: {
    hostAdminPassword: process.env.HOST_ADMIN_PASSWORD || 'change-this-password',
    public: {
      siteName: 'DMC Otomasyon',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'tr',
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0b6b52' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
  },
})
