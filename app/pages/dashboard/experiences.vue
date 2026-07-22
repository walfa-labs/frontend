<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { adminList, adminDelete } = useExperiences()

const { data, refresh } = await useAsyncData(
  'admin-experiences',
  () => adminList(),
  { default: () => ({ data: [] }) },
)

const rows = computed(() => data.value?.data ?? [])

const columns = [
  { key: 'organization', label: 'Organization' },
  { key: 'roleTitle', label: 'Role' },
  { key: 'experienceType', label: 'Type' },
  { key: 'current', label: 'Status' },
]

async function handleDelete(row: Record<string, any>) {
  await adminDelete(row.id)
  await refresh()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-highlighted">Experience</h1>
      <UButton icon="lucide:plus" color="primary">Add</UButton>
    </div>
    <DashboardResourceTable
      :columns="columns"
      :rows="rows"
      @delete="handleDelete"
    >
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
