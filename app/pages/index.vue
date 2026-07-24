<script setup lang="ts">
import type { Profile } from '~/types/api'

const config = useRuntimeConfig()
const profile = useState<Profile | null>('profile', () => null)
const { list: listProjects } = useProjects()
const { list: listExperiences } = useExperiences()
const { list: listPosts } = usePosts()

const { data: projectsData } = useAsyncData(
  'home-projects',
  () => listProjects(),
  { default: () => ({ data: [] }) },
)

const { data: experiencesData } = useAsyncData(
  'home-experiences',
  () => listExperiences(),
  { default: () => ({ data: [] }) },
)

const { data: postsData } = useAsyncData(
  'home-posts',
  () => listPosts({ page: 1 }),
  { default: () => ({ data: [] }) },
)

const featuredProjects = computed(() => (projectsData.value?.data ?? []).slice(0, 3))
const recentExperiences = computed(() => (experiencesData.value?.data ?? []).slice(0, 3))
const recentPosts = computed(() => (postsData.value?.data ?? []).slice(0, 3))

// Inline expansion state
const expandedProject = ref<string | null>(null)
const expandedExperience = ref<string | null>(null)

function toggleProject(id: string) {
  expandedProject.value = expandedProject.value === id ? null : id
}
function toggleExperience(id: string) {
  expandedExperience.value = expandedExperience.value === id ? null : id
}

