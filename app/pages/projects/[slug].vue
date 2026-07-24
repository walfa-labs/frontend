<script setup lang="ts">
import type { Profile } from '~/types/api'

const route = useRoute()
const { getBySlug } = useProjects()
const config = useRuntimeConfig()
const profile = useState<Profile | null>('profile', () => null)

const slug = computed(() => route.params.slug as string)

const { data } = await useAsyncData(
  () => `project-${slug.value}`,
  () => getBySlug(slug.value),
)

const project = computed(() => data.value?.data ?? null)
const url = computed(() => `${config.public.siteUrl}/projects/${slug.value}`)

useSeoMeta({
  title: project.value ? `${project.value.title} — ${profile.value?.name || config.public.siteName}` : 'Project',
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
  <div>
    <template v-if="project">
      <!-- Header -->
      <section class="hero-bg">
        <div class="mx-auto max-w-3xl px-6 pt-16 pb-12 md:pt-20 md:pb-16">
          <NuxtLink to="/projects" class="text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors no-underline inline-flex items-center gap-1 mb-8">
            <UIcon name="lucide:arrow-left" class="size-4" /> Back to projects
          </NuxtLink>
          <p class="editorial-label mb-4">Project</p>
          <h1 class="editorial-heading text-[clamp(1.75rem,4vw,2.5rem)] text-[var(--text-primary)]">{{ project.title }}</h1>
          <p v-if="project.tagline" class="mt-3 text-lg text-[var(--text-secondary)] leading-relaxed">{{ project.tagline }}</p>

          <div v-if="project.techStack.length" class="mt-6 flex flex-wrap gap-2">
            <span v-for="tech in project.techStack" :key="tech" class="tag-default">{{ tech }}</span>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" rel="noopener noreferrer" class="btn-primary no-underline">
              <UIcon name="lucide:github" class="size-4" /> Repository
            </a>
            <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" rel="noopener noreferrer" class="btn-secondary no-underline">
              <UIcon name="lucide:external-link" class="size-4" /> Live Demo
            </a>
          </div>

          <div v-if="project.links.length" class="mt-4 flex flex-wrap gap-3">
            <a v-for="link in project.links" :key="link.id" :href="link.url" target="_blank" rel="noopener noreferrer" class="text-sm text-[var(--accent)] hover:underline inline-flex items-center gap-1">
              <UIcon name="lucide:link" class="size-3.5" /> {{ link.label }}
            </a>
          </div>
        </div>
      </section>

      <!-- Body -->
      <div class="mx-auto max-w-3xl px-6 py-16">
        <div class="prose prose-lg max-w-none text-[var(--text-secondary)]">
          <ContentMarkdownView :content="project.descriptionMarkdown" />
        </div>
      </div>
    </template>

    <div v-else class="text-center py-32">
      <UIcon name="lucide:folder-x" class="size-12 text-[var(--text-tertiary)] mx-auto" />
      <p class="mt-4 text-lg text-[var(--text-tertiary)]">Project not found.</p>
      <NuxtLink to="/projects" class="mt-4 inline-block text-[var(--accent)] hover:underline">Back to projects</NuxtLink>
    </div>
  </div>
</template>
