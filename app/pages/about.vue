<script setup lang="ts">
const { list } = useExperiences()
const config = useRuntimeConfig()

const { data } = await useAsyncData(
  'experiences',
  () => list(),
  { default: () => ({ data: [] }) },
)

const workExperiences = computed(() =>
  (data.value?.data ?? []).filter((e) => e.experienceType === 'work'),
)
const educationExperiences = computed(() =>
  (data.value?.data ?? []).filter((e) => e.experienceType === 'education'),
)

function formatDate(date: string | null): string {
  if (!date) return 'Present'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

useSeoMeta({
  title: `About — ${config.public.siteName}`,
  description: 'Professional experience and education timeline.',
  ogTitle: `About — ${config.public.siteName}`,
  ogDescription: 'Professional experience and education timeline.',
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}/about`,
  twitterCard: 'summary_large_image',
})
useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}/about` }],
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-6 py-16">
    <div class="reveal mb-16">
      <p class="editorial-label mb-4">About</p>
      <h1 class="editorial-heading text-[clamp(2rem,5vw,3.5rem)] text-[var(--text-primary)]">
        Experience &amp; Education
      </h1>
    </div>

    <section v-if="workExperiences.length" class="mb-16">
      <h2 class="editorial-heading text-2xl text-[var(--text-primary)] mb-8">Work</h2>
      <div class="space-y-8">
        <div
          v-for="exp in workExperiences"
          :key="exp.id"
          class="reveal flex flex-col md:flex-row md:items-start gap-2 md:gap-8 pb-8 border-b border-[var(--border-subtle)] last:border-b-0"
        >
          <div class="md:w-32 shrink-0">
            <p class="text-sm text-[var(--text-tertiary)]">{{ formatDate(exp.startDate) }} — {{ formatDate(exp.endDate) }}</p>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-[var(--text-primary)]">{{ exp.roleTitle }}</h3>
            <p class="text-[var(--text-secondary)]">{{ exp.organization }}<span v-if="exp.location"> · {{ exp.location }}</span></p>
            <p v-if="exp.summaryMarkdown" class="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{{ exp.summaryMarkdown }}</p>
            <ul v-if="exp.highlights.length" class="mt-3 space-y-1.5">
              <li
                v-for="(highlight, i) in exp.highlights"
                :key="i"
                class="text-sm text-[var(--text-secondary)] flex items-start gap-2"
              >
                <span class="text-[var(--ui-color-primary-500)] mt-0.5">→</span>
                {{ highlight.bodyMarkdown }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section v-if="educationExperiences.length">
      <h2 class="editorial-heading text-2xl text-[var(--text-primary)] mb-8">Education</h2>
      <div class="space-y-8">
        <div
          v-for="exp in educationExperiences"
          :key="exp.id"
          class="reveal flex flex-col md:flex-row md:items-start gap-2 md:gap-8 pb-8 border-b border-[var(--border-subtle)] last:border-b-0"
        >
          <div class="md:w-32 shrink-0">
            <p class="text-sm text-[var(--text-tertiary)]">{{ formatDate(exp.startDate) }} — {{ formatDate(exp.endDate) }}</p>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-[var(--text-primary)]">{{ exp.roleTitle }}</h3>
            <p class="text-[var(--text-secondary)]">{{ exp.organization }}<span v-if="exp.location"> · {{ exp.location }}</span></p>
            <p v-if="exp.summaryMarkdown" class="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{{ exp.summaryMarkdown }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
