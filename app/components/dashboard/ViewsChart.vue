<script setup lang="ts">
import type { ViewPoint } from '~/types/api'
import { formatDate } from '~/utils/date'

const props = defineProps<{
  data: ViewPoint[]
}>()

// Backend sends { bucket, views } — bucket is an RFC3339 timestamp
const chartData = computed(() =>
  props.data.map((p) => ({ x: p.bucket, y: p.views })),
)

// Defined in script (not inline in the template) because vue-tsc cannot
// parse object type annotations in template attribute expressions.
const lineX = (_: unknown, i: number) => i
const lineY = (d: { y: number }) => d.y

function formatBucket(val: string): string {
  return formatDate(val, { month: 'short', day: 'numeric' }, val)
}
</script>

<template>
  <div class="card-flat p-6">
    <h3 class="editorial-heading text-lg text-[var(--text-primary)] mb-4">Views Over Time</h3>
    <ClientOnly>
      <VisXYContainer :data="chartData" :height="300">
        <VisLine :x="lineX" :y="lineY" />
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
