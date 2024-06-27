<script setup>
import { dateWithDay } from '@/utils'
import { isEmpty, first } from 'lodash'
import { useSalesStore } from '@/stores'
import CONSTANTS from '@/CONSTANTS'

const salesStore = useSalesStore()

const initialData = computed(() =>
  salesStore?.skuRefundRates?.map(item => ({
    amount: item?.sku?.amount,
    amount2: item?.sku?.amount2,
    date1: calculateSalesUnitsAvgSellingPrice({ item }),
    date2: calculateSalesUnitsAvgSellingPrice({ item, isSecond: true }),
    imageUrl: item?.sku?.imageUrl || '',
    productName: item?.sku?.productName || '',
    sku: item?.sku?.sku || '',
    refundRate: `${item.refundRate}%`,
  })),
)

const filteredData = computed(() => {
  if (!searchKey.value) return initialData.value

  return initialData.value.filter(item => {
    return Object.values(item).some(value => {
      const strValue = value && value.toString().toLowerCase()

      return strValue && strValue.includes(searchKey.value.toLowerCase())
    })
  })
})

const data = computed(() => {
  return filteredData.value.slice(
    (pagination.currentPage - 1) * pagination.perPage,
    pagination.currentPage * pagination.perPage,
  )
})

const dateColumnStaticText = '<br>Sales / Units<br>AVG. Selling Price'
const headers = computed(() => {
  const baseHeaders = [
    { text: 'Image', value: 'imageUrl' },
    { text: 'SKU', value: 'sku' },
    { text: 'Product', value: 'productName' },
    { text: `${dateWithDay(first(selectedDates.value))} ${dateColumnStaticText}`, value: 'date1', align: 'text-right' },
  ]

  if (selectedDates.value.length > 1) {
    baseHeaders.push({
      text: `${dateWithDay(selectedDates.value[1])} ${dateColumnStaticText}`,
      value: 'date2',
      align: 'text-right',
    })
  }

  baseHeaders.push({ text: 'SKU Refund Rate<br>(Last 60 Days)', value: 'refundRate', align: 'text-right' })

  return baseHeaders
})

const pagination = reactive({
  currentPage: 1,
  perPage: CONSTANTS?.defaultRecordPerPage || 10,
})

