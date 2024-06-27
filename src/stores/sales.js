import { defineStore } from 'pinia'
import { first, isEmpty } from 'lodash'
import { request } from '@/utils'
import { useMessageStore, useUserStore } from '@/stores'
import CONSTANTS from '@/CONSTANTS'

export const useSalesStore = defineStore('sales', () => {
  const messageStore = useMessageStore()
  const userStore = useUserStore()

  const state = reactive({
    currency: CONSTANTS?.defaultCurrency,
    dailySalesOverview: [],
    isSkuRefundRatesLoading: false,
    skuData: {},
    skuRefundRates: [],
    selectedDates: [],
  })

  const fetchDailySalesOverview = async (day = first(CONSTANTS.dailySalesOverviewDays)) => {
    state.dailySalesOverview = []
    state.skuData = {}
    state.selectedDates = []

    const payload = {
      customDateData: null,
      day,
      excludeYoYData: true,
      marketplace: userStore.marketplace,
      requestStatus: 0,
      sellerId: userStore.sellerId,
    }

    try {
      const res = await request('post', CONSTANTS?.api?.sales?.dailySalesOverview, payload)

      if (!isEmpty(res?.Data)) {
        updateCurrency(res.Data.Currency)
        updateDailySalesOverview(res.Data.item)
      } else {
        messageStore.setError({ error: CONSTANTS?.errors?.sales?.errorFetching })
      }
    } catch (error) {
      messageStore.setError({ error: CONSTANTS?.errors?.sales?.errorFetching })
    }
  }

  const updateCurrency = currency => {
    if (currency) {
      state.currency = currency
    }
  }

  const updateDailySalesOverview = items => {
    state.dailySalesOverview = items.map(item => ({
      date: item.date,
      fbaAmount: item.fbaAmount,
      fbmAmount: item.fbmAmount,
      fbaShippingAmount: item.fbaShippingAmount,
      profit: item.profit,
    }))
  }

  const fetchSkuData = async payload => {
    payload.pageNumber ||= 1

    const { dates, pageNumber } = payload
    state.selectedDates = dates

    if (isEmpty(dates) || !Array.isArray(dates)) {
      state.skuRefundRates = []
      return
    }

    state.isSkuRefundRatesLoading = true
    const data = buildRequestData(dates, pageNumber)

    try {
      const res = await request('post', CONSTANTS?.api?.sales?.skuData, data)
      handleSkuResponse(res, pageNumber)
    } catch (error) {
      messageStore.setError({ error: CONSTANTS?.errors?.sales?.errorFetching })
    }
  }

  const buildRequestData = (dates, pageNumber) => {
    const data = {
      isDaysCompare: dates.length > 1 ? 1 : 0,
      marketplace: userStore.marketplace,
      pageNumber,
      pageSize: CONSTANTS.defaultRecordSize,
      salesDate: first(dates),
      sellerId: userStore.sellerId,
    }

    if (dates.length > 1) {
      data.salesDate2 = dates[1]
    }

    return data
  }

  const handleSkuResponse = (res, pageNumber) => {
    if (!isEmpty(res?.Data)) {
      if (pageNumber === 1) {
        state.skuData = res.Data
      } else {
        state.skuData.item.skuList = [...state.skuData.item.skuList, ...res.Data.item.skuList]
      }
      fetchSkuRefundRates()
    } else {
      messageStore.setError({ error: CONSTANTS?.errors?.sales?.errorFetching })
    }
  }

  const fetchSkuRefundRates = async () => {
    const payload = {
      marketplace: userStore.marketplace,
      sellerId: userStore.sellerId,
      skuList: state.skuData?.item?.skuList || [],
    }

    try {
      const res = await request('post', CONSTANTS?.api?.sales?.skuRefundRates, payload)

      if (!isEmpty(res?.Data)) {
        state.skuRefundRates = res.Data
      } else {
        messageStore.setError({ error: CONSTANTS?.errors?.sales?.errorFetching })
      }
    } catch (error) {
      messageStore.setError({ error: CONSTANTS?.errors?.sales?.errorFetching })
    }

    state.isSkuRefundRatesLoading = false
  }

  return {
    ...toRefs(state),
    fetchDailySalesOverview,
    fetchSkuData,
  }
})
