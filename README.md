# 🌟 Vue 3 HighCharts Tailwind Boilerplate

✨ Powered by Modern Technologies

- **Vue 3**: The versatile powerhouse that makes building dynamic user interfaces a breeze.
- **Tailwind**: A utility-first CSS framework for rapid UI development.
- **Pinia**: Simplified and intuitive state management for Vue 3 applications.
- **Vite**: Lightning-fast build tool that ensures your development experience is as smooth as silk.
- **i18n**: Ready to go with translations, though not yet implemented.

## 🎥 Demo

https://github.com/mustafacagri/vue3-highcharts-tailwind-boilerplate/assets/7488394/099e6d53-f6c0-4e23-b0d8-d195d8cd231b

### 🔑 Credentials
- homework@eva.guru
- Homeworkeva1**

## Component Structure

- **Skeletons**

  - **ChartSkeleton**: Placeholder for charts.
  - **TableSkeleton**: Placeholder for tables.

- **Chart**: The component to display our charts.

- **GetErrorSuccess**
- **VueTable**: Component with pagination and search functionalities.

## Layout Structure

The repository includes a structured layout schema that can be easily utilized. To use a new layout, simply specify its name in the router when creating a new route. All handling is managed in the `loadLayoutMiddleware.js` file.

## View Structure

There are two main views in this repository:

- **Home (Login screen)**: Entry point of the application.
- **Dashboard**: Displays charts and related tables.

## Utility Files

- **Request**: Centralized handling of HTTP requests.
- **Time**: Utility functions for consistent date formatting across the application.

## CONSTANTS!

The `CONSTANTS.js` file defines crucial constants for the application:

```javascript
// CONSTANTS.js
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
```

## .env

```
VITE_OPENAI_API_BASEURL=https://iapitest.eva.guru/
```

## 🚀 Features

**State Management**

- **Pinia**: Simplified and intuitive state management for maintaining the application state.

**Efficient Development Workflow**

- **Vite**: Fast build tool for an efficient development experience.
- **Modular Code Structure**: Clean and maintainable codebase with Vue 3's Composition API.

## 🛠️ Setup Instructions

### Cloning and Running Locally

To get started, clone the repository and run the development server:

```bash
git clone https://github.com/mustafacagri/vue3-highcharts-tailwind-boilerplate.git
cd vue3-highcharts-tailwind-boilerplate
yarn install
yarn dev
```

The application will be running at http://localhost:5018/. You can redefine the port in the vite.config.js file.

## How can I support? 🌟

- ⭐ Star my GitHub repo.
- 🛠 Create pull requests, submit bugs, suggest new features or updates.
