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
  // JSON-LD structured data for blog posts (Article schema)
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
  <div>
    <UContainer class="py-16 max-w-3xl">
      <template v-if="post">
        <NuxtLink to="/blog" class="inline-flex items-center gap-1 text-sm text-muted hover:text-primary mb-8">
          <UIcon name="lucide:arrow-left" size="16" />
          Back to blog
        </NuxtLink>

        <h1 class="text-4xl font-bold text-highlighted">{{ post.title }}</h1>

        <div class="mt-4 flex items-center gap-4 text-sm text-muted">
          <time v-if="post.publishedAt">
            {{ new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </time>
          <span>·</span>
          <span>{{ post.viewCount }} views</span>
        </div>

        <div v-if="post.tags.length" class="mt-4 flex flex-wrap gap-2">
          <UBadge
            v-for="tag in post.tags"
            :key="tag.id"
            :label="tag.name"
            color="primary"
            variant="soft"
            size="sm"
          />
        </div>

        <div class="mt-12 prose prose-lg max-w-none">
          <ContentMarkdownView :content="post.bodyMarkdown" />
        </div>
      </template>

      <div v-else class="text-center py-24">
        <p class="text-xl text-muted">Post not found.</p>
        <UButton to="/blog" class="mt-4">Back to blog</UButton>
      </div>
    </UContainer>
  </div>
</template>
