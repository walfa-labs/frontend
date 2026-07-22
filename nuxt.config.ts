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
    '/': { swr: 3600 },
    '/about': { swr: 3600 },
    '/projects': { swr: 3600 },
    '/projects/**': { swr: 3600 },
    '/blog': { swr: 3600 },
    '/blog/**': { swr: 3600 },
    '/dashboard/**': { ssr: false },
    '/login': { ssr: false },
    '/api/**': { cors: true },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
  },
  devtools: { enabled: true },
  compatibilityDate: '2025-07-15',
})
