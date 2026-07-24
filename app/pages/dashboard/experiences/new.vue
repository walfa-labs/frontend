<script setup lang="ts">
import { z } from 'zod'
import type { ExperienceInput, ExperienceType } from '~/types/api'

definePageMeta({ layout: 'dashboard' })

const { adminCreate } = useExperiences()

const saving = ref(false)
const errorMsg = ref<string | null>(null)

const form = reactive({
  experienceType: 'work' as ExperienceType,
  organization: '',
  roleTitle: '',
  location: '',
  startDate: '',
  endDate: '' as string,
  current: false,
  summaryMarkdown: '',
  sortOrder: 0,
  highlights: [] as Array<{ bodyMarkdown: string; sortOrder: number }>,
})

const schema = z.object({
  organization: z.string().min(1, 'Organization is required'),
  roleTitle: z.string().min(1, 'Role title is required'),
  startDate: z.string().min(1, 'Start date is required'),
})

async function handleSave() {
  saving.value = true
  errorMsg.value = null
  try {
    const payload: ExperienceInput = {
      experienceType: form.experienceType,
      organization: form.organization,
      roleTitle: form.roleTitle,
      location: form.location,
      startDate: form.startDate,
      endDate: form.current ? null : (form.endDate || null),
      current: form.current,
      summaryMarkdown: form.summaryMarkdown,
      sortOrder: form.sortOrder,
      highlights: form.highlights.map((h, i) => ({ bodyMarkdown: h.bodyMarkdown, sortOrder: i })),
    }
    await adminCreate(payload)
    await navigateTo('/dashboard/experiences')
  } catch (err: unknown) {
    const error = err as { data?: { error?: { message?: string } } }
    errorMsg.value = error?.data?.error?.message ?? 'Failed to save experience.'
  } finally {
    saving.value = false
  }
}

watch(() => form.current, (current) => {
  if (current) form.endDate = ''
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="editorial-heading text-2xl text-[var(--text-primary)]">New Experience</h1>
      <UButton to="/dashboard/experiences" variant="ghost" color="neutral">Cancel</UButton>
    </div>

    <UForm :schema="schema" :state="form" class="space-y-6" @submit="handleSave">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Type" name="experienceType">
          <USelect value-key="value" v-model="form.experienceType"
            :items="[{ label: 'Work', value: 'work' }, { label: 'Education', value: 'education' }]"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Sort Order" name="sortOrder">
          <UInput v-model.number="form.sortOrder" type="number" placeholder="0" class="w-full" />
        </UFormField>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Organization" name="organization">
          <UInput v-model="form.organization" placeholder="Acme Corp" class="w-full" />
        </UFormField>
        <UFormField label="Role Title" name="roleTitle">
          <UInput v-model="form.roleTitle" placeholder="Software Engineer" class="w-full" />
        </UFormField>
      </div>

      <UFormField label="Location" name="location">
        <UInput v-model="form.location" placeholder="Remote / San Francisco" class="w-full" />
      </UFormField>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Start Date" name="startDate">
          <UInput v-model="form.startDate" type="date" class="w-full" />
        </UFormField>
        <UFormField label="End Date" name="endDate">
          <UInput v-model="form.endDate" type="date" :disabled="form.current" class="w-full" />
        </UFormField>
      </div>

      <UFormField name="current">
        <UCheckbox v-model="form.current" label="I currently work here" />
      </UFormField>

      <UFormField label="Summary" name="summaryMarkdown">
        <UTextarea v-model="form.summaryMarkdown" :rows="3" placeholder="Brief summary of this role…" class="w-full" />
      </UFormField>

      <div>
        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Highlights</label>
        <div class="space-y-2">
          <div v-for="(highlight, i) in form.highlights" :key="i" class="flex items-start gap-2">
            <UTextarea v-model="highlight.bodyMarkdown" :rows="2" placeholder="Highlight…" class="w-full" />
            <UButton
              icon="lucide:trash"
              color="error"
              variant="ghost"
              size="sm"
              @click="form.highlights.splice(i, 1)"
            />
          </div>
        </div>
        <UButton
          icon="lucide:plus"
          variant="outline"
          size="sm"
          class="mt-2"
          @click="form.highlights.push({ bodyMarkdown: '', sortOrder: form.highlights.length })"
        >
          Add Highlight
        </UButton>
      </div>

      <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>

      <div class="flex gap-3">
        <UButton type="submit" :loading="saving" color="primary">Create</UButton>
        <UButton to="/dashboard/experiences" variant="outline" color="neutral">Cancel</UButton>
      </div>
    </UForm>
  </div>
</template>
