export default defineNuxtConfig({
  app: {
    rootAttrs: {
      id: 'app',
    },
  },

  compatibilityDate: '2024-04-03',

  devtools: {
    enabled: true,
  },

  modules: [
    'vuetify-nuxt-module',
    '@pinia/nuxt',
  ],

  css: [
    '~/assets/styles/index.scss',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },

  devServer: {
    host: '0.0.0.0',
    https: true,
  },

  nitro: {
    experimental: {
      websocket: true,
    },
  },
});