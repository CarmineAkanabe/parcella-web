import type { Role } from '@/shared/types'

export interface NavItem {
  title: string
  to: string
  routeName: string
  icon: string
  roles?: Role[]
  badge?: string
}

export const ROLE_NAV_ITEMS: Record<Role, NavItem[]> = {
  CUSTOMER: [
    {
      title: 'Dashboard',
      to: '/customer',
      routeName: 'customer-dashboard',
      icon: 'mdi-view-dashboard-outline',
      roles: ['CUSTOMER'],
    },
    {
      title: 'My Deliveries',
      to: '/customer/deliveries',
      routeName: 'customer-deliveries',
      icon: 'mdi-package-variant-closed',
      roles: ['CUSTOMER'],
    },
    {
      title: 'New Delivery',
      to: '/customer/deliveries/new',
      routeName: 'customer-delivery-new',
      icon: 'mdi-plus-box-outline',
      roles: ['CUSTOMER'],
    },
  ],
  DRIVER: [
    {
      title: 'Dashboard',
      to: '/driver',
      routeName: 'driver-dashboard',
      icon: 'mdi-compass-outline',
      roles: ['DRIVER'],
    },
    {
      title: 'Requests Inbox',
      to: '/driver/requests',
      routeName: 'driver-requests',
      icon: 'mdi-inbox-arrow-down-outline',
      roles: ['DRIVER'],
    },
    {
      title: 'My Deliveries',
      to: '/driver/deliveries',
      routeName: 'driver-deliveries',
      icon: 'mdi-truck-delivery-outline',
      roles: ['DRIVER'],
    },
    {
      title: 'Vehicles & Status',
      to: '/driver/vehicles',
      routeName: 'driver-vehicles',
      icon: 'mdi-car-cog',
      roles: ['DRIVER'],
    },
    {
      title: 'Wallet',
      to: '/driver/wallet',
      routeName: 'driver-wallet',
      icon: 'mdi-wallet-outline',
      roles: ['DRIVER'],
    },
  ],
  ADMIN: [
    {
      title: 'Dashboard',
      to: '/admin',
      routeName: 'admin-dashboard',
      icon: 'mdi-shield-crown-outline',
      roles: ['ADMIN'],
    },
    {
      title: 'Driver Verification',
      to: '/admin/drivers',
      routeName: 'admin-drivers',
      icon: 'mdi-badge-account-horizontal-outline',
      roles: ['ADMIN'],
    },
    {
      title: 'Users',
      to: '/admin/users',
      routeName: 'admin-users',
      icon: 'mdi-account-group-outline',
      roles: ['ADMIN'],
    },
    {
      title: 'Disputes',
      to: '/admin/disputes',
      routeName: 'admin-disputes',
      icon: 'mdi-scale-balance',
      roles: ['ADMIN'],
    },
  ],
}

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    title: 'Notifications',
    to: '/notifications',
    routeName: 'notifications',
    icon: 'mdi-bell-outline',
  },
  {
    title: 'Profile',
    to: '/profile',
    routeName: 'profile',
    icon: 'mdi-account-circle-outline',
  },
]

export function getPrimaryNavForRole(role?: Role | null): NavItem[] {
  if (role && ROLE_NAV_ITEMS[role]) {
    return ROLE_NAV_ITEMS[role]
  }
  return ROLE_NAV_ITEMS.CUSTOMER
}
