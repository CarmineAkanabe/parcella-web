import { z } from 'zod'

const xafFormatter = new Intl.NumberFormat('fr-CM', {
  style: 'currency',
  currency: 'XAF',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

/**
 * Formats an integer XAF amount using fr-CM currency formatting
 * and normalizes narrow/non-breaking spaces to standard ASCII spaces.
 */
export function formatXaf(amount: number): string {
  if (!Number.isFinite(amount)) {
    return xafFormatter.format(0).replace(/[\u202f\u00a0]/g, ' ')
  }
  return xafFormatter.format(Math.round(amount)).replace(/[\u202f\u00a0]/g, ' ')
}

/**
 * Formats an ISO 8601 string or Date into a readable medium date + short time,
 * returning '—' when the input cannot be parsed as a valid date.
 */
export function formatDateTime(isoOrDate: string | Date | null | undefined): string {
  if (!isoOrDate) return '—'
  const date = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }
  return dateTimeFormatter.format(date).replace(/[\u202f\u00a0]/g, ' ')
}

/**
 * Formats a distance in meters into `N m` (< 1000m) or `N.N km` (>= 1000m).
 */
export function formatDistance(meters: number): string {
  if (!Number.isFinite(meters) || meters < 0) {
    return '0 m'
  }
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

export const CAMEROON_PHONE_REGEX = /^237\d{9}$/

export const VEHICLE_PLATE_REGEX = /^[A-Za-z0-9 -]{4,20}$/

export const cameroonPhoneSchema = z
  .string()
  .regex(CAMEROON_PHONE_REGEX, 'Phone number must start with 237 followed by 9 digits')

/**
 * Resolves a relative API asset path (such as /users/{id}/avatar?v=...) into
 * a full URL against the configured VITE_API_BASE_URL.
 */
export function resolveApiAssetUrl(relativePath: string | null | undefined): string | null {
  if (!relativePath || !relativePath.trim()) {
    return null
  }
  const cleanPath = relativePath.trim()
  if (
    cleanPath.startsWith('http://') ||
    cleanPath.startsWith('https://') ||
    cleanPath.startsWith('blob:') ||
    cleanPath.startsWith('data:')
  ) {
    return cleanPath
  }
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1').replace(/\/+$/, '')
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`
  return `${baseUrl}${normalizedPath}`
}

/**
 * Validates that an uploaded file is a supported image (JPEG/PNG) and within byte limit.
 * Returns an error message string if invalid, or null if valid.
 */
export function validateImageFile(file: File, maxBytes: number): string | null {
  if (!file) {
    return 'Please select an image file.'
  }
  const validTypes = ['image/jpeg', 'image/png']
  if (!validTypes.includes(file.type)) {
    return 'Only JPEG and PNG images are supported.'
  }
  if (file.size > maxBytes) {
    const maxMb = (maxBytes / (1024 * 1024)).toFixed(0)
    return `Image file size must not exceed ${maxMb} MB.`
  }
  return null
}
