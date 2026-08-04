<script setup lang="ts">
import type { Experience } from '~/types/api'

defineProps<{
  experiences: Experience[]
}>()

function formatDate(date: string | null): string {
  if (!date) return 'Present'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}
</script>

<template>
  <ol class="timeline">
    <li
      v-for="(exp, i) in experiences"
      :key="exp.id"
      class="timeline-entry"
      :class="{ 'timeline-entry--right': i % 2 === 1 }"
    >
      <span class="timeline-dot" aria-hidden="true" />
      <div class="card-flat p-5 md:p-6">
        <p class="text-xs font-mono text-[var(--accent)]">
          {{ formatDate(exp.startDate) }} — {{ formatDate(exp.endDate) }}
        </p>
        <h3 class="mt-1.5 text-base font-semibold text-[var(--text-primary)]">{{ exp.roleTitle }}</h3>
        <p class="text-sm text-[var(--text-secondary)]">
          {{ exp.organization }}<span v-if="exp.location" class="text-[var(--text-tertiary)]"> · {{ exp.location }}</span>
        </p>
        <p v-if="exp.summaryMarkdown" class="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          {{ exp.summaryMarkdown }}
        </p>
        <ul v-if="exp.highlights.length" class="mt-3 space-y-2">
          <li
            v-for="(highlight, j) in exp.highlights"
            :key="j"
            class="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
          >
            <UIcon name="lucide:check" class="size-4 text-[var(--accent)] mt-0.5 shrink-0" />
            <ContentMarkdownView :content="highlight.bodyMarkdown" />
          </li>
        </ul>
      </div>
    </li>
  </ol>
</template>

<style scoped>
/* Rail: left side on mobile, centered on desktop */
.timeline {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0.375rem;
  bottom: 0.375rem;
  left: 0.75rem;
  width: 1px;
  background: var(--border-default);
}

.timeline-entry {
  position: relative;
  padding-left: 2.5rem;
  padding-bottom: 2.5rem;
}

.timeline-entry:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  z-index: 1;
  top: 0.375rem;
  left: 0.75rem;
  transform: translateX(-50%);
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  background: var(--accent);
  box-shadow: 0 0 0 4px var(--bg-main);
}

/* Connector from rail to card */
.timeline-entry::after {
  content: '';
  position: absolute;
  top: calc(0.375rem + 0.3125rem);
  left: 0.75rem;
  width: calc(2.5rem - 0.75rem);
  height: 1px;
  background: var(--border-default);
}

@media (min-width: 768px) {
  .timeline::before {
    left: 50%;
  }

  .timeline-entry {
    width: 50%;
    padding-left: 0;
    padding-right: 3rem;
  }

  .timeline-entry--right {
    margin-left: 50%;
    padding-right: 0;
    padding-left: 3rem;
  }

  .timeline-dot {
    left: auto;
    right: 0;
    transform: translateX(50%);
  }

  .timeline-entry--right .timeline-dot {
    right: auto;
    left: 0;
    transform: translateX(-50%);
  }

  .timeline-entry::after {
    left: auto;
    right: 0;
    width: 3rem;
  }

  .timeline-entry--right::after {
    right: auto;
    left: 0;
  }
}
</style>
