<script setup lang="ts">
import type { ProjectSummary } from '~/types/api'

defineProps<{
  projects: ProjectSummary[]
}>()
</script>

<template>
  <section class="py-16">
    <UContainer>
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-highlighted">Featured Projects</h2>
        <UButton to="/projects" variant="link" color="primary">
          View all →
        </UButton>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LandingProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>
    </UContainer>
  </section>
</template>
