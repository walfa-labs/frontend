<script setup lang="ts">
const profile = useProfileState()
const config = useRuntimeConfig()
</script>

<template>
  <section class="hero-bg border-b border-[var(--border-subtle)]">
    <div class="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <div>
        <p class="editorial-label mb-4">Engineer</p>
        <h1 class="editorial-heading text-[clamp(2.5rem,6vw,4rem)] text-[var(--text-primary)]">
          Hi, I'm {{ profile?.name || config.public.siteName }}
        </h1>
        <p class="mt-6 text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {{ profile?.tagline || 'Software engineer building fast, reliable systems with Go and TypeScript.' }}
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <NuxtLink to="/projects" class="btn-primary no-underline">
            <UIcon name="lucide:folder-git-2" class="size-4" />
            View Projects
          </NuxtLink>
          <NuxtLink to="/blog" class="btn-secondary no-underline">
            <UIcon name="lucide:book-open" class="size-4" />
            Read Blog
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
