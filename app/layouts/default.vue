<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const links = computed(() => [
  { label: 'Home', to: '/', active: route.path === '/' },
  { label: 'About', to: '/about', active: route.path === '/about' },
  { label: 'Projects', to: '/projects', active: route.path.startsWith('/projects') },
  { label: 'Blog', to: '/blog', active: route.path.startsWith('/blog') },
])
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default text-default">
    <header class="border-b border-default sticky top-0 z-50 bg-default/80 backdrop-blur">
      <UContainer class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="text-xl font-bold text-primary">
          {{ config.public.siteName }}
        </NuxtLink>
        <nav class="flex items-center gap-1">
          <UButton
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            :variant="link.active ? 'soft' : 'ghost'"
            :color="link.active ? 'primary' : 'neutral'"
            size="sm"
          >
            {{ link.label }}
          </UButton>
        </nav>
      </UContainer>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-default py-8 mt-auto">
      <UContainer class="text-center text-sm text-muted">
        &copy; {{ new Date().getFullYear() }} {{ config.public.siteName }}
      </UContainer>
    </footer>
  </div>
</template>
