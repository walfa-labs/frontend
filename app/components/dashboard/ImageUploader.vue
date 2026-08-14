<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    label: 'Image',
    placeholder: 'https://… or upload a file',
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { upload } = useAssets()
const fileInputRef = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref<string | null>(null)

function triggerFileInput() {
  if (props.disabled || uploading.value) return
  fileInputRef.value?.click()
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Validate size (< 10MB as per backend limit)
  if (file.size > 10 * 1024 * 1024) {
    uploadError.value = 'File size exceeds 10MB limit.'
    target.value = ''
    return
  }

  uploading.value = true
  uploadError.value = null

  try {
    const asset = await upload(file)
    emit('update:modelValue', asset.url)
  } catch (err: unknown) {
    const error = err as { data?: { error?: { message?: string } } }
    uploadError.value = error?.data?.error?.message ?? 'Failed to upload image.'
  } finally {
    uploading.value = false
    target.value = ''
  }
}

function handleUrlInput(val: string) {
  uploadError.value = null
  emit('update:modelValue', val)
}

function clearImage() {
  uploadError.value = null
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <label v-if="label" class="block text-sm font-medium text-[var(--text-secondary)]">
        {{ label }}
      </label>
      <button
        v-if="modelValue"
        type="button"
        class="text-xs text-[var(--text-tertiary)] hover:text-red-500 transition-colors"
        @click="clearImage"
      >
        Clear image
      </button>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
      class="hidden"
      @change="handleFileChange"
    >

    <div class="flex flex-col sm:flex-row gap-3 items-start">
      <!-- Image preview or upload box -->
      <div
        class="relative group w-24 h-24 sm:w-20 sm:h-20 shrink-0 rounded-lg border border-[var(--border-default)] overflow-hidden bg-[var(--surface-subtle)] flex items-center justify-center cursor-pointer transition-all hover:border-[var(--accent)]"
        :class="{ 'opacity-60 cursor-not-allowed': disabled || uploading }"
        @click="triggerFileInput"
      >
        <img
          v-if="modelValue"
          :src="modelValue"
          alt="Preview"
          class="w-full h-full object-cover"
        >
        <div v-else class="flex flex-col items-center justify-center p-2 text-center text-[var(--text-tertiary)] group-hover:text-[var(--accent)]">
          <UIcon name="lucide:image-plus" class="size-6 mb-1" />
          <span class="text-[10px]">Upload</span>
        </div>

        <!-- Overlay on hover if has image -->
        <div
          v-if="modelValue"
          class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
        >
          <UIcon name="lucide:upload" class="size-5" />
        </div>

        <!-- Loading spinner -->
        <div
          v-if="uploading"
          class="absolute inset-0 bg-[var(--surface-panel)]/80 flex items-center justify-center text-[var(--accent)]"
        >
          <UIcon name="lucide:refresh-cw" class="size-5 animate-spin" />
        </div>
      </div>

      <!-- URL Input & Upload Button -->
      <div class="flex-1 w-full space-y-2">
        <div class="flex gap-2">
          <UInput
            :model-value="modelValue"
            :placeholder="placeholder"
            :disabled="disabled || uploading"
            class="flex-1"
            @update:model-value="handleUrlInput"
          />
          <UButton
            type="button"
            variant="outline"
            color="neutral"
            :loading="uploading"
            :disabled="disabled"
            icon="lucide:upload"
            @click="triggerFileInput"
          >
            Upload
          </UButton>
        </div>
        <p v-if="uploadError" class="text-xs text-red-500">
          {{ uploadError }}
        </p>
        <p v-else class="text-xs text-[var(--text-tertiary)]">
          Paste an external image URL or upload a file (PNG, JPG, WebP up to 10MB).
        </p>
      </div>
    </div>
  </div>
</template>
