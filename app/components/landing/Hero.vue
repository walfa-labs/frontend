<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent" />
    <UContainer class="relative py-24 md:py-32">
      <div class="max-w-3xl">
        <h1 class="text-5xl md:text-7xl font-bold tracking-tight text-highlighted">
          Hi, I'm {{ config.public.siteName }}
        </h1>
        <p class="mt-6 text-xl text-muted leading-relaxed">
          Software engineer building fast, reliable systems with Go and TypeScript.
        </p>
        <div class="mt-8 flex gap-4">
          <UButton to="/projects" size="lg" color="primary">
            View Projects
          </UButton>
          <UButton to="/blog" size="lg" variant="outline" color="neutral">
            Read Blog
          </UButton>
        </div>
      </div>
    </UContainer>
  </section>
</template>
