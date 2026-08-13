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
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
]
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
        <nav class="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors no-underline shrink-0"
            :class="isActive(item.to)
              ? 'text-[var(--accent)] bg-[var(--accent-subtle)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-subtle)]'"
          >
            {{ item.label }}
          </NuxtLink>

          <div class="w-px h-5 sm:h-6 bg-[var(--border-default)] mx-1 sm:mx-2 shrink-0" />

          <!-- Color mode switcher (native select: opens in every engine and is
               keyboard-accessible without custom menu JavaScript) -->
          <label class="sr-only" for="color-mode-select">Color mode</label>
          <select
            id="color-mode-select"
            v-model="colorMode.preference"
            class="shrink-0 appearance-none rounded-md border-0 bg-transparent py-1.5 pl-2 pr-6 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] cursor-pointer"
            aria-label="Color mode"
          >
            <option v-for="item in colorModeItems" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
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
