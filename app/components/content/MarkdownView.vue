<script setup lang="ts">
const props = defineProps<{
  content: string
}>()
</script>

<template>
  <ClientOnly>
    <UmoViewer :content="props.content" />
    <template #fallback>
      <div class="animate-pulse text-muted">
        <p>Loading content…</p>
      </div>
    </template>
  </ClientOnly>
</template>
