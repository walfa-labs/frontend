<script setup lang="ts">
useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const ui = useUiStore()
const route = useRoute()
const colorMode = useColorMode()

const navItems = [
  { label: 'Overview', to: '/dashboard', icon: 'lucide:layout-dashboard' },
  { label: 'Experience', to: '/dashboard/experiences', icon: 'lucide:briefcase' },
  { label: 'Projects', to: '/dashboard/projects', icon: 'lucide:folder' },
  { label: 'Posts', to: '/dashboard/posts', icon: 'lucide:file-text' },
  { label: 'Profile', to: '/dashboard/profile', icon: 'lucide:user' },
]

const colorModeItems = [
  { label: 'Light', value: 'light', icon: 'lucide:sun' },
  { label: 'Dark', value: 'dark', icon: 'lucide:moon' },
  { label: 'System', value: 'system', icon: 'lucide:monitor' },
]
</script>

<template>
  <div class="min-h-screen flex bg-[var(--bg-main)] text-[var(--text-primary)]">
    <!-- Sidebar -->
    <aside
      class="border-r border-[var(--border-subtle)] transition-all duration-200"
      :class="ui.sidebarOpen ? 'w-60' : 'w-0 overflow-hidden'"
    >
      <div class="w-60 h-full flex flex-col">
        <div class="h-16 flex items-center px-4 border-b border-[var(--border-subtle)]">
          <span class="editorial-heading text-lg text-[var(--text-primary)]">Dashboard</span>
        </div>
        <nav class="flex-1 p-3 space-y-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors no-underline"
            :class="route.path === item.to
              ? 'bg-[var(--surface-subtle)] text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]'"
          >
            <UIcon :name="item.icon" />
            {{ item.label }}
          </NuxtLink>
        </nav>
        <div class="p-3 border-t border-[var(--border-subtle)]">
          <NuxtLink to="/" class="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline">
            <UIcon name="lucide:external-link" />
            View Site
          </NuxtLink>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-16 border-b border-[var(--border-subtle)] flex items-center px-4 gap-3">
        <button
          class="p-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Toggle sidebar"
          @click="ui.toggleSidebar()"
        >
          <UIcon name="lucide:panel-left" />
        </button>
        <div class="flex-1" />
        <UDropdownMenu
          :items="colorModeItems.map(item => ({
            label: item.label,
            icon: item.icon,
            onSelect: () => colorMode.preference = item.value,
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
        <UButton to="/" icon="lucide:log-out" variant="ghost" color="neutral" size="sm">
          Logout
        </UButton>
      </header>

      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
