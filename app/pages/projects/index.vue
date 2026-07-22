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
  <div>
    <UContainer class="py-16">
      <h1 class="text-4xl font-bold text-highlighted mb-12">Projects</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LandingProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>
    </UContainer>
  </div>
</template>
