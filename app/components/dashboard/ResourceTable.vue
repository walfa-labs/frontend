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

defineEmits<{
  edit: [row: T]
  delete: [row: T]
}>()

function cellValue(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key]
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
          <th class="px-4 py-3 text-right text-sm font-medium text-[var(--text-tertiary)] w-24">
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
            <div class="flex justify-end gap-1">
              <UButton
                icon="lucide:pencil"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="$emit('edit', row)"
              />
              <UButton
                icon="lucide:trash-2"
                variant="ghost"
                color="error"
                size="xs"
                @click="$emit('delete', row)"
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
  </div>
</template>
