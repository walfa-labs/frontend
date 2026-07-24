<script setup lang="ts">
import type { Profile } from '~/types/api'

const { list } = usePosts()
const route = useRoute()
const config = useRuntimeConfig()
const profile = useState<Profile | null>('profile', () => null)

const page = ref(1)
const activeTag = ref<string | undefined>((route.query.tag as string) || undefined)

watch(() => route.query.tag, (val) => {
  activeTag.value = (val as string) || undefined
  page.value = 1
})
const { data } = await useAsyncData(
  'blog-posts',
  () => list({ page: page.value, tag: activeTag.value }),
  {
    default: () => ({ data: [], meta: { page: 1, perPage: 10, total: 0 } }),
    watch: [page, activeTag],
  },
)

const posts = computed(() => data.value?.data ?? [])
const totalPages = computed(() =>
  Math.ceil((data.value?.meta?.total ?? 0) / (data.value?.meta?.perPage ?? 10)),
)

function setTag(tag: string | undefined) {
  activeTag.value = tag
  page.value = 1
}

function formatDate(date: string | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

useSeoMeta({
  title: `Blog — ${profile.value?.name || config.public.siteName}`,
  description: 'Articles on software engineering, Go, TypeScript, and more.',
  ogTitle: `Blog — ${profile.value?.name || config.public.siteName}`,
  ogDescription: 'Articles on software engineering, Go, TypeScript, and more.',
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}/blog`,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <!-- Header -->
    <section class="hero-bg">
      <div class="mx-auto max-w-3xl px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div>
          <p class="editorial-label mb-4">Writing</p>
          <h1 class="editorial-heading text-[clamp(2rem,5vw,3.5rem)] text-[var(--text-primary)]">
            Blog
          </h1>
          <p class="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl">
            Articles on software engineering, Go, TypeScript, and more.
          </p>
        </div>
      </div>
    </section>

    <!-- Posts -->
    <div class="mx-auto max-w-3xl px-6 pb-20">
      <!-- Tag filter -->
      <div v-if="activeTag" class="mb-8 flex items-center gap-2">
        <span class="text-sm text-[var(--text-tertiary)]">Filtering by:</span>
        <span class="tag-default">{{ activeTag }}</span>
        <button
          class="text-[var(--text-tertiary)] hover:text-[var(--accent)] text-sm transition-colors"
          aria-label="Clear tag filter"
          @click="setTag(undefined)"
        >
          <UIcon name="lucide:x" class="size-3.5" />
        </button>
      </div>

      <div v-if="posts.length" class="space-y-5">
        <div
          v-for="post in posts"
          :key="post.id"
          class=" card-elevated p-6 group"
        >
          <NuxtLink :to="`/blog/${post.slug}`" class="no-underline block">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0 flex-1">
                <h3 class="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{{ post.title }}</h3>
                <p v-if="post.excerpt" class="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{{ post.excerpt }}</p>
              </div>
              <time v-if="post.publishedAt" class="text-xs text-[var(--text-tertiary)] whitespace-nowrap shrink-0 mt-1">
                {{ formatDate(post.publishedAt) }}
              </time>
            </div>
          </NuxtLink>
          <div v-if="post.tags.length" class="mt-4 flex flex-wrap gap-1.5">
            <button
              v-for="tag in post.tags"
              :key="tag.id"
              class="tag-default cursor-pointer border-0"
              @click="setTag(tag.name)"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-32">
        <UIcon name="lucide:file-text" class="size-12 text-[var(--text-tertiary)] mx-auto" />
        <p class="mt-4 text-[var(--text-tertiary)]">No posts found.</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-12 flex items-center justify-center gap-3">
        <button
          :disabled="page <= 1"
          class="px-4 py-2 text-sm rounded-lg border border-[var(--border-default)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] transition-colors"
          @click="page--"
        >
          ← Prev
        </button>
        <span class="text-sm text-[var(--text-tertiary)]">Page {{ page }} of {{ totalPages }}</span>
        <button
          :disabled="page >= totalPages"
          class="px-4 py-2 text-sm rounded-lg border border-[var(--border-default)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] transition-colors"
          @click="page++"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
</template>
