<script setup lang="ts">
const route = useRoute()
const { getBySlug } = useProjects()
const config = useRuntimeConfig()

const slug = computed(() => route.params.slug as string)

const { data } = await useAsyncData(
  () => `project-${slug.value}`,
  () => getBySlug(slug.value),
)

const project = computed(() => data.value?.data ?? null)
const url = computed(() => `${config.public.siteUrl}/projects/${slug.value}`)

useSeoMeta({
  title: project.value ? `${project.value.title} — ${config.public.siteName}` : 'Project',
  description: project.value?.tagline ?? '',
  ogTitle: project.value?.title ?? '',
  ogDescription: project.value?.tagline ?? '',
  ogImage: project.value?.coverImageUrl ?? undefined,
  ogUrl: url.value,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: project.value?.title ?? '',
  twitterDescription: project.value?.tagline ?? '',
  twitterImage: project.value?.coverImageUrl ?? undefined,
})
useHead({
  link: [{ rel: 'canonical', href: url.value }],
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 py-16">
    <template v-if="project">
      <NuxtLink to="/projects" class="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors no-underline inline-flex items-center gap-1 mb-8">
        ← Back to projects
      </NuxtLink>

      <p class="editorial-label mb-4">Project</p>
      <h1 class="editorial-heading text-[clamp(1.75rem,4vw,2.5rem)] text-[var(--text-primary)]">{{ project.title }}</h1>
      <p v-if="project.tagline" class="mt-3 text-lg text-[var(--text-secondary)]">{{ project.tagline }}</p>

      <div v-if="project.techStack.length" class="mt-6 flex flex-wrap gap-2">
        <span
          v-for="tech in project.techStack"
          :key="tech"
          class="text-xs px-2 py-1 rounded bg-[var(--surface-subtle)] text-[var(--text-tertiary)]"
        >
          {{ tech }}
        </span>
      </div>

      <div class="mt-6 flex gap-3">
        <a
          v-if="project.repoUrl"
          :href="project.repoUrl"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] transition-colors no-underline"
        >
          Repository →
        </a>
        <a
          v-if="project.demoUrl"
          :href="project.demoUrl"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-[var(--ui-color-primary-500)] text-white hover:bg-[var(--ui-color-primary-600)] transition-colors no-underline"
        >
          Live Demo →
        </a>
      </div>

      <div v-if="project.links.length" class="mt-4 flex flex-wrap gap-3">
        <a
          v-for="link in project.links"
          :key="link.id"
          :href="link.url"
          target="_blank"
          rel="noopener"
          class="text-sm text-[var(--ui-color-primary-500)] hover:underline"
        >
          {{ link.label }}
        </a>
      </div>

      <div class="mt-12 prose prose-lg max-w-none text-[var(--text-secondary)]">
        <ContentMarkdownView :content="project.descriptionMarkdown" />
      </div>
    </template>

    <div v-else class="text-center py-24">
      <p class="text-lg text-[var(--text-tertiary)]">Project not found.</p>
      <NuxtLink to="/projects" class="mt-4 inline-block text-[var(--ui-color-primary-500)]">Back to projects</NuxtLink>
    </div>
  </div>
</template>
