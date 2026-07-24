<script setup lang="ts">
import { z } from 'zod'
import type { ProfileInput } from '~/types/api'

definePageMeta({ layout: 'dashboard' })

const { adminGet, adminUpdate } = useProfile()
const profileState = useProfileState()

const saving = ref(false)
const errorMsg = ref<string | null>(null)
const successMsg = ref<string | null>(null)

const form = reactive({
  name: '',
  email: '',
  tagline: '',
  bioMarkdown: '',
  location: '',
  avatarUrl: '',
  githubUrl: '',
  linkedinUrl: '',
  twitterUrl: '',
})

// Load existing profile
const { data } = await useAsyncData(
  'admin-profile',
  () => adminGet(),
)
const profile = computed(() => data.value?.data)
if (profile.value) {
  form.name = profile.value.name
  form.email = profile.value.email
  form.tagline = profile.value.tagline
  form.bioMarkdown = profile.value.bioMarkdown
  form.location = profile.value.location
  form.avatarUrl = profile.value.avatarUrl
  form.githubUrl = profile.value.githubUrl
  form.linkedinUrl = profile.value.linkedinUrl
  form.twitterUrl = profile.value.twitterUrl
}

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().optional(),
  tagline: z.string().optional(),
  bioMarkdown: z.string().optional(),
  location: z.string().optional(),
  avatarUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
})

async function handleSave() {
  saving.value = true
  errorMsg.value = null
  successMsg.value = null
  try {
    const payload: ProfileInput = {
      name: form.name,
      email: form.email,
      tagline: form.tagline,
      bioMarkdown: form.bioMarkdown,
      location: form.location,
      avatarUrl: form.avatarUrl,
      githubUrl: form.githubUrl,
      linkedinUrl: form.linkedinUrl,
      twitterUrl: form.twitterUrl,
    }
    const res = await adminUpdate(payload)
    // Update shared state so the public site reflects changes immediately
    profileState.value = res.data
    successMsg.value = 'Profile saved successfully.'
  } catch (err: unknown) {
    const error = err as { data?: { error?: { message?: string } } }
    errorMsg.value = error?.data?.error?.message ?? 'Failed to save profile.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="editorial-heading text-2xl text-[var(--text-primary)]">
        Profile
      </h1>
    </div>

    <UForm :schema="schema" :state="form" class="space-y-6" @submit="handleSave">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Name" name="name" required>
          <UInput v-model="form.name" placeholder="Your Name" class="w-full" />
        </UFormField>
        <UFormField label="Email" name="email">
          <UInput v-model="form.email" type="email" placeholder="you@example.com" class="w-full" />
        </UFormField>
      </div>

      <UFormField label="Tagline" name="tagline">
        <UInput v-model="form.tagline" placeholder="Software engineer building fast, reliable systems" class="w-full" />
      </UFormField>

      <UFormField label="Location" name="location">
        <UInput v-model="form.location" placeholder="San Francisco, CA" class="w-full" />
      </UFormField>

      <UFormField label="Avatar URL" name="avatarUrl">
        <UInput v-model="form.avatarUrl" placeholder="https://…" class="w-full" />
      </UFormField>

      <UFormField label="Bio (Markdown)" name="bioMarkdown">
        <UTextarea v-model="form.bioMarkdown" :rows="6" placeholder="Write a short bio about yourself…" class="w-full" />
      </UFormField>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UFormField label="GitHub URL" name="githubUrl">
          <UInput v-model="form.githubUrl" placeholder="https://github.com/…" class="w-full" />
        </UFormField>
        <UFormField label="LinkedIn URL" name="linkedinUrl">
          <UInput v-model="form.linkedinUrl" placeholder="https://linkedin.com/…" class="w-full" />
        </UFormField>
        <UFormField label="Twitter URL" name="twitterUrl">
          <UInput v-model="form.twitterUrl" placeholder="https://twitter.com/…" class="w-full" />
        </UFormField>
      </div>

      <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>
      <p v-if="successMsg" class="text-sm text-green-500">{{ successMsg }}</p>

      <div class="flex gap-3">
        <UButton type="submit" :loading="saving" color="primary">
          Save Profile
        </UButton>
      </div>
    </UForm>
  </div>
</template>
