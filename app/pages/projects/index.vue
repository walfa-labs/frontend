<script setup lang="ts">
const { list } = useProjects()
const config = useRuntimeConfig()

const { data } = await useAsyncData(
  'projects-list',
  () => list(),
  { default: () => ({ data: [] }) },
)

const projects = computed(() => data.value?.data ?? [])

useSeoMeta({
  title: `Projects — ${config.public.siteName}`,
  description: 'A collection of projects I have built.',
  ogTitle: `Projects — ${config.public.siteName}`,
  ogDescription: 'A collection of projects I have built.',
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}/projects`,
  twitterCard: 'summary_large_image',
})
useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}/projects` }],
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-6 py-16">
    <div class="reveal mb-16">
      <p class="editorial-label mb-4">Projects</p>
      <h1 class="editorial-heading text-[clamp(2rem,5vw,3.5rem)] text-[var(--text-primary)]">
        Things I've built
      </h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NuxtLink
        v-for="project in projects"
        :key="project.id"
        :to="`/projects/${project.slug}`"
        class="reveal block p-6 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-colors no-underline group"
      >
        <h3 class="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--ui-color-primary-500)] transition-colors">
          {{ project.title }}
        </h3>
        <p v-if="project.tagline" class="mt-2 text-sm text-[var(--text-secondary)]">{{ project.tagline }}</p>
        <div v-if="project.techStack.length" class="mt-4 flex flex-wrap gap-1.5">
          <span
            v-for="tech in project.techStack"
            :key="tech"
            class="text-xs px-2 py-0.5 rounded bg-[var(--surface-subtle)] text-[var(--text-tertiary)]"
          >
            {{ tech }}
          </span>
        </div>
      </NuxtLink>
    </div>

    <div v-if="projects.length === 0" class="text-center py-24">
      <p class="text-[var(--text-tertiary)]">No projects published yet.</p>
    </div>
  </div>
</template>
