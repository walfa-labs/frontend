<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { adminList, adminDelete } = useProjects()

const { data, refresh } = await useAsyncData(
  'admin-projects',
  () => adminList(),
  { default: () => ({ data: [] }) },
)

const rows = computed(() => data.value?.data ?? [])

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'slug', label: 'Slug' },
  { key: 'status', label: 'Status' },
  { key: 'featured', label: 'Featured' },
]

async function handleDelete(row: Record<string, any>) {
  await adminDelete(row.id)
  await refresh()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-highlighted">Projects</h1>
      <UButton icon="lucide:plus" color="primary">Add</UButton>
    </div>
    <DashboardResourceTable
      :columns="columns"
      :rows="rows"
      @delete="handleDelete"
    >
      <template #cell-status="{ row }">
        <UBadge
          :label="row.status"
          :color="row.status === 'published' ? 'success' : 'warning'"
          variant="soft"
          size="sm"
        />
      </template>
      <template #cell-featured="{ row }">
        <UIcon
          v-if="row.featured"
          name="lucide:star"
          class="text-primary"
        />
      </template>
    </DashboardResourceTable>
  </div>
</template>
