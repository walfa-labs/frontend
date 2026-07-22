<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: false })

const { login } = useAuth()
const config = useRuntimeConfig()
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
  title: `Login — ${config.public.siteName}`,
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="editorial-heading text-2xl text-[var(--text-primary)]">{{ config.public.siteName }}</h1>
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

      <!-- Color mode toggle -->
      <div class="mt-6 flex justify-center">
        <UDropdownMenu
          :items="colorModeItems.map(item => ({
            label: item.label,
            icon: item.icon,
            onSelect: () => colorMode.preference = item.value,
            class: colorMode.preference === item.value ? 'text-primary font-semibold' : '',
          }))"
        >
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            :icon="colorMode.preference === 'dark' ? 'lucide:moon' : colorMode.preference === 'light' ? 'lucide:sun' : 'lucide:monitor'"
            aria-label="Toggle color mode"
          />
        </UDropdownMenu>
      </div>
    </div>
  </div>
</template>
