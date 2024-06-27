<script setup>
import { Chart } from 'highcharts-vue'
import { isEmpty } from 'lodash'
defineProps({
  options: { type: Object, required: true },
})
</script>

<template>
  <ChartSkeleton v-if="isEmpty(options?.series)" />

  <Chart
    v-else
    :options
  />
</template>
