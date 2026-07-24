<script setup lang="ts">
import { z } from 'zod'
import type { PostInput } from '~/types/api'

definePageMeta({ layout: 'dashboard' })

const { adminCreate, adminUpdate, getById } = usePosts()
const route = useRoute()

const editing = computed(() => !!route.params.id)
const postId = computed(() => route.params.id as string | undefined)

const saving = ref(false)
const errorMsg = ref<string | null>(null)
const slugManuallyEdited = ref(false)

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  bodyMarkdown: '',
  coverImageUrl: '',
  status: 'draft' as 'draft' | 'published',
  tags: [] as string[],
})

// Load existing post if editing
if (editing.value && postId.value) {
  const { data } = await useAsyncData(
    () => `admin-post-${postId.value}`,
    () => getById(postId.value!),
  )
  const post = computed(() => data.value?.data)
  if (post.value) {
    form.title = post.value.title
    form.slug = post.value.slug
    form.excerpt = post.value.excerpt
    form.bodyMarkdown = post.value.bodyMarkdown
    form.coverImageUrl = post.value.coverImageUrl
    form.status = post.value.status
    form.tags = post.value.tags.map((t) => t.name)
  }
}

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  excerpt: z.string().optional(),
  bodyMarkdown: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published']),
})

async function handleSave() {
  saving.value = true
  errorMsg.value = null
  try {
    const payload: PostInput = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      bodyMarkdown: form.bodyMarkdown,
      coverImageUrl: form.coverImageUrl,
      status: form.status,
      tags: form.tags.map((name) => ({ name, slug: name.toLowerCase().replace(/\s+/g, '-') })),
    }
    if (editing.value && postId.value) {
      await adminUpdate(postId.value, payload)
    } else {
      await adminCreate(payload)
    }
    await navigateTo('/dashboard/posts')
  } catch (err: unknown) {
    const error = err as { data?: { error?: { message?: string } } }
    errorMsg.value = error?.data?.error?.message ?? 'Failed to save post.'
  } finally {
    saving.value = false
  }
}

function generateSlug() {
  // Only auto-generate on create, not edit (preserve existing slug)
  if (editing.value || slugManuallyEdited.value) return
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
      <h1 class="editorial-heading text-2xl text-[var(--text-primary)]">
        {{ editing ? 'Edit Post' : 'New Post' }}
      </h1>
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

      <UFormField label="Cover Image URL" name="coverImageUrl">
        <UInput v-model="form.coverImageUrl" placeholder="https://…" class="w-full" />
      </UFormField>

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
        <UButton type="submit" :loading="saving" color="primary">
          {{ editing ? 'Update' : 'Create' }} Post
        </UButton>
        <UButton to="/dashboard/posts" variant="outline" color="neutral">Cancel</UButton>
      </div>
    </UForm>
  </div>
</template>
