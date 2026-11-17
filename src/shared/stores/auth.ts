import { defineStore } from 'pinia'
import { apiClient, TOKEN_STORAGE_KEY } from '../api'
import type { Role, UserResponse } from '../types'

function readStoredToken(): string | null {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: readStoredToken() as string | null,
    user: null as UserResponse | null,
    isHydrated: false,
    isLoading: false,
  }),

  getters: {
    isAuthenticated(state): boolean {
      return Boolean(state.token && state.user)
    },

    role(state): Role | null {
      return state.user?.role ?? null
    },

    homeRoute(): string {
      switch (this.role) {
        case 'CUSTOMER':
          return '/customer'
        case 'DRIVER':
          return '/driver'
        case 'ADMIN':
          return '/admin'
        default:
          return '/login'
      }
    },
  },

  actions: {
    setSession(token: string, user: UserResponse): void {
      this.token = token
      this.user = user
      this.isHydrated = true
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, token)
      }
    },

    clearSession(): void {
      this.token = null
      this.user = null
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
      }
    },

    logout(): void {
      this.clearSession()
    },

    async hydrate(): Promise<void> {
      const storedToken = this.token ?? readStoredToken()
      if (!storedToken) {
        this.token = null
        this.user = null
        this.isHydrated = true
        return
      }

      this.token = storedToken
      this.isLoading = true
      try {
        const response = await apiClient.get<UserResponse>('/me', { auth: 'user' })
        this.user = response.data
      } catch {
        this.clearSession()
      } finally {
        this.isLoading = false
        this.isHydrated = true
      }
    },
  },
})
