<script setup lang="ts">
const { list } = usePosts()
const config = useRuntimeConfig()

const page = ref(1)
const activeTag = ref<string | undefined>()

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
  title: `Blog — ${config.public.siteName}`,
  description: 'Articles on software engineering, Go, TypeScript, and more.',
  ogTitle: `Blog — ${config.public.siteName}`,
  ogDescription: 'Articles on software engineering, Go, TypeScript, and more.',
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}/blog`,
  twitterCard: 'summary_large_image',
})
useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}/blog` }],
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 py-16">
    <div class="reveal mb-16">
      <p class="editorial-label mb-4">Writing</p>
      <h1 class="editorial-heading text-[clamp(2rem,5vw,3.5rem)] text-[var(--text-primary)]">
        Blog
      </h1>
    </div>

    <!-- Tag filter -->
    <div v-if="activeTag" class="mb-6 flex items-center gap-2">
      <span class="text-sm text-[var(--text-tertiary)]">Filtering by:</span>
      <span class="text-sm font-medium px-2.5 py-0.5 rounded bg-[var(--surface-subtle)] text-[var(--text-primary)]">{{ activeTag }}</span>
      <button
        class="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-sm"
        aria-label="Clear tag filter"
        @click="setTag(undefined)"
      >
        ✕
      </button>
    </div>

    <div class="space-y-4">
      <NuxtLink
        v-for="post in posts"
        :key="post.id"
        :to="`/blog/${post.slug}`"
        class="reveal block p-5 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-colors no-underline"
      >
        <h3 class="text-base font-semibold text-[var(--text-primary)]">{{ post.title }}</h3>
        <p v-if="post.excerpt" class="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">{{ post.excerpt }}</p>
        <div class="mt-3 flex items-center justify-between">
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in post.tags"
              :key="tag.id"
              class="text-xs px-2 py-0.5 rounded bg-[var(--surface-subtle)] text-[var(--text-tertiary)]"
            >
              {{ tag.name }}
            </span>
          </div>
          <time v-if="post.publishedAt" class="text-xs text-[var(--text-tertiary)] whitespace-nowrap">
            {{ formatDate(post.publishedAt) }}
          </time>
        </div>
      </NuxtLink>
    </div>

    <div v-if="posts.length === 0" class="text-center py-24">
      <p class="text-[var(--text-tertiary)]">No posts found.</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-12 flex items-center justify-center gap-3">
      <button
        :disabled="page <= 1"
        class="px-3 py-1.5 text-sm rounded border border-[var(--border-default)] disabled:opacity-40 text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] transition-colors"
        @click="page--"
      >
        ← Prev
      </button>
      <span class="text-sm text-[var(--text-tertiary)]">Page {{ page }} of {{ totalPages }}</span>
      <button
        :disabled="page >= totalPages"
        class="px-3 py-1.5 text-sm rounded border border-[var(--border-default)] disabled:opacity-40 text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] transition-colors"
        @click="page++"
      >
        Next →
      </button>
    </div>
  </div>
</template>
