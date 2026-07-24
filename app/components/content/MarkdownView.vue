<script setup lang="ts">
const props = defineProps<{
  content: string
}>()

const rendered = computed(() => renderMarkdown(props.content))
</script>

<template>
  <div class="prose prose-sm max-w-none" v-html="rendered" />
</template>
