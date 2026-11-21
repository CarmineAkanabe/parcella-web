import { apiClient } from '@/shared/api'
import type { UserResponse, Vehicle } from '@/shared/types'
import type {
  AvailabilityStatus,
  CreateVehiclePayload,
  UpdateVehiclePayload,
} from './types'

export async function listMyVehiclesApi(): Promise<Vehicle[]> {
  const response = await apiClient.get<Vehicle[]>('/drivers/me/vehicles', {
    auth: 'user',
  })
  return response.data
}

export async function createVehicleApi(payload: CreateVehiclePayload): Promise<Vehicle> {
  const response = await apiClient.post<Vehicle>('/drivers/me/vehicles', payload, {
    auth: 'user',
  })
  return response.data
}

export async function updateVehicleApi(
  id: string,
  payload: UpdateVehiclePayload,
): Promise<Vehicle> {
  const response = await apiClient.patch<Vehicle>(`/drivers/me/vehicles/${id}`, payload, {
    auth: 'user',
  })
  return response.data
}

export async function activateVehicleApi(id: string): Promise<Vehicle> {
  const response = await apiClient.post<Vehicle>(
    `/drivers/me/vehicles/${id}/activate`,
    undefined,
    {
      auth: 'user',
    },
  )
  return response.data
}

export async function updateAvailabilityApi(
  availabilityStatus: AvailabilityStatus,
): Promise<UserResponse> {
  const response = await apiClient.patch<UserResponse>(
    '/drivers/me/availability',
    { availabilityStatus },
    {
      auth: 'user',
    },
  )
  return response.data
}

export async function uploadLicenseApi(file: File): Promise<UserResponse> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post<UserResponse>('/drivers/me/license', formData, {
    auth: 'user',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}
