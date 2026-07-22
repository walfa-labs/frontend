<script setup lang="ts">
const config = useRuntimeConfig()
const { list: listProjects } = useProjects()
const { list: listPosts } = usePosts()
const { summary } = useStats()

const { data: projectsData } = await useAsyncData(
  'featured-projects',
  () => listProjects({ featured: true }),
  { default: () => ({ data: [] }) },
)

const { data: postsData } = await useAsyncData(
  'recent-posts',
  () => listPosts({ page: 1 }),
  { default: () => ({ data: [] }) },
)

const { data: statsData } = await useAsyncData(
  'stats-summary',
  () => summary(),
  { default: () => ({ data: null }) },
)

const featuredProjects = computed(() => projectsData.value?.data ?? [])
const recentPosts = computed(() => postsData.value?.data?.slice(0, 5) ?? [])
const stats = computed(() => statsData.value?.data ?? null)

useSeoMeta({
  title: `${config.public.siteName} — Software Engineer`,
  description: 'Personal portfolio showcasing projects, blog posts, and professional experience.',
  ogTitle: `${config.public.siteName} — Software Engineer`,
  ogDescription: 'Personal portfolio showcasing projects, blog posts, and professional experience.',
  ogType: 'website',
  ogUrl: config.public.siteUrl,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: config.public.siteUrl }],
})
</script>

<template>
  <div>
    <LandingHero />

    <!-- Stats strip -->
    <section v-if="stats" class="py-12 border-y border-default">
      <UContainer>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p class="text-4xl font-bold text-primary">{{ stats.publishedProjects }}</p>
            <p class="text-sm text-muted mt-1">Projects</p>
          </div>
          <div>
            <p class="text-4xl font-bold text-primary">{{ stats.publishedPosts }}</p>
            <p class="text-sm text-muted mt-1">Blog Posts</p>
          </div>
          <div>
            <p class="text-4xl font-bold text-primary">{{ stats.yearsExperience }}</p>
            <p class="text-sm text-muted mt-1">Years Experience</p>
          </div>
          <div>
            <p class="text-4xl font-bold text-primary">{{ stats.totalPostViews.toLocaleString() }}</p>
            <p class="text-sm text-muted mt-1">Total Views</p>
          </div>
        </div>
      </UContainer>
    </section>

    <LandingFeaturedProjects
      v-if="featuredProjects.length"
      :projects="featuredProjects"
    />

    <LandingRecentPosts
      v-if="recentPosts.length"
      :posts="recentPosts"
    />
  </div>
</template>
