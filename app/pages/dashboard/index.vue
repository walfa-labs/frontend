<script setup lang="ts">
import type { HealthResponse, TopPost } from '~/types/api'

definePageMeta({ layout: 'dashboard' })

const { health, summary, views, topPosts } = useStats()

const bucket = ref<'day' | 'week' | 'month'>('day')

const { data: healthData, refresh: refreshHealth } = await useAsyncData(
  'admin-health',
  () => health(),
  { default: () => ({ status: 'ok', db: 'up' } as HealthResponse) },
)

const { data: statsData, refresh: refreshStats } = await useAsyncData(
  'admin-stats-summary',
  () => summary(),
  { default: () => ({ data: null }) },
)

const { data: viewsData, refresh: refreshViews } = await useAsyncData(
  'admin-stats-views',
  () => views({ bucket: bucket.value }),
  {
    default: () => ({ data: [] }),
    watch: [bucket],
  },
)

const { data: topData, refresh: refreshTop } = await useAsyncData(
  'admin-stats-top-posts',
  () => topPosts(10),
  { default: () => ({ data: [] as TopPost[] }) },
)

const stats = computed(() => statsData.value?.data ?? null)
const viewPoints = computed(() => viewsData.value?.data ?? [])
const top = computed(() => topData.value?.data ?? [])
const systemHealth = computed(() => healthData.value)

async function refreshAll() {
  await Promise.all([refreshHealth(), refreshStats(), refreshViews(), refreshTop()])
}

const bucketOptions = [
  { label: 'Daily', value: 'day' },
  { label: 'Weekly', value: 'week' },
  { label: 'Monthly', value: 'month' },
]
</script>

<template>
  <div>
    <!-- Header with System Health & Refresh -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h1 class="editorial-heading text-2xl text-[var(--text-primary)]">Overview</h1>

      <div class="flex items-center gap-3">
        <!-- Health status indicator -->
        <div
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border"
          :class="systemHealth?.status === 'ok' && systemHealth?.db === 'up'
            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'"
        >
          <span
            class="size-2 rounded-full"
            :class="systemHealth?.status === 'ok' && systemHealth?.db === 'up' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'"
          />
          <span>System: {{ systemHealth?.status === 'ok' ? 'Healthy' : 'Degraded' }}</span>
          <span class="text-[var(--text-tertiary)]">·</span>
          <span>DB: {{ systemHealth?.db === 'up' ? 'Online' : 'Offline' }}</span>
        </div>

        <UButton
          icon="lucide:refresh-cw"
          variant="outline"
          color="neutral"
          size="xs"
          title="Refresh metrics"
          @click="refreshAll"
        />
      </div>
    </div>

    <!-- Stat cards (all 5 backend summary metrics) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
        label="Experience"
        :value="`${stats?.yearsExperience ?? 0} yrs`"
        icon="lucide:briefcase"
      />
      <DashboardStatCard
        label="Total Views"
        :value="stats?.totalPostViews ?? 0"
        icon="lucide:eye"
      />
    </div>

    <!-- Views chart with timeframe selector -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="editorial-heading text-lg text-[var(--text-primary)]">Views Over Time</h2>
        <div class="flex items-center gap-1 bg-[var(--surface-subtle)] p-1 rounded-lg border border-[var(--border-subtle)]">
          <button
            v-for="opt in bucketOptions"
            :key="opt.value"
            type="button"
            class="px-2.5 py-1 text-xs rounded-md transition-colors font-medium"
            :class="bucket === opt.value
              ? 'bg-[var(--surface-panel)] text-[var(--text-primary)] shadow-xs'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'"
            @click="bucket = opt.value as 'day' | 'week' | 'month'"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
      <DashboardViewsChart v-if="viewPoints.length" :data="viewPoints" />
      <div v-else class="p-12 text-center text-sm text-[var(--text-tertiary)] rounded-lg border border-[var(--border-subtle)]">
        No view data recorded for this time range.
      </div>
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

