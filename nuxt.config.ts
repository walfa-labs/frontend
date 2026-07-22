export default defineNuxtConfig({
  ssr: true,
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api/v1',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://portfolio.example.com',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || 'Portfolio',
    },
  },
  routeRules: {
    // Public content routes — SSR at runtime, cached via SWR (revalidate hourly).
    '/': { swr: 3600 },
    '/about': { swr: 3600 },
    '/projects': { swr: 3600 },
    '/projects/**': { swr: 3600 },
    '/blog': { swr: 3600 },
    '/blog/**': { swr: 3600 },
    // Dashboard + login — pure client-side SPA, no SSR, no indexing.
    '/dashboard/**': { ssr: false },
    '/login': { ssr: false },
    // API passthrough (same origin via Caddy).
    '/api/**': { cors: true },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  devtools: { enabled: true },
  compatibilityDate: '2025-07-15',
})
