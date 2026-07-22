<script setup lang="ts">
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

const ui = useUiStore()
const route = useRoute()

const navItems = [
  { label: 'Overview', to: '/dashboard', icon: 'lucide:layout-dashboard' },
  { label: 'Experience', to: '/dashboard/experiences', icon: 'lucide:briefcase' },
  { label: 'Projects', to: '/dashboard/projects', icon: 'lucide:folder' },
  { label: 'Posts', to: '/dashboard/posts', icon: 'lucide:file-text' },
]
</script>

<template>
  <div class="min-h-screen flex bg-default text-default">
    <!-- Sidebar -->
    <aside
      class="border-r border-default transition-all duration-200"
      :class="ui.sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'"
    >
      <div class="w-64 h-full flex flex-col">
        <div class="h-16 flex items-center px-4 border-b border-default">
          <NuxtLink to="/dashboard" class="text-lg font-bold text-primary">
            Dashboard
          </NuxtLink>
        </div>
        <nav class="flex-1 p-3 space-y-1">
          <UButton
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :icon="item.icon"
            :variant="route.path === item.to ? 'soft' : 'ghost'"
            :color="route.path === item.to ? 'primary' : 'neutral'"
            block
            class="justify-start"
          >
            {{ item.label }}
          </UButton>
        </nav>
        <div class="p-3 border-t border-default">
          <UButton to="/" icon="lucide:external-link" variant="ghost" color="neutral" block class="justify-start">
            View Site
          </UButton>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-16 border-b border-default flex items-center px-4 gap-3">
        <UButton
          icon="lucide:panel-left"
          variant="ghost"
          color="neutral"
          @click="ui.toggleSidebar()"
        />
        <div class="flex-1" />
        <UButton
          to="/"
          icon="lucide:log-out"
          variant="ghost"
          color="neutral"
          size="sm"
        >
          Logout
        </UButton>
      </header>

      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
