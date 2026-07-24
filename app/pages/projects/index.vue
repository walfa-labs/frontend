<script setup lang="ts">
const { list } = useProjects()
const config = useRuntimeConfig()
const profile = useState<Profile | null>('profile', () => null)

const { data } = await useAsyncData(
  'projects-list',
  () => list(),
  { default: () => ({ data: [] }) },
)

const projects = computed(() => data.value?.data ?? [])

useSeoMeta({
  title: `Projects — ${profile.value?.name || config.public.siteName}`,
  description: 'A collection of projects I have built.',
  ogTitle: `Projects — ${profile.value?.name || config.public.siteName}`,
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
  <div>
    <!-- Header -->
    <section class="hero-bg">
      <div class="mx-auto max-w-5xl px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div>
          <p class="editorial-label mb-4">Projects</p>
          <h1 class="editorial-heading text-[clamp(2rem,5vw,3.5rem)] text-[var(--text-primary)]">
            Things I've built
          </h1>
          <p class="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl">
            A selection of work spanning backend systems, developer tools, and web applications.
          </p>
        </div>
      </div>
    </section>

    <!-- Projects grid -->
    <div class="mx-auto max-w-5xl px-6 pb-20">
      <div v-if="projects.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NuxtLink
          v-for="project in projects"
          :key="project.id"
          :to="`/projects/${project.slug}`"
          class=" card-accent p-7 no-underline group block"
        >
          <div class="flex items-start justify-between gap-3">
            <h3 class="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
              {{ project.title }}
            </h3>
            <UIcon
              v-if="project.featured"
              name="lucide:star"
              class="text-[var(--accent)] shrink-0 mt-0.5"
            />
          </div>
          <p v-if="project.tagline" class="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
            {{ project.tagline }}
          </p>
          <div v-if="project.techStack.length" class="mt-5 flex flex-wrap gap-1.5">
            <span
              v-for="tech in project.techStack.slice(0, 5)"
              :key="tech"
              class="tag-default"
            >
              {{ tech }}
            </span>
          </div>
          <div class="mt-5 flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
            <span v-if="project.repoUrl" class="flex items-center gap-1">
              <UIcon name="lucide:github" class="size-3.5" /> Code
            </span>
            <span v-if="project.demoUrl" class="flex items-center gap-1">
              <UIcon name="lucide:external-link" class="size-3.5" /> Demo
            </span>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="text-center py-32">
        <UIcon name="lucide:folder-open" class="size-12 text-[var(--text-tertiary)] mx-auto" />
        <p class="mt-4 text-[var(--text-tertiary)]">No projects published yet.</p>
      </div>
    </div>
  </div>
</template>
