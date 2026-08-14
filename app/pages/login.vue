<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: false })

const { login } = useAuth()
const config = useRuntimeConfig()
const profile = useProfileState()
const colorMode = useColorMode()

const loading = ref(false)
const errorMsg = ref<string | null>(null)

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

const state = reactive({ username: '', password: '' })

async function onSubmit() {
  loading.value = true
  errorMsg.value = null
  try {
    await login(state)
    await navigateTo('/dashboard')
  } catch (err: any) {
    errorMsg.value = err?.data?.error?.message ?? 'Login failed. Check your credentials.'
  } finally {
    loading.value = false
  }
}

const colorModeItems = [
  { label: 'Light', value: 'light', icon: 'lucide:sun' },
  { label: 'Dark', value: 'dark', icon: 'lucide:moon' },
  { label: 'System', value: 'system', icon: 'lucide:monitor' },
]

useSeoMeta({
  title: `Login — ${profile.value?.name || config.public.siteName}`,
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-main)] px-4 py-12">
    <div class="w-full max-w-sm">
      <!-- Back to home navigation -->
      <div class="mb-6">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors no-underline group"
          aria-label="Back to home"
        >
          <UIcon name="lucide:arrow-left" class="size-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to home</span>
        </NuxtLink>
      </div>

      <div class="card-flat p-6 sm:p-8">
        <div class="text-center mb-8">
          <NuxtLink
            to="/"
            class="editorial-heading text-2xl text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors no-underline inline-block"
          >
            {{ profile?.name || config.public.siteName }}
          </NuxtLink>
          <p class="text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)] mt-1.5">
            Admin Sign In
          </p>
        </div>

        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="Username" name="username">
            <UInput v-model="state.username" placeholder="admin" class="w-full" />
          </UFormField>
          <UFormField label="Password" name="password">
            <UInput v-model="state.password" type="password" placeholder="••••••••" class="w-full" />
          </UFormField>

          <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>

          <UButton type="submit" :loading="loading" color="primary" block size="lg">
            Sign In
          </UButton>
        </UForm>
      </div>

      <!-- Color mode toggle and return link -->
      <div class="mt-6 flex items-center justify-between px-1 text-xs text-[var(--text-tertiary)]">
        <NuxtLink
          to="/"
          class="hover:text-[var(--accent)] transition-colors no-underline inline-flex items-center gap-1"
        >
          &larr; Return to website
        </NuxtLink>

        <div v-if="colorMode">
          <UDropdownMenu
            :items="colorModeItems.map(item => ({
              label: item.label,
              icon: item.icon,
              onSelect: () => colorMode.preference = item.value,
              class: (colorMode?.preference || 'system') === item.value ? 'text-primary font-semibold' : '',
            }))"
          >
            <UButton
              variant="ghost"
              color="neutral"
              size="xs"
              :icon="(colorMode?.preference || 'system') === 'dark' ? 'lucide:moon' : (colorMode?.preference || 'system') === 'light' ? 'lucide:sun' : 'lucide:monitor'"
              aria-label="Toggle color mode"
            />
          </UDropdownMenu>
        </div>
      </div>
    </div>
  </div>
</template>
