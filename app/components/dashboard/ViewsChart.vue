<script setup lang="ts">
import type { ViewPoint } from '~/types/api'

const props = defineProps<{
  data: ViewPoint[]
}>()

// Backend sends { bucket, views } — bucket is an RFC3339 timestamp
const chartData = computed(() =>
  props.data.map((p) => ({ x: p.bucket, y: p.views })),
)

function formatBucket(val: string): string {
  try {
    return new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return val
  }
}
</script>

<template>
  <div class="p-6 rounded-lg border border-[var(--border-subtle)]">
    <h3 class="editorial-heading text-lg text-[var(--text-primary)] mb-4">Views Over Time</h3>
    <ClientOnly>
      <VisXYContainer :data="chartData" :height="300">
        <VisLine :x="(_: unknown, i: number) => i" :y="(d: { y: number }) => d.y" />
        <VisAxis
          type="x"
          :tick-format="(i: number) => formatBucket(chartData[i]?.x ?? '')"
          :grid-line="false"
        />
        <VisAxis type="y" :grid-line="true" />
      </VisXYContainer>
      <template #fallback>
        <div class="h-72 flex items-center justify-center text-[var(--text-tertiary)]">
          Loading chart…
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
