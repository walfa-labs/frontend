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
  routeRules: import.meta.dev ? {
    '/dashboard/**': { ssr: false },
    '/login': { ssr: false },
    '/api/**': { cors: true },
  } : {
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
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
        },
      ],
    },
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
  },
  devtools: { enabled: true },
  icon: {
    mode: 'svg',
    serverBundle: { collections: ['lucide'] },
    clientBundle: {
      scan: true,
      icons: [
        'lucide:arrow-left', 'lucide:arrow-right', 'lucide:arrow-up-right',
        'lucide:bold', 'lucide:book-open', 'lucide:briefcase', 'lucide:building-2',
        'lucide:calendar', 'lucide:check', 'lucide:chevron-down', 'lucide:chevron-right',
        'lucide:code', 'lucide:external-link', 'lucide:eye', 'lucide:file-text',
        'lucide:file-x', 'lucide:folder', 'lucide:folder-git-2', 'lucide:folder-open',
        'lucide:folder-x', 'lucide:github', 'lucide:graduation-cap', 'lucide:image',
        'lucide:italic', 'lucide:layout-dashboard', 'lucide:link', 'lucide:linkedin',
        'lucide:list', 'lucide:list-ordered', 'lucide:log-out', 'lucide:map-pin',
        'lucide:minus', 'lucide:monitor', 'lucide:moon', 'lucide:panel-left',
        'lucide:pencil', 'lucide:plus', 'lucide:quote', 'lucide:square-code',
        'lucide:star', 'lucide:strikethrough', 'lucide:sun', 'lucide:trash',
        'lucide:trash-2', 'lucide:twitter', 'lucide:user', 'lucide:x',
      ],
    },
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:8080/api',
        changeOrigin: true,
      },
    },
  },
  compatibilityDate: '2025-07-15',
})
