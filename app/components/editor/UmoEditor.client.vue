<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [string] }>()

const content = computed({
  get: () => props.modelValue,
  set: (v: string) => emit('update:modelValue', v),
})
</script>

<template>
  <ClientOnly>
    <UmoEditor
      v-model="content"
      mode="web"
      :placeholder="placeholder"
      :menu="{
        basic: ['bold', 'italic', 'underline', 'strikethrough', 'code'],
        heading: ['h1', 'h2', 'h3'],
        list: ['bulletList', 'orderedList', 'taskList'],
        advanced: ['link', 'image', 'codeBlock', 'blockquote', 'table', 'divider'],
        tools: ['undo', 'redo', 'formatClear'],
      }"
      markdown-mode
      @save="emit('update:modelValue', $event)"
    />
    <template #fallback>
      <div class="h-96 flex items-center justify-center border border-default rounded-lg text-muted">
        Loading editor…
      </div>
    </template>
  </ClientOnly>
</template>
