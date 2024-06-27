export default {
  api: {
    login: 'oauth/token',
    me: 'user/user-information',
    sales: {
      dailySalesOverview: 'data/daily-sales-overview',
      skuData: 'data/daily-sales-sku-list',
      skuRefundRates: 'data/get-sku-refund-rate',
    },
  },
  dailySalesOverviewDays: [7, 14, 30, 60],
  defaultCurrency: '$',
  defaultRecordPerPage: 10,
  defaultRecordSize: 30,
  errors: {
    dashboard: { maxComparisonDays: 'You can not compare more than 2 days' },
    noData: 'No data available',
    sales: { errorFetching: 'Error fetching sales' },
    users: { loginError: 'Invalid Credentials', invalidToken: 'Invalid Token' },
  },
  maxComparisonDays: 2,
  routes: { dashboard: '/dashboard' },
}
