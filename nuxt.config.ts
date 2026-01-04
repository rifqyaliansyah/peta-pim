import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/leaflet',
  ],

  app: {
    head: {
      title: 'Peta-Pim | Cerita Random yang ada di Dunia',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Peta-Pim | Cerita Random yang ada di Dunia' }
      ],
      // link: [
      //   { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      // ]
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL
    }
  },

  vite: {
    plugins: [tailwindcss()],
  },
  css: ['./app/assets/css/main.css'],
})
