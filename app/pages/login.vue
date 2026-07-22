<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: false })

const { login } = useAuth()
const config = useRuntimeConfig()

const loading = ref(false)
const errorMsg = ref<string | null>(null)

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

const state = reactive({
  username: '',
  password: '',
})

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

useSeoMeta({
  title: `Login — ${config.public.siteName}`,
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-default px-4">
    <div class="w-full max-w-sm">
      <h1 class="text-2xl font-bold text-center text-highlighted mb-8">
        {{ config.public.siteName }}
      </h1>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Username" name="username">
          <UInput v-model="state.username" placeholder="admin" class="w-full" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            class="w-full"
          />
        </UFormField>

        <p v-if="errorMsg" class="text-sm text-error">{{ errorMsg }}</p>

        <UButton
          type="submit"
          :loading="loading"
          color="primary"
          block
          size="lg"
        >
          Sign In
        </UButton>
      </UForm>
    </div>
  </div>
</template>
