import type { Location, UserResponse } from '@/shared/types'

export type RegisterRole = 'CUSTOMER' | 'DRIVER'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: UserResponse
}

export interface RegisterPayload {
  role: RegisterRole
  fullName: string
  email: string
  password: string
  paymentPhoneNumber: string
  preferredContactNumber: string
  registeredLocation: Location
}

export interface UpdateProfilePayload {
  fullName?: string
  paymentPhoneNumber?: string
  preferredContactNumber?: string
  registeredLocation?: Location
}
