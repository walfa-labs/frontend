<script setup lang="ts">
const { list } = usePosts()
const config = useRuntimeConfig()

const page = ref(1)
const activeTag = ref<string | undefined>()

const { data, refresh } = await useAsyncData(
  'blog-posts',
  () => list({ page: page.value, tag: activeTag.value }),
  { default: () => ({ data: [], meta: { page: 1, perPage: 10, total: 0 } }), watch: [page, activeTag] },
)

const posts = computed(() => data.value?.data ?? [])
const totalPages = computed(() =>
  Math.ceil((data.value?.meta?.total ?? 0) / (data.value?.meta?.perPage ?? 10)),
)

function setTag(tag: string | undefined) {
  activeTag.value = tag
  page.value = 1
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
  <div>
    <UContainer class="py-16">
      <h1 class="text-4xl font-bold text-highlighted mb-12">Blog</h1>

      <!-- Tag filter -->
      <div v-if="activeTag" class="mb-6 flex items-center gap-2">
        <span class="text-sm text-muted">Filtering by:</span>
        <UBadge :label="activeTag" color="primary" variant="soft" />
        <UButton
          icon="lucide:x"
          variant="ghost"
          color="neutral"
          size="xs"
          @click="setTag(undefined)"
        />
      </div>

      <div class="space-y-4">
        <ContentPostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />
      </div>

      <div v-if="posts.length === 0" class="text-center py-24">
        <p class="text-xl text-muted">No posts found.</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-12 flex justify-center gap-2">
        <UButton
          :disabled="page <= 1"
          icon="lucide:chevron-left"
          variant="outline"
          color="neutral"
          @click="page--"
        />
        <span class="px-4 py-2 text-sm text-muted">
          Page {{ page }} of {{ totalPages }}
        </span>
        <UButton
          :disabled="page >= totalPages"
          icon="lucide:chevron-right"
          variant="outline"
          color="neutral"
          @click="page++"
        />
      </div>
    </UContainer>
  </div>
</template>
