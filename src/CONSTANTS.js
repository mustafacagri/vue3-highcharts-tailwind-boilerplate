const config = {
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
    users: {
      loginError: 'Invalid Credentials',
      invalidToken: 'Invalid Token',
      userData: 'Error fetching user data',
      email: 'Invalid Email',
      get password() {
        return `Password should be at least ${config?.password?.minLength || 8} characters`
      },
    },
  },
  maxComparisonDays: 2,
  password: { minLength: 8 },
  routes: { dashboard: '/dashboard' },
}

export default config
