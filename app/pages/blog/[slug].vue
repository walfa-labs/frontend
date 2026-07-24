<script setup lang="ts">
import type { Profile } from '~/types/api'

const route = useRoute()
const { getBySlug } = usePosts()
const config = useRuntimeConfig()
const profile = useState<Profile | null>('profile', () => null)

const slug = computed(() => route.params.slug as string)

const { data } = await useAsyncData(
  () => `post-${slug.value}`,
  () => getBySlug(slug.value),
)

const post = computed(() => data.value?.data ?? null)
const url = computed(() => `${config.public.siteUrl}/blog/${slug.value}`)

useSeoMeta({
  title: post.value ? `${post.value.title} — ${profile.value?.name || config.public.siteName}` : 'Blog Post',
  description: post.value?.excerpt ?? '',
  ogTitle: post.value?.title ?? '',
  ogDescription: post.value?.excerpt ?? '',
  ogImage: post.value?.coverImageUrl ?? undefined,
  ogUrl: url.value,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: post.value?.title ?? '',
  twitterDescription: post.value?.excerpt ?? '',
  twitterImage: post.value?.coverImageUrl ?? undefined,
})

useHead({
  link: [{ rel: 'canonical', href: url.value }],
  script: post.value ? [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.value.title,
      description: post.value.excerpt,
      image: post.value.coverImageUrl,
      datePublished: post.value.publishedAt,
      url: url.value,
      keywords: post.value.tags.map((t) => t.name).join(', '),
    }),
  }] : [],
})

function formatDate(date: string | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div>
    <template v-if="post">
      <!-- Header -->
      <section class="hero-bg">
        <div class="mx-auto max-w-3xl px-6 pt-16 pb-12 md:pt-20 md:pb-16">
          <NuxtLink to="/blog" class="text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors no-underline inline-flex items-center gap-1 mb-8">
            <UIcon name="lucide:arrow-left" class="size-4" /> Back to blog
          </NuxtLink>
          <p class="editorial-label mb-4">Article</p>
          <h1 class="editorial-heading text-[clamp(1.75rem,4vw,2.75rem)] text-[var(--text-primary)]">{{ post.title }}</h1>

          <div class="mt-4 flex items-center gap-3 text-sm text-[var(--text-tertiary)]">
            <time v-if="post.publishedAt" class="font-mono">{{ formatDate(post.publishedAt) }}</time>
            <span>·</span>
            <span class="inline-flex items-center gap-1">
              <UIcon name="lucide:eye" class="size-3.5" /> {{ post.viewCount }} views
            </span>
          </div>

          <div v-if="post.tags.length" class="mt-4 flex flex-wrap gap-2">
            <NuxtLink
              v-for="tag in post.tags"
              :key="tag.id"
              :to="`/blog?tag=${tag.name}`"
              class="tag-default no-underline hover:bg-[var(--accent-glow)] transition-colors"
            >
              {{ tag.name }}
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Body -->
      <div class="mx-auto max-w-3xl px-6 py-16">
        <div class="prose prose-lg max-w-none text-[var(--text-secondary)]">
          <ContentMarkdownView :content="post.bodyMarkdown" />
        </div>
      </div>
    </template>

    <div v-else class="text-center py-32">
      <UIcon name="lucide:file-x" class="size-12 text-[var(--text-tertiary)] mx-auto" />
      <p class="mt-4 text-lg text-[var(--text-tertiary)]">Post not found.</p>
      <NuxtLink to="/blog" class="mt-4 inline-block text-[var(--accent)] hover:underline">Back to blog</NuxtLink>
    </div>
  </div>
</template>
