<script setup lang="ts">
import type { PostSummary } from '~/types/api'

defineProps<{
  post: PostSummary
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
  <NuxtLink
    :to="`/blog/${post.slug}`"
    class="block p-6 rounded-lg border border-default hover:border-primary transition-colors"
  >
    <h3 class="text-xl font-semibold text-highlighted">{{ post.title }}</h3>
    <p v-if="post.excerpt" class="mt-2 text-muted line-clamp-2">{{ post.excerpt }}</p>
    <div class="mt-4 flex items-center justify-between">
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="tag in post.tags"
          :key="tag.id"
          :label="tag.name"
          color="primary"
          variant="soft"
          size="sm"
        />
      </div>
      <time class="text-sm text-muted">{{ formatDate(post.publishedAt) }}</time>
    </div>
  </NuxtLink>
</template>
