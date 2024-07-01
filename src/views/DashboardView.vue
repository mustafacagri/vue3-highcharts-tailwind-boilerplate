<script setup>
import { dateWithDay } from '@/utils'
import { first, isEmpty } from 'lodash'
import { useMessageStore, useSalesStore, useUserStore } from '@/stores'
import CONSTANTS from '@/CONSTANTS'

const salesStore = useSalesStore()
const userStore = useUserStore()
const messageStore = useMessageStore()

const dailySalesOverviewDay = ref(first(CONSTANTS.dailySalesOverviewDays))
const selectedColumnIndexes = ref([])

const handleDailySalesOverviewDays = async () => {
  selectedColumnIndexes.value = []
  await salesStore.fetchDailySalesOverview(dailySalesOverviewDay.value)
}

const dailySalesOverview = computed(() => {
  const { dailySalesOverview, currency } = salesStore

  if (isEmpty(dailySalesOverview)) return {}

  const categories = dailySalesOverview.map(item => dateWithDay(item.date))
  const seriesData = [
    { name: 'Profit', stack: 'Sales', data: dailySalesOverview.map(item => item.profit) },
    { name: 'FBA Sales', stack: 'Sales', data: dailySalesOverview.map(item => item.fbaAmount) },
    { name: 'FBM Sales', stack: 'Sales', data: dailySalesOverview.map(item => item.fbmAmount) },
  ]

  return {
    accessibility: { enabled: false },
    colors: ['#71ecc5', '#7f85e9', '#5d33eb'],
    chart: { type: 'column' },
    title: { text: 'Daily Sales', align: 'left' },
    xAxis: { categories, crosshair: true, plotBands: [] },
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: { text: `Amount (${currency})` },
    },
    tooltip: {
      formatter() {
        const point = this.point
        const item = dailySalesOverview[point.index]
        const totalSales = item.fbaAmount + item.fbmAmount

        return `
          <b>${point.category}</b><br/>
          Total Sales: ${totalSales}<br/>
          Shipping: ${item.fbaShippingAmount}<br/>
          Profit: ${item.profit}<br/>
          FBA Sales: ${item.fbaAmount}<br/>
          FBM Sales: ${item.fbmAmount}
        `
      },
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        events: {
          click(event) {
            const clickedIndex = event.point.index
            if (selectedColumnIndexes.value.includes(clickedIndex)) {
              selectedColumnIndexes.value = selectedColumnIndexes.value.filter(index => index !== clickedIndex)
            } else {
              if (CONSTANTS.maxComparisonDays > selectedColumnIndexes.value.length) {
                selectedColumnIndexes.value.push(clickedIndex)
              } else {
                messageStore.setError({ error: CONSTANTS?.errors?.dashboard?.maxComparisonDays || '' })
              }
            }

            const xAxis = this.chart.xAxis[0]
            xAxis.removePlotBand('highlight-band')

            selectedColumnIndexes.value.forEach(index => {
              xAxis.addPlotBand({
                from: index - 0.5,
                to: index + 0.5,
                color: 'rgba(0, 0, 0, 0.1)',
                id: 'highlight-band',
              })
            })
          },
        },
      },
    },
    series: seriesData,
    credits: false,
  }
})

watch(
  selectedColumnIndexes,
  async newVal => {
    const dates = newVal.map(index => salesStore.dailySalesOverview[index].date)
    salesStore.fetchSkuData({ dates })
  },
  { immediate: true, deep: true },
)

onBeforeMount(async () => {
  await userStore.fetchMe()
})
</script>

<template>
  <div class="w-full flex flex-col justify-center items-center">
    <div class="w-full max-w-8xl p-4 bg-white shadow-md rounded-md mb-4">
      <GetErrorSuccess />

      <div class="mb-6 relative">
        <div
          id="dailySalesOverviewDays"
          class="px-4 p-2"
        >
          <select
            v-model="dailySalesOverviewDay"
            @change="handleDailySalesOverviewDays"
          >
            <option
              v-for="day in CONSTANTS.dailySalesOverviewDays"
              :key="day"
              :value="day"
            >
              Last {{ day }} Days
            </option>
          </select>
        </div>
        <Chart :options="dailySalesOverview" />
      </div>

      <TableSkeleton v-if="salesStore.isSkuRefundRatesLoading" />
      <ComparisonTable :key="JSON.stringify(selectedColumnIndexes)" />
      <!-- to re-render the component whenever the selected columns are changed-->
    </div>
  </div>
</template>

<style scoped lang="scss">
.dropdown:focus-within .dropdown-menu {
  opacity: 1;
  transform: translate(0) scale(1);
  visibility: visible;
}

#dailySalesOverviewDays {
  position: absolute;
  display: block;
  right: 0px;
  z-index: 100;

  select {
    padding-right: 10px;
    &:focus {
      outline: none;
    }
  }
}
</style>
