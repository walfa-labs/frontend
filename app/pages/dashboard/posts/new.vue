<script setup lang="ts">
import { z } from 'zod'
import type { PostInput, Tag } from '~/types/api'

definePageMeta({ layout: 'dashboard' })

const { adminCreate } = usePosts()
const { tags: fetchTags } = useStats()

const saving = ref(false)
const errorMsg = ref<string | null>(null)
const slugManuallyEdited = ref(false)
const newTagInput = ref('')

const { data: existingTagsData } = await useAsyncData(
  'available-tags',
  () => fetchTags(),
  { default: () => ({ data: [] as Tag[] }) },
)
const existingTags = computed(() => existingTagsData.value?.data ?? [])

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  bodyMarkdown: '',
  coverImageUrl: '',
  status: 'draft' as 'draft' | 'published',
  tags: [] as string[],
})

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  excerpt: z.string().optional(),
  bodyMarkdown: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published']),
})

function slugifyTag(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || name.trim().toLowerCase()
}

function addTag(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return
  if (!form.tags.includes(trimmed)) {
    form.tags.push(trimmed)
  }
  newTagInput.value = ''
}

function removeTag(tag: string) {
  form.tags = form.tags.filter(t => t !== tag)
}

function onTagKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag(newTagInput.value)
  }
}

async function handleSave() {
  saving.value = true
  errorMsg.value = null
  try {
    const payload: PostInput = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || '',
      bodyMarkdown: form.bodyMarkdown,
      coverImageUrl: form.coverImageUrl || '',
      status: form.status,
      tags: form.tags.map((name) => ({
        name: name.trim(),
        slug: slugifyTag(name),
      })),
    }
    await adminCreate(payload)
    await navigateTo('/dashboard/posts')
  } catch (err: unknown) {
    const error = err as { data?: { error?: { message?: string; details?: Array<{ field: string; issue: string }> } } }
    if (error?.data?.error?.details?.length) {
      errorMsg.value = error.data.error.details.map(d => `${d.field}: ${d.issue}`).join(', ')
    } else {
      errorMsg.value = error?.data?.error?.message ?? 'Failed to save post.'
    }
  } finally {
    saving.value = false
  }
}

function generateSlug() {
  if (slugManuallyEdited.value) return
  const base = form.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const suffix = Math.random().toString(36).slice(2, 6)
  form.slug = base ? `${base}-${suffix}` : suffix
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="editorial-heading text-2xl text-[var(--text-primary)]">New Post</h1>
      <UButton to="/dashboard/posts" variant="ghost" color="neutral">Cancel</UButton>
    </div>

    <UForm :schema="schema" :state="form" class="space-y-6" @submit="handleSave">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Title" name="title">
          <UInput v-model="form.title" placeholder="My First Post" class="w-full" @input="generateSlug" />
        </UFormField>
        <UFormField label="Slug" name="slug">
          <UInput v-model="form.slug" placeholder="my-first-post" class="w-full" @input="slugManuallyEdited = true" />
        </UFormField>
      </div>

      <UFormField label="Excerpt" name="excerpt">
        <UTextarea v-model="form.excerpt" :rows="2" placeholder="Brief summary…" class="w-full" />
      </UFormField>

      <DashboardImageUploader
        v-model="form.coverImageUrl"
        label="Cover Image"
        placeholder="https://… or upload cover image"
      />

      <!-- Tags selection & input -->
      <div>
        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Tags</label>
        <div class="space-y-2">
          <!-- Selected tags -->
          <div v-if="form.tags.length" class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in form.tags"
              :key="tag"
              class="tag-default inline-flex items-center gap-1"
            >
              {{ tag }}
              <button type="button" class="hover:text-red-500 cursor-pointer" @click="removeTag(tag)">
                <UIcon name="lucide:x" class="size-3" />
              </button>
            </span>
          </div>

          <!-- Add new tag input -->
          <div class="flex gap-2">
            <UInput
              v-model="newTagInput"
              placeholder="Add tag and press Enter…"
              class="w-full max-w-xs"
              @keydown="onTagKeydown"
            />
            <UButton
              type="button"
              variant="outline"
              color="neutral"
              size="sm"
              icon="lucide:plus"
              @click="addTag(newTagInput)"
            >
              Add
            </UButton>
          </div>

          <!-- Suggested existing tags -->
          <div v-if="existingTags.length" class="pt-1">
            <p class="text-xs text-[var(--text-tertiary)] mb-1.5">Available tags:</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="tag in existingTags"
                :key="tag.id"
                type="button"
                class="tag-default text-xs cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                :class="{ 'opacity-100 ring-1 ring-[var(--accent)]': form.tags.includes(tag.name) }"
                @click="form.tags.includes(tag.name) ? removeTag(tag.name) : addTag(tag.name)"
              >
                {{ form.tags.includes(tag.name) ? '✓ ' : '+ ' }}{{ tag.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Content (Markdown)</label>
        <EditorUmoEditor v-model="form.bodyMarkdown" placeholder="Write your post…" />
      </div>

      <div class="flex items-center gap-4">
        <UFormField label="Status" name="status">
          <USelect value-key="value" v-model="form.status"
            :items="[{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }]"
            class="w-40"
          />
        </UFormField>
      </div>

      <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>

      <div class="flex gap-3">
        <UButton type="submit" :loading="saving" color="primary">Create Post</UButton>
        <UButton to="/dashboard/posts" variant="outline" color="neutral">Cancel</UButton>
      </div>
    </UForm>
  </div>
</template>

