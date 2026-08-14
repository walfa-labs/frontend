<script setup lang="ts">
import type { Project } from '~/types/api'

defineProps<{
  projects: Project[]
}>()
</script>

<template>
  <section class="py-16">
    <div class="mx-auto max-w-5xl px-6">
      <div class="flex items-center justify-between mb-8">
        <div>
          <p class="editorial-label mb-2">Projects</p>
          <h2 class="editorial-heading text-2xl md:text-3xl text-[var(--text-primary)]">Featured Projects</h2>
        </div>
        <NuxtLink to="/projects" class="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] no-underline inline-flex items-center gap-1">
          View all
          <UIcon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LandingProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>
  </section>
</template>
