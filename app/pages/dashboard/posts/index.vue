<script setup lang="ts">
import type { Post } from '~/types/api'
import { formatDate } from '~/utils/date'

definePageMeta({ layout: 'dashboard' })

const { adminList, adminDelete, adminSetStatus } = usePosts()

const { data, refresh } = await useAsyncData(
  'admin-posts',
  () => adminList(),
  { default: () => ({ data: [] as Post[] }) },
)

const rows = computed(() => data.value?.data ?? [])

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'tags', label: 'Tags' },
  { key: 'status', label: 'Status' },
  { key: 'viewCount', label: 'Views' },
  { key: 'publishedAt', label: 'Published' },
]

const togglingId = ref<string | null>(null)

async function handleDelete(row: Post) {
  await adminDelete(row.id)
  await refresh()
}

async function togglePublish(row: Post) {
  togglingId.value = row.id
  try {
    const newStatus = row.status === 'published' ? 'draft' : 'published'
    await adminSetStatus(row.id, newStatus)
    await refresh()
  } finally {
    togglingId.value = null
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="editorial-heading text-2xl text-[var(--text-primary)]">Posts</h1>
      <UButton to="/dashboard/posts/new" icon="lucide:plus" color="primary">New Post</UButton>
    </div>
    <DashboardResourceTable
      :columns="columns"
      :rows="rows"
      @delete="handleDelete"
    >
      <template #cell-title="{ row }">
        <NuxtLink :to="`/dashboard/posts/${row.id}/edit`" class="text-[var(--accent)] hover:underline font-medium">
          {{ row.title }}
        </NuxtLink>
      </template>
      <template #cell-tags="{ row }">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="tag in (row.tags || []).slice(0, 3)"
            :key="tag.id"
            class="tag-default text-[11px]"
          >
            {{ tag.name }}
          </span>
          <span v-if="(row.tags || []).length > 3" class="text-xs text-[var(--text-tertiary)]">
            +{{ row.tags.length - 3 }}
          </span>
        </div>
      </template>
      <template #cell-status="{ row }">
        <button
          type="button"
          class="cursor-pointer transition-transform hover:scale-105"
          :title="`Click to switch to ${row.status === 'published' ? 'draft' : 'published'}`"
          :disabled="togglingId === row.id"
          @click="togglePublish(row)"
        >
          <UBadge
            :label="togglingId === row.id ? 'Updating…' : row.status"
            :color="row.status === 'published' ? 'success' : 'warning'"
            variant="soft"
            size="sm"
          />
        </button>
      </template>
      <template #cell-publishedAt="{ row }">
        {{ formatDate(row.publishedAt, 'short', '—') }}
      </template>
    </DashboardResourceTable>
  </div>
</template>
