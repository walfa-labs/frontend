<script setup lang="ts">
import { ensureProfile } from '~/composables/useProfile'

await ensureProfile()
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
