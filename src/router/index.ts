import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { Role } from '@/shared/types'
import { setupRouterGuards } from './guards'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'public' | 'auth' | 'error'
    requiresAuth?: boolean
    guestOnly?: boolean
    roles?: Role[]
    title?: string
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'login' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: {
      layout: 'public',
      guestOnly: true,
      title: 'Operator Sign In',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/auth/RegisterPage.vue'),
    meta: {
      layout: 'public',
      guestOnly: true,
      title: 'Create Account',
    },
  },
  {
    path: '/customer',
    name: 'customer-dashboard',
    component: () => import('@/pages/customer/CustomerDashboardPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: true,
      roles: ['CUSTOMER'],
      title: 'Customer Dashboard',
    },
  },
  {
    path: '/customer/deliveries',
    name: 'customer-deliveries',
    component: () => import('@/pages/customer/CustomerDeliveriesPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: true,
      roles: ['CUSTOMER'],
      title: 'My Deliveries',
    },
  },
  {
    path: '/customer/deliveries/new',
    name: 'customer-delivery-new',
    component: () => import('@/pages/customer/NewDeliveryPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: true,
      roles: ['CUSTOMER'],
      title: 'New Delivery Request',
    },
  },
  {
    path: '/driver',
    name: 'driver-dashboard',
    component: () => import('@/pages/driver/DriverDashboardPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: true,
      roles: ['DRIVER'],
      title: 'Driver Console',
    },
  },
  {
    path: '/driver/requests',
    name: 'driver-requests',
    component: () => import('@/pages/driver/DriverRequestsPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: true,
      roles: ['DRIVER'],
      title: 'Requests Inbox',
    },
  },
  {
    path: '/driver/deliveries',
    name: 'driver-deliveries',
    component: () => import('@/pages/driver/DriverDeliveriesPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: true,
      roles: ['DRIVER'],
      title: 'Driver Deliveries',
    },
  },
  {
    path: '/driver/vehicles',
    name: 'driver-vehicles',
    component: () => import('@/pages/driver/DriverVehiclesPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: true,
      roles: ['DRIVER'],
      title: 'Vehicles & Availability',
    },
  },
  {
    path: '/driver/wallet',
    name: 'driver-wallet',
    component: () => import('@/pages/driver/DriverWalletPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: true,
      roles: ['DRIVER'],
      title: 'Driver Escrow Wallet',
    },
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('@/pages/admin/AdminDashboardPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: true,
      roles: ['ADMIN'],
      title: 'Admin Operations Overview',
    },
  },
  {
    path: '/admin/drivers',
    name: 'admin-drivers',
    component: () => import('@/pages/admin/AdminDriversPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: true,
      roles: ['ADMIN'],
      title: 'Driver Verification Queue',
    },
  },
  {
    path: '/admin/drivers/:id',
    name: 'admin-driver-detail',
    component: () => import('@/pages/admin/AdminDriverDetailPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: true,
      roles: ['ADMIN'],
      title: 'Driver Verification Dossier',
    },
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('@/pages/admin/AdminUsersPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: true,
      roles: ['ADMIN'],
      title: 'Platform Users Directory',
    },
  },
  {
    path: '/admin/disputes',
    name: 'admin-disputes',
    component: () => import('@/pages/admin/AdminDisputesPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: true,
      roles: ['ADMIN'],
      title: 'Escrow Disputes Resolution',
    },
  },
  {
    path: '/deliveries/:id',
    name: 'delivery-detail',
    component: () => import('@/pages/shared/DeliveryDetailPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: true,
      title: 'Delivery Telemetry & Custody',
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/pages/shared/ProfilePage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: true,
      title: 'Operator Profile',
    },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/pages/shared/NotificationsPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: true,
      title: 'System Notifications',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/shared/NotFoundPage.vue'),
    meta: {
      layout: 'error',
      title: '404 — Route Not Found',
    },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

setupRouterGuards(router)

export default router
