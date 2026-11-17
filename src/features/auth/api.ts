import { apiClient } from '@/shared/api'
import type { UserResponse } from '@/shared/types'
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  UpdateProfilePayload,
} from './types'

export async function registerApi(payload: RegisterPayload): Promise<UserResponse> {
  const response = await apiClient.post<UserResponse>('/auth/register', payload, {
    auth: 'none',
  })
  return response.data
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', payload, {
    auth: 'none',
  })
  return response.data
}

export async function getMeApi(): Promise<UserResponse> {
  const response = await apiClient.get<UserResponse>('/me', {
    auth: 'user',
  })
  return response.data
}

export async function updateMeApi(payload: UpdateProfilePayload): Promise<UserResponse> {
  const response = await apiClient.patch<UserResponse>('/me', payload, {
    auth: 'user',
  })
  return response.data
}
