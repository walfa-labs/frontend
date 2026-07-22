<script setup lang="ts">
import type { PostSummary } from '~/types/api'

defineProps<{
  posts: PostSummary[]
}>()

function formatDate(date: string | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <section class="py-16">
    <UContainer>
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-highlighted">Recent Posts</h2>
        <UButton to="/blog" variant="link" color="primary">
          View all →
        </UButton>
      </div>
      <div class="space-y-4">
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="block p-6 rounded-lg border border-default hover:border-primary transition-colors"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <h3 class="text-xl font-semibold text-highlighted truncate">{{ post.title }}</h3>
              <p v-if="post.excerpt" class="mt-2 text-muted line-clamp-2">{{ post.excerpt }}</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <UBadge
                  v-for="tag in post.tags"
                  :key="tag.id"
                  :label="tag.name"
                  color="primary"
                  variant="soft"
                  size="sm"
                />
              </div>
            </div>
            <time class="text-sm text-muted whitespace-nowrap">
              {{ formatDate(post.publishedAt) }}
            </time>
          </div>
        </NuxtLink>
      </div>
    </UContainer>
  </section>
</template>
