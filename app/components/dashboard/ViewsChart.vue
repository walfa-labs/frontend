<script setup lang="ts">
import type { ViewPoint } from '~/types/api'

const props = defineProps<{
  data: ViewPoint[]
}>()

const chartData = computed(() =>
  props.data.map((p) => ({ x: p.date, y: p.views })),
)

const xTicks = computed(() => {
  if (props.data.length <= 1) return []
  return props.data.map((p) => p.date)
})
</script>

<template>
  <div class="p-6 rounded-lg border border-default">
    <h3 class="text-lg font-semibold text-highlighted mb-4">Views Over Time</h3>
    <ClientOnly>
      <VisXYContainer :data="chartData" :height="300">
        <VisLine :x="(_: any, i: number) => i" :y="(d: any) => d.y" />
        <VisAxis
          type="x"
          :tick-format="(i: number) => xTicks[i] || ''"
          :grid-line="false"
        />
        <VisAxis type="y" :grid-line="true" />
      </VisXYContainer>
      <template #fallback>
        <div class="h-72 flex items-center justify-center text-muted">
          Loading chart…
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
