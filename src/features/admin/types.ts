import type {
  AdminDriverResponse,
  Page,
  Role,
  UserResponse,
  VerificationStatus,
} from '@/shared/types'

export type {
  AdminDriverResponse,
  Page,
  Role,
  UserResponse,
  VerificationStatus,
}

export interface AdminDriverDecisionPayload {
  decision: 'APPROVED' | 'REJECTED'
  note?: string
}

export interface ListAdminDriversParams {
  verificationStatus?: VerificationStatus
  page?: number
  size?: number
}

export interface ListAdminUsersParams {
  role?: Role
  page?: number
  size?: number
}
