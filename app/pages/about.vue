<script setup lang="ts">
import type { Profile } from '~/types/api'

const { list } = useExperiences()
const config = useRuntimeConfig()
const profile = useState<Profile | null>('profile', () => null)

const { data } = useAsyncData(
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
  title: `About — ${profile.value?.name || config.public.siteName}`,
  description: 'Professional experience and education timeline.',
  ogTitle: `About — ${profile.value?.name || config.public.siteName}`,
  ogDescription: 'Professional experience and education timeline.',
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}/about`,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <!-- Header -->
    <section class="hero-bg">
      <div class="mx-auto max-w-5xl px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div>
          <p class="editorial-label mb-4">About</p>
          <h1 class="editorial-heading text-[clamp(2rem,5vw,3.5rem)] text-[var(--text-primary)]">
            Experience &amp; Education
          </h1>
          <p v-if="profile?.location" class="mt-4 text-sm text-[var(--text-tertiary)] flex items-center gap-1.5">
            <UIcon name="lucide:map-pin" class="size-4" /> {{ profile.location }}
          </p>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-5xl px-6 pb-20">
      <!-- Bio -->
      <section v-if="profile?.bioMarkdown" class=" mb-16">
        <div class="prose prose-lg max-w-none text-[var(--text-secondary)]">
          <ContentMarkdownView :content="profile.bioMarkdown" />
        </div>
      </section>

      <div v-if="workExperiences.length || educationExperiences.length" class="section-divider mb-16" />

      <!-- Work Experience -->
      <section v-if="workExperiences.length" class="mb-16">
        <h2 class="editorial-heading text-2xl text-[var(--text-primary)] mb-10 flex items-center gap-3">
          <UIcon name="lucide:briefcase" class="size-5 text-[var(--accent)]" />
          Work
        </h2>
        <div class="space-y-6">
          <div
            v-for="exp in workExperiences"
            :key="exp.id"
            class=" card-elevated p-6 md:p-7"
          >
            <div class="flex flex-col md:flex-row md:items-start gap-2 md:gap-8">
              <div class="md:w-32 shrink-0">
                <p class="text-sm font-medium text-[var(--accent)]">{{ formatDate(exp.startDate) }}</p>
                <p class="text-sm text-[var(--text-tertiary)]">{{ formatDate(exp.endDate) }}</p>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-[var(--text-primary)]">{{ exp.roleTitle }}</h3>
                <p class="text-[var(--text-secondary)]">{{ exp.organization }}<span v-if="exp.location"> · {{ exp.location }}</span></p>
                <p v-if="exp.summaryMarkdown" class="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{{ exp.summaryMarkdown }}</p>
                <ul v-if="exp.highlights.length" class="mt-4 space-y-2">
                  <li
                    v-for="(highlight, i) in exp.highlights"
                    :key="i"
                    class="text-sm text-[var(--text-secondary)] flex items-start gap-2.5"
                  >
                    <UIcon name="lucide:check" class="size-4 text-[var(--accent)] mt-0.5 shrink-0" />
                    <ContentMarkdownView :content="highlight.bodyMarkdown" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Education -->
      <section v-if="educationExperiences.length">
        <h2 class="editorial-heading text-2xl text-[var(--text-primary)] mb-10 flex items-center gap-3">
          <UIcon name="lucide:graduation-cap" class="size-5 text-[var(--accent)]" />
          Education
        </h2>
        <div class="space-y-6">
          <div
            v-for="exp in educationExperiences"
            :key="exp.id"
            class=" card-elevated p-6 md:p-7"
          >
            <div class="flex flex-col md:flex-row md:items-start gap-2 md:gap-8">
              <div class="md:w-32 shrink-0">
                <p class="text-sm font-medium text-[var(--accent)]">{{ formatDate(exp.startDate) }}</p>
                <p class="text-sm text-[var(--text-tertiary)]">{{ formatDate(exp.endDate) }}</p>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-[var(--text-primary)]">{{ exp.roleTitle }}</h3>
                <p class="text-[var(--text-secondary)]">{{ exp.organization }}<span v-if="exp.location"> · {{ exp.location }}</span></p>
                <p v-if="exp.summaryMarkdown" class="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{{ exp.summaryMarkdown }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
