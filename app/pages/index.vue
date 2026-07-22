<script setup lang="ts">
const config = useRuntimeConfig()
const { list: listProjects } = useProjects()
const { list: listExperiences } = useExperiences()
const { list: listPosts } = usePosts()
const { summary } = useStats()

const { data: projectsData } = await useAsyncData(
  'home-projects',
  () => listProjects(),
  { default: () => ({ data: [] }) },
)

const { data: experiencesData } = await useAsyncData(
  'home-experiences',
  () => listExperiences(),
  { default: () => ({ data: [] }) },
)

const { data: postsData } = await useAsyncData(
  'home-posts',
  () => listPosts({ page: 1 }),
  { default: () => ({ data: [] }) },
)

const { data: statsData } = await useAsyncData(
  'home-stats',
  () => summary(),
  { default: () => ({ data: null }) },
)

const featuredProjects = computed(() => (projectsData.value?.data ?? []).slice(0, 3))
const recentExperiences = computed(() => (experiencesData.value?.data ?? []).slice(0, 3))
const recentPosts = computed(() => (postsData.value?.data ?? []).slice(0, 3))
const stats = computed(() => statsData.value?.data ?? null)

function formatDate(date: string | null): string {
  if (!date) return 'Present'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

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
  <div ref="container">
    <!-- Hero -->
    <section class="mx-auto max-w-5xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
      <div class="reveal hero-anim">
        <p class="editorial-label mb-6">Portfolio</p>
        <h1 class="editorial-heading text-[clamp(2.5rem,7vw,5rem)] text-[var(--text-primary)]">
          Hi, I'm {{ config.public.siteName }}.
        </h1>
        <p class="mt-6 text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          Software engineer building fast, reliable systems with Go and TypeScript.
          Currently focused on distributed backends and developer tooling.
        </p>
        <div class="mt-10 flex flex-wrap gap-4">
          <NuxtLink
            to="/projects"
            class="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg bg-[var(--ui-color-primary-500)] text-white hover:bg-[var(--ui-color-primary-600)] transition-colors no-underline"
          >
            View Projects
          </NuxtLink>
          <NuxtLink
            to="/blog"
            class="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] transition-colors no-underline"
          >
            Read Blog
          </NuxtLink>
        </div>
      </div>

      <!-- Stats strip -->
      <div v-if="stats" class="reveal mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-[var(--border-subtle)]">
        <div>
          <p class="editorial-heading text-3xl text-[var(--text-primary)]">{{ stats.publishedProjects }}</p>
          <p class="text-sm text-[var(--text-tertiary)] mt-1">Projects</p>
        </div>
        <div>
          <p class="editorial-heading text-3xl text-[var(--text-primary)]">{{ stats.publishedPosts }}</p>
          <p class="text-sm text-[var(--text-tertiary)] mt-1">Blog Posts</p>
        </div>
        <div>
          <p class="editorial-heading text-3xl text-[var(--text-primary)]">{{ stats.yearsExperience }}</p>
          <p class="text-sm text-[var(--text-tertiary)] mt-1">Years Exp.</p>
        </div>
        <div>
          <p class="editorial-heading text-3xl text-[var(--text-primary)]">{{ stats.totalPostViews.toLocaleString() }}</p>
          <p class="text-sm text-[var(--text-tertiary)] mt-1">Total Views</p>
        </div>
      </div>
    </section>

    <!-- Experience section (3 items) -->
    <section v-if="recentExperiences.length" class="mx-auto max-w-5xl px-6 py-16 border-t border-[var(--border-subtle)]">
      <div class="flex items-end justify-between mb-10">
        <div>
          <p class="editorial-label mb-2">Experience</p>
          <h2 class="editorial-heading text-3xl text-[var(--text-primary)]">Where I've worked</h2>
        </div>
        <NuxtLink to="/about" class="text-sm font-medium text-[var(--ui-color-primary-500)] hover:text-[var(--ui-color-primary-600)] no-underline">
          View all →
        </NuxtLink>
      </div>
      <div class="space-y-8">
        <div
          v-for="exp in recentExperiences"
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

    <!-- Projects section (3 items) -->
    <section v-if="featuredProjects.length" class="mx-auto max-w-5xl px-6 py-16 border-t border-[var(--border-subtle)]">
      <div class="flex items-end justify-between mb-10">
        <div>
          <p class="editorial-label mb-2">Projects</p>
          <h2 class="editorial-heading text-3xl text-[var(--text-primary)]">Things I've built</h2>
        </div>
        <NuxtLink to="/projects" class="text-sm font-medium text-[var(--ui-color-primary-500)] hover:text-[var(--ui-color-primary-600)] no-underline">
          View all →
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="project in featuredProjects"
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
              v-for="tech in project.techStack.slice(0, 4)"
              :key="tech"
              class="text-xs px-2 py-0.5 rounded bg-[var(--surface-subtle)] text-[var(--text-tertiary)]"
            >
              {{ tech }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Recent posts -->
    <section v-if="recentPosts.length" class="mx-auto max-w-5xl px-6 py-16 border-t border-[var(--border-subtle)]">
      <div class="flex items-end justify-between mb-10">
        <div>
          <p class="editorial-label mb-2">Writing</p>
          <h2 class="editorial-heading text-3xl text-[var(--text-primary)]">Recent posts</h2>
        </div>
        <NuxtLink to="/blog" class="text-sm font-medium text-[var(--ui-color-primary-500)] hover:text-[var(--ui-color-primary-600)] no-underline">
          View all →
        </NuxtLink>
      </div>
      <div class="space-y-4">
        <NuxtLink
          v-for="post in recentPosts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="reveal block p-5 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-colors no-underline"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <h3 class="text-base font-semibold text-[var(--text-primary)] truncate">{{ post.title }}</h3>
              <p v-if="post.excerpt" class="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">{{ post.excerpt }}</p>
            </div>
            <time v-if="post.publishedAt" class="text-xs text-[var(--text-tertiary)] whitespace-nowrap shrink-0">
              {{ formatDate(post.publishedAt) }}
            </time>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
