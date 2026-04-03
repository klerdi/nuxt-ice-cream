// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  i18n: {
    defaultLocale: "sq",
    locales: [
      { code: 'sq', name: 'Shqip', file: 'sq.json' },
      { code: 'en', name: 'English',file: 'en.json' },
      { code: 'el', name: 'Ελληνικά',file: 'el.json' },
      { code: 'it', name: 'Italiano',file: 'it.json' },
      { code: 'de', name: 'Deutsch',file: 'de.json' },
    ],
    detectBrowserLanguage: false
  }
})