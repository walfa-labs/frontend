<script setup lang="ts">
const { list } = useExperiences()
const config = useRuntimeConfig()

const { data } = await useAsyncData(
  'experiences',
  () => list(),
  { default: () => ({ data: [] }) },
)

const workExperiences = computed(() =>
  (data.value?.data ?? []).filter((e) => e.experienceType === 'work'),
)
const educationExperiences = computed(() =>
  (data.value?.data ?? []).filter((e) => e.experienceType === 'education'),
)

useSeoMeta({
  title: `About — ${config.public.siteName}`,
  description: 'Professional experience and education timeline.',
  ogTitle: `About — ${config.public.siteName}`,
  ogDescription: 'Professional experience and education timeline.',
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}/about`,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}/about` }],
})
</script>

<template>
  <div>
    <UContainer class="py-16">
      <h1 class="text-4xl font-bold text-highlighted mb-12">About</h1>

      <section v-if="workExperiences.length" class="mb-16">
        <h2 class="text-2xl font-semibold text-highlighted mb-8">Experience</h2>
        <div>
          <ContentExperienceCard
            v-for="exp in workExperiences"
            :key="exp.id"
            :experience="exp"
          />
        </div>
      </section>

      <section v-if="educationExperiences.length">
        <h2 class="text-2xl font-semibold text-highlighted mb-8">Education</h2>
        <div>
          <ContentExperienceCard
            v-for="exp in educationExperiences"
            :key="exp.id"
            :experience="exp"
          />
        </div>
      </section>
    </UContainer>
  </div>
</template>
