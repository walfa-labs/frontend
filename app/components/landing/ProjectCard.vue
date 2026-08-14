<script setup lang="ts">
import type { Project } from '~/types/api'

defineProps<{
  project: Project
}>()
</script>

<template>
  <NuxtLink
    :to="`/projects/${project.slug}`"
    class="card-accent p-6 block no-underline group"
  >
    <div class="flex items-start justify-between gap-3">
      <h3 class="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
        {{ project.title }}
      </h3>
      <UIcon v-if="project.featured" name="lucide:star" class="text-[var(--accent)] shrink-0 mt-0.5" />
    </div>
    <p v-if="project.tagline" class="mt-2 text-[var(--text-secondary)] text-sm leading-relaxed">{{ project.tagline }}</p>
    <div v-if="project.techStack.length" class="mt-4 flex flex-wrap gap-1.5">
      <span
        v-for="tech in project.techStack"
        :key="tech"
        class="tag-default"
      >
        {{ tech }}
      </span>
    </div>
  </NuxtLink>
</template>
