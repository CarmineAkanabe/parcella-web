import { apiClient } from '@/shared/api'
import type { AdminDriverResponse, Page, UserResponse } from '@/shared/types'
import type {
  AdminDriverDecisionPayload,
  ListAdminDriversParams,
  ListAdminUsersParams,
} from './types'

export async function listAdminDriversApi(
  params?: ListAdminDriversParams,
): Promise<Page<UserResponse>> {
  const queryParams: Record<string, unknown> = {}
  if (params?.verificationStatus) {
    queryParams.verificationStatus = params.verificationStatus
  }
  if (typeof params?.page === 'number') {
    queryParams.page = params.page
  }
  if (typeof params?.size === 'number') {
    queryParams.size = params.size
  }

  const response = await apiClient.get<Page<UserResponse>>('/admin/drivers', {
    auth: 'user',
    params: queryParams,
  })
  return response.data
}

export async function getAdminDriverDetailApi(id: string): Promise<AdminDriverResponse> {
  const response = await apiClient.get<AdminDriverResponse>(`/admin/drivers/${id}`, {
    auth: 'user',
  })
  return response.data
}

export async function fetchAdminDriverLicenseBlobApi(
  licenseImageUrlOrPath: string,
): Promise<Blob> {
  const response = await apiClient.get<Blob>(licenseImageUrlOrPath, {
    auth: 'user',
    responseType: 'blob',
  })
  return response.data
}

export async function decideDriverVerificationApi(
  id: string,
  payload: AdminDriverDecisionPayload,
): Promise<UserResponse> {
  const response = await apiClient.post<UserResponse>(
    `/admin/drivers/${id}/verification`,
    payload,
    {
      auth: 'user',
    },
  )
  return response.data
}

export async function listAdminUsersApi(
  params?: ListAdminUsersParams,
): Promise<Page<UserResponse>> {
  const queryParams: Record<string, unknown> = {}
  if (params?.role) {
    queryParams.role = params.role
  }
  if (typeof params?.page === 'number') {
    queryParams.page = params.page
  }
  if (typeof params?.size === 'number') {
    queryParams.size = params.size
  }

  const response = await apiClient.get<Page<UserResponse>>('/admin/users', {
    auth: 'user',
    params: queryParams,
  })
  return response.data
}
