<script setup lang="ts">
import type { Experience } from '~/types/api'
import { formatDate } from '~/utils/date'

defineProps<{
  experience: Experience
}>()
</script>

<template>
  <div class="relative pl-8 pb-8 border-l border-[var(--border-default)] last:border-l-transparent">
    <div class="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg-main)]" />
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <h3 class="text-base font-semibold text-[var(--text-primary)]">{{ experience.roleTitle }}</h3>
        <p class="text-sm font-medium text-[var(--accent)]">{{ experience.organization }}</p>
        <p v-if="experience.location" class="text-xs text-[var(--text-tertiary)] mt-0.5">{{ experience.location }}</p>
      </div>
      <div class="text-xs font-mono text-[var(--text-tertiary)] whitespace-nowrap text-right">
        <div>{{ formatDate(experience.startDate, 'yearMonth') }}</div>
        <div>— {{ formatDate(experience.endDate, 'yearMonth', 'Present') }}</div>
      </div>
    </div>
    <div v-if="experience.summaryMarkdown" class="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
      <ContentMarkdownView :content="experience.summaryMarkdown" />
    </div>
    <ul v-if="experience.highlights.length" class="mt-3 space-y-1.5">
      <li
        v-for="(highlight, i) in experience.highlights"
        :key="i"
        class="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
      >
        <UIcon name="lucide:check" class="size-4 text-[var(--accent)] mt-0.5 shrink-0" />
        <ContentMarkdownView :content="highlight.bodyMarkdown" />
      </li>
    </ul>
  </div>
</template>
