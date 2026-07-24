<script setup lang="ts">
import type { Profile } from '~/types/api'

const route = useRoute()
const config = useRuntimeConfig()
const profile = useProfileState()
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
      class="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--border-subtle)] backdrop-blur-xl bg-[var(--bg-main)]/85 shadow-[var(--shadow-sm)]"
    >
      <div class="mx-auto max-w-5xl flex items-center justify-between h-16 px-6">
        <NuxtLink to="/" class="editorial-heading text-xl text-[var(--text-primary)] no-underline flex items-center gap-2.5">
          <span class="inline-block w-2 h-2 rounded-full bg-[var(--accent)]" />
          {{ profile?.name || config.public.siteName }}
        </NuxtLink>
        <nav class="flex items-center gap-0.5">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-3 py-2 text-sm font-medium rounded-md transition-colors no-underline"
            :class="isActive(item.to)
              ? 'text-[var(--accent)] bg-[var(--accent-subtle)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-subtle)]'"
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
    <footer class="border-t border-[var(--border-subtle)] bg-[var(--bg-tint)]">
      <div class="mx-auto max-w-5xl px-6 py-12">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <NuxtLink to="/" class="editorial-heading text-lg text-[var(--text-primary)] no-underline flex items-center gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-[var(--accent)]" />
              {{ profile?.name || config.public.siteName }}
            </NuxtLink>
            <p class="text-sm text-[var(--text-tertiary)] mt-1">
              &copy; {{ new Date().getFullYear() }} — All rights reserved.
            </p>
          </div>
          <div class="flex items-center gap-5">
            <NuxtLink to="/blog" class="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors no-underline">
              Blog
            </NuxtLink>
            <NuxtLink to="/projects" class="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors no-underline">
              Projects
            </NuxtLink>
            <template v-if="profile?.githubUrl || profile?.linkedinUrl || profile?.twitterUrl">
              <div class="w-px h-5 bg-[var(--border-default)]" />
              <a
                v-if="profile?.githubUrl"
                :href="profile.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors"
                aria-label="GitHub"
              >
                <UIcon name="lucide:github" class="size-4" />
              </a>
              <a
                v-if="profile?.linkedinUrl"
                :href="profile.linkedinUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors"
                aria-label="LinkedIn"
              >
                <UIcon name="lucide:linkedin" class="size-4" />
              </a>
              <a
                v-if="profile?.twitterUrl"
                :href="profile.twitterUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors"
                aria-label="Twitter"
              >
                <UIcon name="lucide:twitter" class="size-4" />
              </a>
            </template>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
