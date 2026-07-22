<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { adminList, adminDelete, adminPatch } = usePosts()

const { data, refresh } = await useAsyncData(
  'admin-posts',
  () => adminList(),
  { default: () => ({ data: [] }) },
)

const rows = computed(() => data.value?.data ?? [])

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'viewCount', label: 'Views' },
  { key: 'publishedAt', label: 'Published' },
]

async function handleDelete(row: Record<string, any>) {
  await adminDelete(row.id)
  await refresh()
}

async function togglePublish(row: Record<string, any>) {
  const newStatus = row.status === 'published' ? 'draft' : 'published'
  await adminPatch(row.id, { status: newStatus })
  await refresh()
}

function formatDate(val: any): string {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-highlighted">Posts</h1>
      <UButton to="/dashboard/posts/new" icon="lucide:plus" color="primary">New Post</UButton>
    </div>
    <DashboardResourceTable
      :columns="columns"
      :rows="rows"
      @delete="handleDelete"
    >
      <template #cell-title="{ row }">
        <NuxtLink :to="`/dashboard/posts/${row.id}/edit`" class="text-primary hover:underline">
          {{ row.title }}
        </NuxtLink>
      </template>
      <template #cell-status="{ row }">
        <UBadge
          :label="row.status"
          :color="row.status === 'published' ? 'success' : 'warning'"
          variant="soft"
          size="sm"
        />
      </template>
      <template #cell-publishedAt="{ row }">
        {{ formatDate(row.publishedAt) }}
      </template>
    </DashboardResourceTable>
  </div>
</template>
