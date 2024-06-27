import { createRouter, createWebHistory } from 'vue-router'
import { loadLayoutMiddleware } from '@/router/middleware/loadLayoutMiddleware'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
  ],
})

router.beforeEach(loadLayoutMiddleware)

export default router