function formatDate(date: string | null): string {
  if (!date) return 'Present'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

useSeoMeta({
  title: `${profile.value?.name || config.public.siteName} — Software Engineer`,
  description: profile.value?.tagline || 'Software engineer building fast, reliable systems.',
  ogTitle: `${profile.value?.name || config.public.siteName} — Software Engineer`,
  ogDescription: profile.value?.tagline || 'Software engineer building fast, reliable systems.',
  ogType: 'website',
  ogUrl: config.public.siteUrl,
  twitterCard: 'summary_large_image',
})
useHead({
  link: [{ rel: 'canonical', href: config.public.siteUrl }],
})
</script>

<template>
  <div ref="container" class="font-mono fade-in">
    <!-- ── Terminal-style Hero ── -->
    <section class="border-b border-[var(--border-subtle)]">
      <div class="mx-auto max-w-5xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div>
          <!-- Window chrome -->
          <div class="flex items-center gap-2 mb-8">
            <span class="w-3 h-3 rounded-full bg-red-400" />
            <span class="w-3 h-3 rounded-full bg-yellow-400" />
            <span class="w-3 h-3 rounded-full bg-green-400" />
            <span class="ml-3 text-xs text-[var(--text-tertiary)]">~ / {{ (profile?.name || config.public.siteName).toLowerCase().replace(/\s+/g, '-') }} — zsh</span>
          </div>

          <!-- Terminal lines -->
          <div class="space-y-3 text-sm md:text-base">
            <div class="flex items-start gap-3">
              <span class="text-[var(--accent)] select-none shrink-0">$</span>
              <span class="text-[var(--text-secondary)]">whoami</span>
            </div>
            <div class="pl-6 text-[var(--text-primary)]">
              <h1 class="editorial-heading text-[clamp(2rem,6vw,3.5rem)] font-display">
                {{ profile?.name || config.public.siteName }}
              </h1>
            </div>

            <div class="flex items-start gap-3 pt-2">
              <span class="text-[var(--accent)] select-none shrink-0">$</span>
              <span class="text-[var(--text-secondary)]">cat tagline.txt</span>
            </div>
            <p class="pl-6 text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              {{ profile?.tagline || 'Software engineer building fast, reliable systems with Go and TypeScript.' }}
            </p>

            <!-- Social links as shell output -->
            <div v-if="profile?.githubUrl || profile?.linkedinUrl || profile?.twitterUrl || profile?.location" class="flex items-start gap-3 pt-2">
              <span class="text-[var(--accent)] select-none shrink-0">$</span>
              <span class="text-[var(--text-secondary)]">links --list</span>
            </div>
            <div class="pl-6 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-[var(--text-tertiary)]">
              <span v-if="profile?.location" class="inline-flex items-center gap-1.5">
                <UIcon name="lucide:map-pin" class="size-3.5 text-[var(--accent)]" />
                {{ profile.location }}
              </span>
              <a v-if="profile?.githubUrl" :href="profile.githubUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors no-underline">
                <UIcon name="lucide:github" class="size-3.5" /> github
              </a>
              <a v-if="profile?.linkedinUrl" :href="profile.linkedinUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors no-underline">
                <UIcon name="lucide:linkedin" class="size-3.5" /> linkedin
              </a>
              <a v-if="profile?.twitterUrl" :href="profile.twitterUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors no-underline">
                <UIcon name="lucide:twitter" class="size-3.5" /> twitter
              </a>
            </div>

            <!-- CTAs -->
            <div class="flex items-start gap-3 pt-4">
              <span class="text-[var(--accent)] select-none shrink-0">$</span>
              <span class="text-[var(--text-secondary)]">cd projects/ && ls</span>
            </div>
          </div>

          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/projects" class="btn-primary no-underline">
              <UIcon name="lucide:folder-git-2" class="size-4" />
              View Projects
            </NuxtLink>
            <NuxtLink to="/blog" class="btn-secondary no-underline">
              <UIcon name="lucide:book-open" class="size-4" />
              Read Blog
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Experience (expandable) ── -->
    <section v-if="recentExperiences.length" class="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <div class="flex items-end justify-between mb-8">
        <div>
          <p class="editorial-label mb-2">Experience</p>
          <h2 class="editorial-heading text-2xl md:text-3xl text-[var(--text-primary)]">Where I've worked</h2>
        </div>
        <NuxtLink to="/about" class="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] no-underline inline-flex items-center gap-1">
          View all
          <UIcon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
      </div>

      <div class="space-y-3">
        <div
          v-for="exp in recentExperiences"
          :key="exp.id"
          class=" border border-[var(--border-subtle)] rounded-lg overflow-hidden"
        >
          <!-- Clickable header -->
          <button
            class="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
            @click="toggleExperience(exp.id)"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div class="shrink-0">
                <p class="text-xs text-[var(--text-tertiary)] font-mono">{{ formatDate(exp.startDate) }} — {{ formatDate(exp.endDate) }}</p>
              </div>
              <div class="min-w-0">
                <h3 class="text-base font-semibold text-[var(--text-primary)] truncate">{{ exp.roleTitle }}</h3>
                <p class="text-sm text-[var(--text-secondary)]">{{ exp.organization }}<span v-if="exp.location" class="text-[var(--text-tertiary)]"> · {{ exp.location }}</span></p>
              </div>
            </div>
            <UIcon
              :name="expandedExperience === exp.id ? 'lucide:chevron-down' : 'lucide:chevron-right'"
              class="size-5 text-[var(--text-tertiary)] shrink-0 transition-transform"
            />
          </button>

          <!-- Expanded content -->
          <div class="expand-grid" :class="{ open: expandedExperience === exp.id }">
            <div>
              <div class="px-5 pb-5 pt-0 border-t border-[var(--border-subtle)]">
                <p v-if="exp.summaryMarkdown" class="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">{{ exp.summaryMarkdown }}</p>
                <ul v-if="exp.highlights.length" class="mt-3 space-y-2">
                  <li
                    v-for="(highlight, i) in exp.highlights"
                    :key="i"
                    class="text-sm text-[var(--text-secondary)] flex items-start gap-2"
                  >
                    <UIcon name="lucide:check" class="size-4 text-[var(--accent)] mt-0.5 shrink-0" />
                    <ContentMarkdownView :content="highlight.bodyMarkdown" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="featuredProjects.length || recentPosts.length" class="mx-auto max-w-5xl px-6"><div class="section-divider" /></div>

    <!-- ── Projects (expandable) ── -->
    <section v-if="featuredProjects.length" class="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <div class="flex items-end justify-between mb-8">
        <div>
          <p class="editorial-label mb-2">Projects</p>
          <h2 class="editorial-heading text-2xl md:text-3xl text-[var(--text-primary)]">Things I've built</h2>
        </div>
        <NuxtLink to="/projects" class="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] no-underline inline-flex items-center gap-1">
          View all
          <UIcon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
      </div>

      <div class="space-y-3">
        <div
          v-for="project in featuredProjects"
          :key="project.id"
          class=" border border-[var(--border-subtle)] rounded-lg overflow-hidden"
        >
          <!-- Clickable header -->
          <button
            class="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer group"
            @click="toggleProject(project.id)"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div class="shrink-0">
                <UIcon name="lucide:folder-git-2" class="size-5 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" />
              </div>
              <div class="min-w-0">
                <h3 class="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">{{ project.title }}</h3>
                <p v-if="project.tagline" class="text-sm text-[var(--text-secondary)] truncate">{{ project.tagline }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <div v-if="project.techStack.length" class="hidden md:flex gap-1.5">
                <span
                  v-for="tech in project.techStack.slice(0, 3)"
                  :key="tech"
                  class="tag-default"
                >
                  {{ tech }}
                </span>
              </div>
              <UIcon
                :name="expandedProject === project.id ? 'lucide:chevron-down' : 'lucide:chevron-right'"
                class="size-5 text-[var(--text-tertiary)] shrink-0 transition-transform"
              />
            </div>
          </button>

          <!-- Expanded content -->
          <div class="expand-grid" :class="{ open: expandedProject === project.id }">
            <div>
              <div class="px-5 pb-5 pt-0 border-t border-[var(--border-subtle)]">
                <p v-if="project.descriptionMarkdown" class="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">{{ project.descriptionMarkdown }}</p>
                <div v-if="project.techStack.length" class="mt-4 flex flex-wrap gap-1.5">
                  <span v-for="tech in project.techStack" :key="tech" class="tag-default">{{ tech }}</span>
                </div>
                <div class="mt-4 flex items-center gap-4">
                  <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" rel="noopener noreferrer" class="text-sm text-[var(--accent)] hover:underline inline-flex items-center gap-1">
                    <UIcon name="lucide:github" class="size-4" /> Repository
                  </a>
                  <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" rel="noopener noreferrer" class="text-sm text-[var(--accent)] hover:underline inline-flex items-center gap-1">
                    <UIcon name="lucide:external-link" class="size-4" /> Live Demo
                  </a>
                  <NuxtLink :to="`/projects/${project.slug}`" class="text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] inline-flex items-center gap-1 ml-auto">
                    Full details <UIcon name="lucide:arrow-right" class="size-3.5" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="featuredProjects.length && recentPosts.length" class="mx-auto max-w-5xl px-6"><div class="section-divider" /></div>

    <!-- ── Recent posts ── -->
    <section v-if="recentPosts.length" class="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <div class="flex items-end justify-between mb-8">
        <div>
          <p class="editorial-label mb-2">Writing</p>
          <h2 class="editorial-heading text-2xl md:text-3xl text-[var(--text-primary)]">Recent posts</h2>
        </div>
        <NuxtLink to="/blog" class="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] no-underline inline-flex items-center gap-1">
          View all
          <UIcon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
      </div>
      <div class="space-y-3">
        <NuxtLink
          v-for="post in recentPosts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class=" flex items-center justify-between gap-4 p-5 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-default)] hover:bg-[var(--surface-subtle)] transition-colors no-underline group"
        >
          <div class="min-w-0 flex-1">
            <h3 class="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">{{ post.title }}</h3>
            <p v-if="post.excerpt" class="mt-1 text-sm text-[var(--text-secondary)] line-clamp-1">{{ post.excerpt }}</p>
          </div>
          <time v-if="post.publishedAt" class="text-xs text-[var(--text-tertiary)] whitespace-nowrap shrink-0 font-mono">
            {{ formatDate(post.publishedAt) }}
          </time>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>


