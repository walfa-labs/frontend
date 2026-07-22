<script setup lang="ts">
interface Column {
  key: string
  label: string
  class?: string
}

const props = defineProps<{
  columns: Column[]
  rows: Record<string, any>[]
  loading?: boolean
}>()

defineEmits<{
  edit: [row: Record<string, any>]
  delete: [row: Record<string, any>]
}>()
</script>

<template>
  <div class="rounded-lg border border-default overflow-hidden">
    <table class="w-full">
      <thead class="bg-elevated/50 border-b border-default">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-left text-sm font-medium text-muted"
            :class="col.class"
          >
            {{ col.label }}
          </th>
          <th class="px-4 py-3 text-right text-sm font-medium text-muted w-24">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in rows"
          :key="i"
          class="border-b border-default last:border-b-0 hover:bg-elevated/30"
        >
          <td v-for="col in columns" :key="col.key" class="px-4 py-3 text-sm">
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
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
          <td :colspan="columns.length + 1" class="px-4 py-12 text-center text-muted">
            No records found.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
