<script setup lang="ts">
import type { PostSummary } from '~/types/api'
import { formatDate } from '~/utils/date'

defineProps<{
  posts: PostSummary[]
}>()
</script>

<template>
  <section class="py-16">
    <div class="mx-auto max-w-5xl px-6">
      <div class="flex items-center justify-between mb-8">
        <div>
          <p class="editorial-label mb-2">Writing</p>
          <h2 class="editorial-heading text-2xl md:text-3xl text-[var(--text-primary)]">Recent Posts</h2>
        </div>
        <NuxtLink to="/blog" class="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] no-underline inline-flex items-center gap-1">
          View all
          <UIcon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
      </div>
      <div class="space-y-3">
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="flex items-center justify-between gap-4 p-5 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-default)] hover:bg-[var(--surface-subtle)] transition-colors no-underline group"
        >
          <div class="min-w-0 flex-1">
            <h3 class="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">{{ post.title }}</h3>
            <p v-if="post.excerpt" class="mt-1 text-sm text-[var(--text-secondary)] line-clamp-1">{{ post.excerpt }}</p>
            <div v-if="post.tags.length" class="mt-3 flex flex-wrap gap-1.5">
              <span
                v-for="tag in post.tags"
                :key="tag.id"
                class="tag-default"
              >
                {{ tag.name }}
              </span>
            </div>
          </div>
          <time v-if="post.publishedAt" class="text-xs text-[var(--text-tertiary)] whitespace-nowrap shrink-0 font-mono">
            {{ formatDate(post.publishedAt, 'short') }}
          </time>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
