<script setup lang="ts">
import type { Experience } from '~/types/api'

definePageMeta({ layout: 'dashboard' })

const { adminList, adminDelete } = useExperiences()

const { data, refresh } = await useAsyncData(
  'admin-experiences',
  () => adminList(),
  { default: () => ({ data: [] as Experience[] }) },
)

const rows = computed(() => data.value?.data ?? [])

const columns = [
  { key: 'organization', label: 'Organization' },
  { key: 'roleTitle', label: 'Role' },
  { key: 'experienceType', label: 'Type' },
  { key: 'current', label: 'Status' },
]

async function handleDelete(row: Experience) {
  await adminDelete(row.id)
  await refresh()
}

function handleEdit(row: Experience) {
  navigateTo(`/dashboard/experiences/${row.id}/edit`)
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="editorial-heading text-2xl text-[var(--text-primary)]">Experience</h1>
      <UButton to="/dashboard/experiences/new" icon="lucide:plus" color="primary">Add</UButton>
    </div>
    <DashboardResourceTable
      :columns="columns"
      :rows="rows"
      @delete="handleDelete"
      @edit="handleEdit"
    >
      <template #cell-organization="{ row }">
        <NuxtLink :to="`/dashboard/experiences/${row.id}/edit`" class="text-[var(--accent)] hover:underline">
          {{ row.organization }}
        </NuxtLink>
      </template>
      <template #cell-current="{ row }">
        <UBadge
          :label="row.current ? 'Current' : 'Past'"
          :color="row.current ? 'success' : 'neutral'"
          variant="soft"
          size="sm"
        />
      </template>
      <template #cell-experienceType="{ row }">
        <UBadge
          :label="row.experienceType"
          color="primary"
          variant="soft"
          size="sm"
        />
      </template>
    </DashboardResourceTable>
  </div>
</template>
