<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon?: string
  description?: string
}>()
</script>

<template>
  <div class="card-flat p-5 flex flex-col justify-between">
    <div class="flex items-center justify-between">
      <p class="stat-label mt-0">{{ label }}</p>
      <UIcon v-if="icon" :name="icon" class="size-4 text-[var(--accent)] shrink-0" />
    </div>
    <p class="mt-3 stat-value">{{ value }}</p>
    <p v-if="description" class="mt-1 text-xs text-[var(--text-tertiary)]">{{ description }}</p>
  </div>
</template>
