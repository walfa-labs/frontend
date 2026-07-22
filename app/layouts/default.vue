<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const colorMode = useColorMode()

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
]

const isActive = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

const colorModeItems = [
  { label: 'Light', value: 'light', icon: 'lucide:sun' },
  { label: 'Dark', value: 'dark', icon: 'lucide:moon' },
  { label: 'System', value: 'system', icon: 'lucide:monitor' },
]

function setColorMode(value: string) {
  colorMode.preference = value
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header
      class="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--border-subtle)] backdrop-blur-md bg-[var(--bg-main)]/80"
    >
      <div class="mx-auto max-w-5xl flex items-center justify-between h-16 px-6">
        <NuxtLink to="/" class="editorial-heading text-xl text-[var(--text-primary)] no-underline">
          {{ config.public.siteName }}
        </NuxtLink>
        <nav class="flex items-center gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-3 py-2 text-sm font-medium rounded-md transition-colors no-underline"
            :class="isActive(item.to)
              ? 'text-[var(--text-primary)] bg-[var(--surface-subtle)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'"
          >
            {{ item.label }}
          </NuxtLink>

          <div class="w-px h-6 bg-[var(--border-default)] mx-2" />

          <!-- Color mode toggle -->
          <UDropdownMenu
            :items="colorModeItems.map(item => ({
              label: item.label,
              icon: item.icon,
              onSelect: () => setColorMode(item.value),
              class: colorMode.preference === item.value ? 'text-primary font-semibold' : '',
            }))"
          >
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              :icon="colorMode.preference === 'dark' ? 'lucide:moon' : colorMode.preference === 'light' ? 'lucide:sun' : 'lucide:monitor'"
              aria-label="Toggle color mode"
            />
          </UDropdownMenu>
        </nav>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-[var(--border-subtle)] py-8">
      <div class="mx-auto max-w-5xl px-6 flex items-center justify-between">
        <p class="text-sm text-[var(--text-tertiary)]">
          &copy; {{ new Date().getFullYear() }} {{ config.public.siteName }}
        </p>
        <div class="flex gap-4">
          <NuxtLink to="/blog" class="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors no-underline">
            Blog
          </NuxtLink>
          <NuxtLink to="/projects" class="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors no-underline">
            Projects
          </NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
