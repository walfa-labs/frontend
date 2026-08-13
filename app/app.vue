<script setup lang="ts">
import { ensureProfile } from '~/composables/useProfile'

if (import.meta.server) {
  await ensureProfile()
}
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
