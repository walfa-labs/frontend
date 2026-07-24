<script setup lang="ts">
import type { TopPost } from '~/types/api'

definePageMeta({ layout: 'dashboard' })

const { summary, views, topPosts } = useStats()

const { data: statsData } = await useAsyncData(
  'admin-stats-summary',
  () => summary(),
  { default: () => ({ data: null }) },
)

const { data: viewsData } = await useAsyncData(
  'admin-stats-views',
  () => views({ bucket: 'day' }),
  { default: () => ({ data: [] }) },
)

const { data: topData } = await useAsyncData(
  'admin-stats-top-posts',
  () => topPosts(10),
  { default: () => ({ data: [] as TopPost[] }) },
)

const stats = computed(() => statsData.value?.data ?? null)
const viewPoints = computed(() => viewsData.value?.data ?? [])
const top = computed(() => topData.value?.data ?? [])
</script>

<template>
  <div>
    <h1 class="editorial-heading text-2xl text-[var(--text-primary)] mb-6">Overview</h1>

    <!-- Stat cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <DashboardStatCard
        label="Published Posts"
        :value="stats?.publishedPosts ?? 0"
        icon="lucide:file-text"
      />
      <DashboardStatCard
        label="Published Projects"
        :value="stats?.publishedProjects ?? 0"
        icon="lucide:folder"
      />
      <DashboardStatCard
        label="Featured Projects"
        :value="stats?.featuredProjects ?? 0"
        icon="lucide:star"
      />
      <DashboardStatCard
        label="Total Views"
        :value="stats?.totalPostViews ?? 0"
        icon="lucide:eye"
      />
    </div>

    <!-- Views chart -->
    <div class="mb-8">
      <DashboardViewsChart v-if="viewPoints.length" :data="viewPoints" />
    </div>

    <!-- Top posts -->
    <div v-if="top.length">
      <h2 class="editorial-heading text-lg text-[var(--text-primary)] mb-4">Top Posts</h2>
      <div class="rounded-lg border border-[var(--border-subtle)] overflow-hidden">
        <table class="w-full">
          <thead class="bg-[var(--surface-subtle)]/50 border-b border-[var(--border-subtle)]">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-[var(--text-tertiary)]">Title</th>
              <th class="px-4 py-3 text-right text-sm font-medium text-[var(--text-tertiary)]">Views</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="post in top"
              :key="post.id"
              class="border-b border-[var(--border-subtle)] last:border-b-0"
            >
              <td class="px-4 py-3 text-sm">
                <NuxtLink :to="`/dashboard/posts/${post.id}/edit`" class="text-[var(--accent)] hover:underline">
                  {{ post.title }}
                </NuxtLink>
              </td>
              <td class="px-4 py-3 text-sm text-right text-[var(--text-tertiary)]">{{ post.views }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
