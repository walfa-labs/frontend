<script setup lang="ts">
import type { ProjectSummary } from '~/types/api'

defineProps<{
  project: ProjectSummary
}>()
</script>

<template>
  <NuxtLink
    :to="`/projects/${project.slug}`"
    class="block p-6 rounded-lg border border-default hover:border-primary transition-colors group"
  >
    <div class="flex items-start justify-between gap-3">
      <h3 class="text-lg font-semibold text-highlighted group-hover:text-primary">
        {{ project.title }}
      </h3>
      <UBadge v-if="project.featured" icon="lucide:star" color="primary" variant="soft" size="sm" />
    </div>
    <p v-if="project.tagline" class="mt-2 text-muted text-sm">{{ project.tagline }}</p>
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
