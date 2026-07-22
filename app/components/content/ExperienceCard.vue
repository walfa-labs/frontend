<script setup lang="ts">
import type { Experience } from '~/types/api'

defineProps<{
  experience: Experience
}>()

function formatDate(date: string | null): string {
  if (!date) return 'Present'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}
</script>

<template>
  <div class="relative pl-8 pb-8 border-l-2 border-default last:border-l-transparent">
    <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary border-4 border-default" />
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <h3 class="text-lg font-semibold text-highlighted">{{ experience.roleTitle }}</h3>
        <p class="text-primary font-medium">{{ experience.organization }}</p>
        <p v-if="experience.location" class="text-sm text-muted mt-1">{{ experience.location }}</p>
      </div>
      <div class="text-sm text-muted whitespace-nowrap text-right">
        <div>{{ formatDate(experience.startDate) }}</div>
        <div>— {{ formatDate(experience.endDate) }}</div>
      </div>
    </div>
    <div v-if="experience.summaryMarkdown" class="mt-3 prose prose-sm max-w-none text-muted">
      <ContentMarkdownView :content="experience.summaryMarkdown" />
    </div>
    <ul v-if="experience.highlights.length" class="mt-3 space-y-1.5">
      <li
        v-for="(highlight, i) in experience.highlights"
        :key="i"
        class="flex items-start gap-2 text-sm text-muted"
      >
        <UIcon name="lucide:check" class="text-primary mt-0.5 shrink-0" />
        <ContentMarkdownView :content="highlight.bodyMarkdown" />
      </li>
    </ul>
  </div>
</template>
