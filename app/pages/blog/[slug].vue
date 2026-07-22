<script setup lang="ts">
const route = useRoute()
const { getBySlug } = usePosts()
const config = useRuntimeConfig()

const slug = computed(() => route.params.slug as string)

const { data } = await useAsyncData(
  () => `post-${slug.value}`,
  () => getBySlug(slug.value),
)

const post = computed(() => data.value?.data ?? null)
const url = computed(() => `${config.public.siteUrl}/blog/${slug.value}`)

useSeoMeta({
  title: post.value ? `${post.value.title} — ${config.public.siteName}` : 'Blog Post',
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
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 py-16">
    <template v-if="post">
      <NuxtLink to="/blog" class="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors no-underline inline-flex items-center gap-1 mb-8">
        ← Back to blog
      </NuxtLink>

      <p class="editorial-label mb-4">Article</p>
      <h1 class="editorial-heading text-[clamp(1.75rem,4vw,2.75rem)] text-[var(--text-primary)]">{{ post.title }}</h1>

      <div class="mt-4 flex items-center gap-3 text-sm text-[var(--text-tertiary)]">
        <time v-if="post.publishedAt">{{ new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</time>
        <span>·</span>
        <span>{{ post.viewCount }} views</span>
      </div>

      <div v-if="post.tags.length" class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in post.tags"
          :key="tag.id"
          class="text-xs px-2 py-0.5 rounded bg-[var(--surface-subtle)] text-[var(--text-tertiary)]"
        >
          {{ tag.name }}
        </span>
      </div>

      <div class="mt-12 prose prose-lg max-w-none text-[var(--text-secondary)]">
        <ContentMarkdownView :content="post.bodyMarkdown" />
      </div>
    </template>

    <div v-else class="text-center py-24">
      <p class="text-lg text-[var(--text-tertiary)]">Post not found.</p>
      <NuxtLink to="/blog" class="mt-4 inline-block text-[var(--ui-color-primary-500)]">Back to blog</NuxtLink>
    </div>
  </div>
</template>
