<script setup lang="ts">
import { z } from 'zod'
import type { ProjectInput, ProjectLinkKind } from '~/types/api'

definePageMeta({ layout: 'dashboard' })

const { adminUpdate, getById } = useProjects()
const route = useRoute()

const projectId = computed(() => route.params.id as string)

const saving = ref(false)
const errorMsg = ref<string | null>(null)
const techStackInput = ref('')

const form = reactive({
  title: '',
  slug: '',
  tagline: '',
  descriptionMarkdown: '',
  coverImageUrl: '',
  repoUrl: '',
  demoUrl: '',
  techStack: [] as string[],
  status: 'draft' as 'draft' | 'published',
  featured: false,
  sortOrder: 0,
  links: [] as Array<{ label: string; url: string; kind: ProjectLinkKind }>,
})

const { data } = await useAsyncData(
  () => `admin-project-${projectId.value}`,
  () => getById(projectId.value!),
)

const project = computed(() => data.value?.data)
if (project.value) {
  form.title = project.value.title
  form.slug = project.value.slug
  form.tagline = project.value.tagline
  form.descriptionMarkdown = project.value.descriptionMarkdown
  form.coverImageUrl = project.value.coverImageUrl
  form.repoUrl = project.value.repoUrl
  form.demoUrl = project.value.demoUrl
  form.techStack = [...project.value.techStack]
  form.status = project.value.status
  form.featured = project.value.featured
  form.sortOrder = project.value.sortOrder
  form.links = project.value.links.map(l => ({ label: l.label, url: l.url, kind: l.kind }))
  techStackInput.value = form.techStack.join(', ')
}

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
})

async function handleSave() {
  saving.value = true
  errorMsg.value = null
  try {
    const payload: ProjectInput = {
      slug: form.slug,
      title: form.title,
      tagline: form.tagline,
      descriptionMarkdown: form.descriptionMarkdown,
      coverImageUrl: form.coverImageUrl,
      repoUrl: form.repoUrl,
      demoUrl: form.demoUrl,
      techStack: form.techStack,
      status: form.status,
      featured: form.featured,
      sortOrder: form.sortOrder,
      links: form.links,
    }
    await adminUpdate(projectId.value, payload)
    await navigateTo('/dashboard/projects')
  } catch (err: unknown) {
    const error = err as { data?: { error?: { message?: string } } }
    errorMsg.value = error?.data?.error?.message ?? 'Failed to save project.'
  } finally {
    saving.value = false
  }
}

function syncTechStack() {
  form.techStack = techStackInput.value.split(',').map(s => s.trim()).filter(Boolean)
}

const linkKindItems = [
  { label: 'Repo', value: 'repo' },
  { label: 'Demo', value: 'demo' },
  { label: 'Docs', value: 'docs' },
  { label: 'Other', value: 'other' },
]
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="editorial-heading text-2xl text-[var(--text-primary)]">Edit Project</h1>
      <UButton to="/dashboard/projects" variant="ghost" color="neutral">Cancel</UButton>
    </div>

    <UForm :schema="schema" :state="form" class="space-y-6" @submit="handleSave">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Title" name="title">
          <UInput v-model="form.title" placeholder="My Awesome Project" class="w-full" />
        </UFormField>
        <UFormField label="Slug" name="slug">
          <UInput v-model="form.slug" placeholder="my-awesome-project" class="w-full" />
        </UFormField>
      </div>

      <UFormField label="Tagline" name="tagline">
        <UInput v-model="form.tagline" placeholder="A short one-liner…" class="w-full" />
      </UFormField>

      <UFormField label="Cover Image URL" name="coverImageUrl">
        <UInput v-model="form.coverImageUrl" placeholder="https://…" class="w-full" />
      </UFormField>

      <div>
        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description (Markdown)</label>
        <EditorUmoEditor v-model="form.descriptionMarkdown" placeholder="Describe your project..." />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Repo URL" name="repoUrl">
          <UInput v-model="form.repoUrl" placeholder="https://github.com/…" class="w-full" />
        </UFormField>
        <UFormField label="Demo URL" name="demoUrl">
          <UInput v-model="form.demoUrl" placeholder="https://…" class="w-full" />
        </UFormField>
      </div>

      <UFormField label="Tech Stack (comma-separated)" name="techStack">
        <UInput v-model="techStackInput" placeholder="Go, TypeScript, React" class="w-full" @blur="syncTechStack" />
      </UFormField>

      <div class="flex items-center gap-6">
        <UFormField label="Status" name="status">
          <USelect value-key="value" v-model="form.status"
            :items="[{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }]"
            class="w-40"
          />
        </UFormField>
        <UFormField label="Sort Order" name="sortOrder">
          <UInput v-model.number="form.sortOrder" type="number" class="w-32" />
        </UFormField>
        <UFormField label="Featured" name="featured">
          <UCheckbox v-model="form.featured" />
        </UFormField>
      </div>

      <div>
        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Links</label>
        <div class="space-y-3">
          <div v-for="(link, i) in form.links" :key="i" class="flex gap-2 items-end">
            <UFormField label="Label">
              <UInput v-model="link.label" placeholder="GitHub" />
            </UFormField>
            <UFormField label="URL">
              <UInput v-model="link.url" placeholder="https://..." />
            </UFormField>
            <UFormField label="Kind">
              <USelect value-key="value" v-model="link.kind" :items="linkKindItems" />
            </UFormField>
            <UButton @click="form.links.splice(i, 1)" icon="lucide:trash" color="error" variant="ghost" size="sm" />
          </div>
        </div>
        <UButton @click="form.links.push({ label: '', url: '', kind: 'other' })" icon="lucide:plus" variant="outline" size="sm" class="mt-3">
          Add Link
        </UButton>
      </div>

      <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>

      <div class="flex gap-3">
        <UButton type="submit" :loading="saving" color="primary">Update</UButton>
        <UButton to="/dashboard/projects" variant="outline" color="neutral">Cancel</UButton>
      </div>
    </UForm>
  </div>
</template>
