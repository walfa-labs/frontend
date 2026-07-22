<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon?: string
  description?: string
}>()
</script>

<template>
  <div class="p-6 rounded-lg border border-default">
    <div class="flex items-center justify-between">
      <p class="text-sm text-muted">{{ label }}</p>
      <UIcon v-if="icon" :name="icon" class="text-primary" />
    </div>
    <p class="mt-2 text-3xl font-bold text-highlighted">{{ value }}</p>
    <p v-if="description" class="mt-1 text-xs text-muted">{{ description }}</p>
  </div>
</template>
