import { defineStore } from 'pinia'
import { TOKEN_STORAGE_KEY } from '../api'
import type { Role, UserResponse } from '../types'
import {
  getMeApi,
  loginApi,
  registerApi,
  updateMeApi,
  type LoginPayload,
  type LoginResponse,
  type RegisterPayload,
  type UpdateProfilePayload,
} from '@/features/auth'

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

    async login(payload: LoginPayload): Promise<LoginResponse> {
      this.isLoading = true
      try {
        const result = await loginApi({
          email: payload.email.trim().toLowerCase(),
          password: payload.password,
        })
        this.setSession(result.accessToken, result.user)
        return result
      } finally {
        this.isLoading = false
      }
    },

    async register(payload: RegisterPayload): Promise<UserResponse> {
      this.isLoading = true
      try {
        const normalized: RegisterPayload = {
          ...payload,
          fullName: payload.fullName.trim(),
          email: payload.email.trim().toLowerCase(),
          paymentPhoneNumber: payload.paymentPhoneNumber.trim(),
          preferredContactNumber: payload.preferredContactNumber.trim(),
          registeredLocation: {
            lat: payload.registeredLocation.lat,
            lng: payload.registeredLocation.lng,
            address: payload.registeredLocation.address.trim(),
          },
        }
        return await registerApi(normalized)
      } finally {
        this.isLoading = false
      }
    },

    async updateProfile(payload: UpdateProfilePayload): Promise<UserResponse> {
      this.isLoading = true
      try {
        const updated = await updateMeApi(payload)
        this.user = updated
        return updated
      } finally {
        this.isLoading = false
      }
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
        const user = await getMeApi()
        this.user = user
      } catch {
        this.clearSession()
      } finally {
        this.isLoading = false
        this.isHydrated = true
      }
    },
  },
})
