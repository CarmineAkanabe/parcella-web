export type Role = 'CUSTOMER' | 'DRIVER' | 'ADMIN'

export type AuthMode = 'none' | 'user'

export type PackageSize = 'SMALL' | 'MEDIUM' | 'LARGE'

export type VehicleType = 'BIKE' | 'MOTORBIKE' | 'CAR' | 'VAN'

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE'

export type DeliveryStatus =
  | 'REQUESTED'
  | 'AWAITING_DRIVER_RESPONSE'
  | 'ACCEPTED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'DISPUTED'

export type PaymentStatus = 'PENDING' | 'HELD' | 'RELEASED' | 'REFUNDED' | 'FAILED'

export type DisputeStatus = 'OPEN' | 'RESOLVED'

export type WalletEntryType = 'EARNING' | 'WITHDRAWAL'

export type WalletEntryStatus = 'PENDING' | 'COMPLETED' | 'FAILED'

export type AnyStatus =
  | DeliveryStatus
  | PaymentStatus
  | VerificationStatus
  | AvailabilityStatus
  | DisputeStatus
  | WalletEntryStatus

export interface Location {
  lat: number
  lng: number
  address: string
}

export interface DriverSummary {
  verificationStatus: VerificationStatus
  availabilityStatus: AvailabilityStatus
  averageRating: number
  trustScore: number
}

export interface UserResponse {
  id: string
  role: Role
  fullName: string
  email: string
  paymentPhoneNumber: string
  preferredContactNumber: string
  registeredLocation: Location | null
  createdAt: string
  driver: DriverSummary | null
}

export interface Vehicle {
  id: string
  type: VehicleType
  plateNumber: string
  maxPackageSize: PackageSize
  active: boolean
}

export interface DeliveryParticipant {
  id: string
  fullName: string
}

export interface DeliveryDriverSummary {
  id: string
  fullName: string
  averageRating: number
  trustScore: number
}

export interface DeliveryResponse {
  id: string
  status: DeliveryStatus
  paymentStatus: PaymentStatus
  packageDescription: string
  packageSize: PackageSize
  deliveryFee: number
  sender: DeliveryParticipant
  receiver: DeliveryParticipant
  driver: DeliveryDriverSummary | null
  pickup: Location
  destination: Location
  pickupCode: string | null
  deliveryCode: string | null
  allowedActions: string[]
  createdAt: string
  completedAt: string | null
}

export interface Page<T> {
  items: T[]
  page: number
  size: number
  totalItems: number
  totalPages: number
}

export interface ProblemDetail {
  type?: string
  title?: string
  status?: number
  detail?: string
  errors?: Record<string, string[]>
}
