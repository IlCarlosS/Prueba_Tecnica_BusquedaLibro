// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  tailwindcss: {viewer: false},
  ssr: false,
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss','@pinia/nuxt'],
  nitro: {preset: 'github-pages'},
  app: {baseURL: '/Prueba_Tecnica_Libro/'
  }
})
