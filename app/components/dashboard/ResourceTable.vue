<script setup lang="ts" generic="T extends object">
interface Column {
  key: string
  label: string
  class?: string
}

defineProps<{
  columns: Column[]
  rows: T[]
  loading?: boolean
}>()

const emit = defineEmits<{
  delete: [row: T]
}>()

const isConfirmOpen = ref(false)
const rowToDelete = shallowRef<T | null>(null)
const deleting = ref(false)

function cellValue(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

function promptDelete(row: T) {
  rowToDelete.value = row
  isConfirmOpen.value = true
}

const itemToDeleteLabel = computed(() => {
  if (!rowToDelete.value) return 'this item'
  const record = rowToDelete.value as Record<string, unknown>
  const candidate = record.title || record.organization || record.name || record.slug
  if (typeof candidate === 'string' && candidate.trim()) {
    return `"${candidate.trim()}"`
  }
  return 'this item'
})

async function handleConfirmDelete() {
  if (!rowToDelete.value) return
  deleting.value = true
  try {
    emit('delete', rowToDelete.value)
    isConfirmOpen.value = false
    rowToDelete.value = null
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="rounded-lg border border-[var(--border-subtle)] overflow-hidden">
    <table class="w-full">
      <thead class="bg-[var(--surface-subtle)]/50 border-b border-[var(--border-subtle)]">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-left text-sm font-medium text-[var(--text-tertiary)]"
            :class="col.class"
          >
            {{ col.label }}
          </th>
          <th class="px-4 py-3 text-right text-sm font-medium text-[var(--text-tertiary)] w-20">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in rows"
          :key="i"
          class="border-b border-[var(--border-subtle)] last:border-b-0 hover:bg-[var(--surface-subtle)]/30"
        >
          <td v-for="col in columns" :key="col.key" class="px-4 py-3 text-sm">
            <slot :name="`cell-${col.key}`" :row="row" :value="cellValue(row, col.key)">
              {{ cellValue(row, col.key) }}
            </slot>
          </td>
          <td class="px-4 py-3 text-right">
            <div class="flex justify-end">
              <UButton
                icon="lucide:trash-2"
                variant="ghost"
                color="error"
                size="xs"
                @click="promptDelete(row)"
              />
            </div>
          </td>
        </tr>
        <tr v-if="!loading && rows.length === 0">
          <td :colspan="columns.length + 1" class="px-4 py-12 text-center text-[var(--text-tertiary)]">
            No records found.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Danger Alert Confirmation Modal -->
    <UModal
      v-model:open="isConfirmOpen"
      title="Confirm Deletion"
      description="This action cannot be undone."
    >
      <template #body>
        <div class="space-y-4">
          <div class="flex items-start gap-3 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400">
            <UIcon name="lucide:alert-triangle" class="size-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <div class="text-sm">
              <p class="font-medium text-red-800 dark:text-red-300">Warning: Destructive Action</p>
              <p class="mt-1 text-red-700/90 dark:text-red-400/90">
                Are you sure you want to permanently delete {{ itemToDeleteLabel }}? This data will be removed immediately.
              </p>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2.5 w-full">
          <UButton
            variant="outline"
            color="neutral"
            :disabled="deleting"
            @click="isConfirmOpen = false"
          >
            Cancel
          </UButton>
          <UButton
            color="error"
            icon="lucide:trash-2"
            :loading="deleting"
            @click="handleConfirmDelete"
          >
            Delete Permanently
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
