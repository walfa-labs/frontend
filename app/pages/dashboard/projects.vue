<script setup lang="ts">
import type { Project } from '~/types/api'

definePageMeta({ layout: 'dashboard' })

const { adminList, adminDelete } = useProjects()

const { data, refresh } = await useAsyncData(
  'admin-projects',
  () => adminList(),
  { default: () => ({ data: [] as Project[] }) },
)

const rows = computed(() => data.value?.data ?? [])

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'slug', label: 'Slug' },
  { key: 'status', label: 'Status' },
  { key: 'featured', label: 'Featured' },
]

async function handleDelete(row: Project) {
  await adminDelete(row.id)
  await refresh()
}

function handleEdit(row: Project) {
  navigateTo(`/dashboard/projects/${row.id}/edit`)
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="editorial-heading text-2xl text-[var(--text-primary)]">Projects</h1>
      <UButton to="/dashboard/projects/new" icon="lucide:plus" color="primary">Add</UButton>
    </div>
    <DashboardResourceTable
      :columns="columns"
      :rows="rows"
      @delete="handleDelete"
      @edit="handleEdit"
    >
      <template #cell-title="{ row }">
        <NuxtLink :to="`/dashboard/projects/${row.id}/edit`" class="text-[var(--accent)] hover:underline">{{ row.title }}</NuxtLink>
      </template>
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
          class="text-[var(--accent)]"
        />
      </template>
    </DashboardResourceTable>
  </div>
</template>
