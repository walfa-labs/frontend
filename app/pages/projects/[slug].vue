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
  description: project.value?.tagline ?? project.value?.title ?? '',
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
    <UContainer class="py-16">
      <template v-if="project">
        <NuxtLink to="/projects" class="inline-flex items-center gap-1 text-sm text-muted hover:text-primary mb-8">
          <UIcon name="lucide:arrow-left" size="16" />
          Back to projects
        </NuxtLink>

        <h1 class="text-4xl font-bold text-highlighted">{{ project.title }}</h1>
        <p v-if="project.tagline" class="mt-3 text-xl text-muted">{{ project.tagline }}</p>

        <div v-if="project.techStack.length" class="mt-6 flex flex-wrap gap-2">
          <UBadge
            v-for="tech in project.techStack"
            :key="tech"
            :label="tech"
            color="neutral"
            variant="soft"
          />
        </div>

        <div class="mt-6 flex gap-3">
          <UButton
            v-if="project.repoUrl"
            :to="project.repoUrl"
            target="_blank"
            icon="lucide:github"
            variant="outline"
            color="neutral"
          >
            Repository
          </UButton>
          <UButton
            v-if="project.demoUrl"
            :to="project.demoUrl"
            target="_blank"
            icon="lucide:external-link"
            color="primary"
          >
            Live Demo
          </UButton>
        </div>

        <div v-if="project.links.length" class="mt-4 flex flex-wrap gap-3">
          <UButton
            v-for="link in project.links"
            :key="link.id"
            :to="link.url"
            target="_blank"
            variant="link"
            color="neutral"
            size="sm"
          >
            {{ link.label }}
          </UButton>
        </div>

        <div class="mt-12 prose prose-lg max-w-none">
          <ContentMarkdownView :content="project.descriptionMarkdown" />
        </div>
      </template>

      <div v-else class="text-center py-24">
        <p class="text-xl text-muted">Project not found.</p>
        <UButton to="/projects" class="mt-4">Back to projects</UButton>
      </div>
    </UContainer>
  </div>
</template>
