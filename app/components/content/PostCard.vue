<script setup lang="ts">
import type { PostSummary } from '~/types/api'
import { formatDate } from '~/utils/date'

defineProps<{
  post: PostSummary
}>()
</script>

<template>
  <NuxtLink
    :to="`/blog/${post.slug}`"
    class="card-elevated p-6 block no-underline group"
  >
    <h3 class="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{{ post.title }}</h3>
    <p v-if="post.excerpt" class="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{{ post.excerpt }}</p>
    <div class="mt-4 flex items-center justify-between">
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in post.tags"
          :key="tag.id"
          class="tag-default"
        >
          {{ tag.name }}
        </span>
      </div>
      <time class="text-xs text-[var(--text-tertiary)] font-mono">{{ formatDate(post.publishedAt) }}</time>
    </div>
  </NuxtLink>
</template>
