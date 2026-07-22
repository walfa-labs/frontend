<script setup lang="ts">
import type { Project } from '~/types/api'

defineProps<{
  project: Project
}>()
</script>

<template>
  <NuxtLink
    :to="`/projects/${project.slug}`"
    class="block p-6 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-colors no-underline group"
  >
    <div class="flex items-start justify-between gap-3">
      <h3 class="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--ui-color-primary-500)] transition-colors">
        {{ project.title }}
      </h3>
      <UBadge v-if="project.featured" icon="lucide:star" color="primary" variant="soft" size="sm" />
    </div>
    <p v-if="project.tagline" class="mt-2 text-[var(--text-secondary)] text-sm">{{ project.tagline }}</p>
    <div v-if="project.techStack.length" class="mt-4 flex flex-wrap gap-1.5">
      <UBadge
        v-for="tech in project.techStack"
        :key="tech"
        :label="tech"
        color="neutral"
        variant="soft"
        size="sm"
      />
    </div>
  </NuxtLink>
</template>