const searchKey = ref('')
const setPage = page => {
  if (page === totalPage.value && CONSTANTS?.defaultRecordSize === initialData.value.length) {
    const nextPageNumberToFetchSkuData = Math.ceil(initialData.value.length / CONSTANTS?.defaultRecordSize) + 1
    salesStore.fetchSkuData({ dates: selectedDates.value, pageNumber: nextPageNumberToFetchSkuData })
  }

  pagination.currentPage = page

  // Scroll to the search input
  setTimeout(() => {
    const element = document.getElementById('searchKey')

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 0)
}

const selectedDates = computed(() => salesStore?.selectedDates)
const skuRefundRates = computed(() => salesStore?.skuRefundRates)

const totalPage = computed(() => {
  console.log('filteredData.value?.length', filteredData.value?.length)
  return Math.ceil(filteredData.value?.length / pagination.perPage)
})

const calculateSalesUnitsAvgSellingPrice = ({ item, isSecond }) => {
  const currency = salesStore?.currency || CONSTANTS?.currency
  const { amount, qty, amount2, qty2 } = item?.sku || {}
  const avgSellingPrice = isSecond ? (qty2 === 0 ? 0 : amount2 / qty2) : qty === 0 ? 0 : amount / qty
  const newAmount = isSecond ? amount2 : amount

  let icon = ''
  if (isSecond) {
    if (amount2 > amount) {
      icon =
        '<svg viewBox="0 0 32 32" width="24px"><path d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0 l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z" fill="green"/></svg>'
    } else if (amount > amount2) {
      icon =
        '<svg viewBox="0 0 32 32" width="24px"><path d="M14.77,23.795L5.185,14.21c-0.879-0.879-0.879-2.317,0-3.195l0.8-0.801c0.877-0.878,2.316-0.878,3.194,0 l7.315,7.315l7.316-7.315c0.878-0.878,2.317-0.878,3.194,0l0.8,0.801c0.879,0.878,0.879,2.316,0,3.195l-9.587,9.585  c-0.471,0.472-1.104,0.682-1.723,0.647C15.875,24.477,15.243,24.267,14.77,23.795z" fill="red"/></svg>'
    } else {
      icon =
        '<svg viewBox="0 0 32 32" width="24px"><path d="M25.695,24.848c0,0.771-0.631,1.402-1.402,1.402H8.875c-0.771,0-1.402-0.631-1.402-1.402V22.57   c0-0.771,0.631-1.401,1.402-1.401h15.418c0.771,0,1.402,0.63,1.402,1.401V24.848z" fill="gray"/></svg>'
    }
  }

  return `<span>${currency}${newAmount} / ${qty}<br>${currency}${avgSellingPrice.toFixed(2)}</span>${icon}`
}

watch(searchKey, () => {
  if (pagination.currentPage !== 1) {
    setPage(1)
  }
})

onMounted(() => {
  searchKey.value = ''
})
</script>

<template>
  <div v-if="!isEmpty(skuRefundRates) && !salesStore.isSkuRefundRatesLoading">
    <div class="relative w-96">
      <input
        v-model.trim="searchKey"
        type="text"
        placeholder="Search..."
        id="searchKey"
        class="w-full px-3 py-2 mb-3 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
      />
      <button
        v-if="searchKey"
        class="absolute inset-y-0 right-0 flex py-2 px-4"
        @click="searchKey = ''"
      >
        <svg
          viewBox="0 0 32 32"
          width="24px"
          class="transition-opacity duration-300 ease-in-out opacity-50 hover:opacity-100"
          fill="currentColor"
        >
          <path
            fill="currentColor"
            d="M20.377,16.519l6.567-6.566c0.962-0.963,0.962-2.539,0-3.502l-0.876-0.875c-0.963-0.964-2.539-0.964-3.501,0  L16,12.142L9.433,5.575c-0.962-0.963-2.538-0.963-3.501,0L5.056,6.45c-0.962,0.963-0.962,2.539,0,3.502l6.566,6.566l-6.566,6.567  c-0.962,0.963-0.962,2.538,0,3.501l0.876,0.876c0.963,0.963,2.539,0.963,3.501,0L16,20.896l6.567,6.566  c0.962,0.963,2.538,0.963,3.501,0l0.876-0.876c0.962-0.963,0.962-2.538,0-3.501L20.377,16.519z"
          />
        </svg>
      </button>
    </div>

    <VueTable
      :headers
      :data
    >
      <template #imageUrl="{ row }">
        <img
          :src="row.imageUrl"
          :alt="row.productName"
          class="productImage rounded-lg"
        />
      </template>
      <template #date1="{ row }">
        <div
          class="whitespace-nowrap text-base font-bold justify-end"
          :class="selectedDates?.length === 1 ? 'text-success' : 'text-secondary'"
          v-html="row?.date1"
        ></div>
      </template>
      <template #date2="{ row }">
        <div
          class="whitespace-nowrap gap-x-1 text-base font-bold flex items-center date2 justify-end"
          :class="
            row?.amount2 > row?.amount ? 'text-success' : row?.amount2 < row?.amount ? 'text-danger' : 'text-lightgrey'
          "
          v-html="row?.date2"
        ></div>
      </template>
      <template #refundRate="{ row }">
        <div class="text-gray-500 text-base font-bold">
          {{ row?.refundRate }}
        </div>
      </template>
    </VueTable>

    <div class="flex items-center justify-center mt-4">
      <nav class="flex rounded-md border border-gray-300 divide-x divide-gray-300">
        <button
          v-if="pagination.currentPage > 1"
          class="px-3 py-2 bg-white text-gray-700 hover:bg-gray-200 hover:text-gray-900"
          @click="setPage(pagination.currentPage - 1)"
        >
          Previous
        </button>
        <button
          v-for="page in totalPage"
          :key="page"
          class="px-3 py-2 hover:bg-gray-200 hover:text-gray-900"
          :class="page === pagination.currentPage ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-700'"
          @click="setPage(page)"
        >
          {{ page }}
        </button>
        <button
          v-if="pagination.currentPage < totalPage"
          class="px-3 py-2 bg-white text-gray-700 hover:bg-gray-200 hover:text-gray-900"
          @click="setPage(pagination.currentPage + 1)"
        >
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.productImage {
  max-width: 50px;
  max-height: 50px;
}
</style>
