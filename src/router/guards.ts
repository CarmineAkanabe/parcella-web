import type { Router } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth'

export function setupRouterGuards(router: Router): void {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    if (authStore.token && !authStore.isHydrated) {
      await authStore.hydrate()
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
      return authStore.homeRoute
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return {
        name: 'login',
        query: { redirect: to.fullPath },
      }
    }

    if (
      to.meta.roles?.length &&
      authStore.role &&
      !to.meta.roles.includes(authStore.role)
    ) {
      return authStore.homeRoute
    }

    return true
  })

  router.afterEach((to) => {
    const baseTitle = 'Parcella — Escrow Delivery Platform'
    document.title = to.meta.title
      ? `${to.meta.title} | Parcella`
      : baseTitle
  })
}
