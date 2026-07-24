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

const showPreview = ref(false)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.max(el.scrollHeight, 200) + 'px'
}

onMounted(autoResize)
watch(content, autoResize)

// --- Toolbar actions ---
function wrapSelection(before: string, after: string = before) {
  const el = textareaRef.value
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = content.value.slice(start, end)
  const newText = content.value.slice(0, start) + before + selected + after + content.value.slice(end)
  content.value = newText
  nextTick(() => {
    el.focus()
    el.selectionStart = start + before.length
    el.selectionEnd = end + before.length
  })
}

function insertLine(prefix: string) {
  const el = textareaRef.value
  if (!el) return
  const start = el.selectionStart
  const lineStart = content.value.lastIndexOf('\n', start - 1) + 1
  const newText = content.value.slice(0, lineStart) + prefix + content.value.slice(lineStart)
  content.value = newText
  nextTick(() => {
    el.focus()
    el.selectionStart = el.selectionEnd = start + prefix.length
  })
}

function insertAtCursor(text: string) {
  const el = textareaRef.value
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  content.value = content.value.slice(0, start) + text + content.value.slice(end)
  nextTick(() => {
    el.focus()
    el.selectionStart = el.selectionEnd = start + text.length
    autoResize()
  })
}

function insertLink() {
  const el = textareaRef.value
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = content.value.slice(start, end) || 'link text'
  insertAtCursor(`[${selected}](https://)`)
}

function insertImage() {
  const url = window.prompt('Image URL:')
  if (!url) return
  const alt = window.prompt('Alt text:', '') || ''
  insertAtCursor(`![${alt}](${url})`)
}

const previewHtml = computed(() => renderMarkdown(content.value))
</script>

<template>
  <div>
    <!-- Toolbar -->
    <div class="flex items-center flex-wrap gap-1 mb-0 px-2 py-1.5 border border-[var(--border-default)] border-b-0 rounded-t-lg bg-[var(--surface-subtle)]">
      <button type="button" @click="wrapSelection('**')" title="Bold" class="toolbar-btn">
        <UIcon name="lucide:bold" class="size-4" />
      </button>
      <button type="button" @click="wrapSelection('*')" title="Italic" class="toolbar-btn">
        <UIcon name="lucide:italic" class="size-4" />
      </button>
      <button type="button" @click="wrapSelection('~~')" title="Strikethrough" class="toolbar-btn">
        <UIcon name="lucide:strikethrough" class="size-4" />
      </button>
      <button type="button" @click="wrapSelection('`')" title="Inline code" class="toolbar-btn">
        <UIcon name="lucide:code" class="size-4" />
      </button>
      <span class="w-px h-5 bg-[var(--border-default)] mx-1" />
      <button type="button" @click="insertLine('# ')" title="H1" class="toolbar-btn-text">H1</button>
      <button type="button" @click="insertLine('## ')" title="H2" class="toolbar-btn-text">H2</button>
      <button type="button" @click="insertLine('### ')" title="H3" class="toolbar-btn-text">H3</button>
      <span class="w-px h-5 bg-[var(--border-default)] mx-1" />
      <button type="button" @click="insertLine('- ')" title="Bullet list" class="toolbar-btn">
        <UIcon name="lucide:list" class="size-4" />
      </button>
      <button type="button" @click="insertLine('1. ')" title="Numbered list" class="toolbar-btn">
        <UIcon name="lucide:list-ordered" class="size-4" />
      </button>
      <button type="button" @click="insertLine('> ')" title="Quote" class="toolbar-btn">
        <UIcon name="lucide:quote" class="size-4" />
      </button>
      <span class="w-px h-5 bg-[var(--border-default)] mx-1" />
      <button type="button" @click="insertLink()" title="Link" class="toolbar-btn">
        <UIcon name="lucide:link" class="size-4" />
      </button>
      <button type="button" @click="insertImage()" title="Image" class="toolbar-btn">
        <UIcon name="lucide:image" class="size-4" />
      </button>
      <button type="button" @click="insertAtCursor('\n```\n\n```\n')" title="Code block" class="toolbar-btn">
        <UIcon name="lucide:square-code" class="size-4" />
      </button>
      <span class="w-px h-5 bg-[var(--border-default)] mx-1" />
      <button type="button" @click="insertAtCursor('\n---\n')" title="Divider" class="toolbar-btn">
        <UIcon name="lucide:minus" class="size-4" />
      </button>

      <!-- Preview toggle -->
      <div class="ml-auto flex gap-1">
        <button type="button" @click="showPreview = false" class="toolbar-btn" :class="{ 'bg-[var(--surface-inset)]': !showPreview }" title="Write">
          <UIcon name="lucide:pencil" class="size-4" />
        </button>
        <button type="button" @click="showPreview = true" class="toolbar-btn" :class="{ 'bg-[var(--surface-inset)]': showPreview }" title="Preview">
          <UIcon name="lucide:eye" class="size-4" />
        </button>
      </div>
    </div>

    <!-- Editor / Preview -->
    <div class="border border-[var(--border-default)] rounded-b-lg overflow-hidden">
      <textarea
        v-show="!showPreview"
        ref="textareaRef"
        v-model="content"
        :placeholder="placeholder || 'Write in markdown…'"
        class="w-full px-4 py-3 text-sm font-mono text-[var(--text-primary)] bg-[var(--surface-panel)] outline-none resize-none"
        style="min-height: 200px;"
        spellcheck="false"
      />
      <div
        v-show="showPreview"
        class="px-4 py-3 prose prose-sm max-w-none min-h-[200px] text-[var(--text-secondary)]"
        v-html="previewHtml"
      />
    </div>
  </div>
</template>

<style scoped>
.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  color: var(--text-secondary);
  transition: background 0.15s, color 0.15s;
}
.toolbar-btn:hover {
  background: var(--surface-inset);
  color: var(--text-primary);
}
.toolbar-btn-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-secondary);
  transition: background 0.15s, color 0.15s;
}
.toolbar-btn-text:hover {
  background: var(--surface-inset);
  color: var(--text-primary);
}
</style>
