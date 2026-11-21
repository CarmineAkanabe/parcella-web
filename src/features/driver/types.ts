import type {
  AvailabilityStatus,
  PackageSize,
  Vehicle,
  VehicleType,
  VerificationStatus,
} from '@/shared/types'

export type {
  AvailabilityStatus,
  PackageSize,
  Vehicle,
  VehicleType,
  VerificationStatus,
}

export interface CreateVehiclePayload {
  type: VehicleType
  plateNumber: string
  maxPackageSize: PackageSize
}

export interface UpdateVehiclePayload {
  type?: VehicleType
  plateNumber?: string
  maxPackageSize?: PackageSize
}

export interface UpdateAvailabilityPayload {
  availabilityStatus: AvailabilityStatus
}
