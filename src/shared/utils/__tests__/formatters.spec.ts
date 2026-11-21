import { describe, expect, it } from 'vitest'
import {
  CAMEROON_PHONE_REGEX,
  VEHICLE_PLATE_REGEX,
  cameroonPhoneSchema,
  formatDateTime,
  formatDistance,
  formatXaf,
  resolveApiAssetUrl,
  validateImageFile,
} from '../formatters'

describe('shared/utils/formatters', () => {
  describe('formatXaf', () => {
    it('formats integer XAF amounts with normalized regular spaces and no decimals', () => {
      const formatted = formatXaf(3500)
      expect(formatted).not.toMatch(/[\u202f\u00a0]/)
      expect(formatted).toContain('3 500')
      expect(formatted).toMatch(/FCFA|XAF/)
    })

    it('rounds fractional amounts to the nearest integer', () => {
      const formatted = formatXaf(1249.6)
      expect(formatted).toContain('1 250')
    })

    it('handles zero and non-finite inputs gracefully', () => {
      expect(formatXaf(0)).toContain('0')
      expect(formatXaf(Number.NaN)).toContain('0')
    })
  })

  describe('formatDateTime', () => {
    it('formats a valid ISO string and Date instance', () => {
      const iso = '2026-04-12T10:00:00Z'
      const result = formatDateTime(iso)
      expect(result).not.toBe('—')
      expect(result).toContain('2026')
      expect(formatDateTime(new Date(iso))).toBe(result)
    })

    it('returns an em-dash for invalid, empty, or null dates', () => {
      expect(formatDateTime('not-a-valid-date')).toBe('—')
      expect(formatDateTime('')).toBe('—')
      expect(formatDateTime(null)).toBe('—')
      expect(formatDateTime(undefined)).toBe('—')
    })
  })

  describe('formatDistance', () => {
    it('formats distances under 1000 meters in whole meters', () => {
      expect(formatDistance(0)).toBe('0 m')
      expect(formatDistance(450.4)).toBe('450 m')
      expect(formatDistance(999)).toBe('999 m')
    })

    it('formats distances of 1000 meters or more in kilometers with 1 decimal', () => {
      expect(formatDistance(1000)).toBe('1.0 km')
      expect(formatDistance(2450)).toBe('2.5 km')
      expect(formatDistance(15320)).toBe('15.3 km')
    })

    it('guards negative or non-finite values', () => {
      expect(formatDistance(-50)).toBe('0 m')
      expect(formatDistance(Number.NaN)).toBe('0 m')
    })
  })

  describe('cameroonPhoneSchema & CAMEROON_PHONE_REGEX', () => {
    it('accepts valid Cameroon phone numbers starting with 237 followed by 9 digits', () => {
      expect(CAMEROON_PHONE_REGEX.test('237670123456')).toBe(true)
      expect(cameroonPhoneSchema.safeParse('237699001122').success).toBe(true)
    })

    it('rejects phone numbers missing 237 prefix or with wrong digit count', () => {
      const missingPrefix = cameroonPhoneSchema.safeParse('670123456')
      expect(missingPrefix.success).toBe(false)

      const tooShort = cameroonPhoneSchema.safeParse('23767012345')
      expect(tooShort.success).toBe(false)

      const withPlus = cameroonPhoneSchema.safeParse('+237670123456')
      expect(withPlus.success).toBe(false)
    })
  })

  describe('VEHICLE_PLATE_REGEX', () => {
    it('matches valid plates with letters, digits, spaces, and hyphens (4-20 chars)', () => {
      expect(VEHICLE_PLATE_REGEX.test('LT 824 EF')).toBe(true)
      expect(VEHICLE_PLATE_REGEX.test('CE-410-AB')).toBe(true)
      expect(VEHICLE_PLATE_REGEX.test('ABCD')).toBe(true)
      expect(VEHICLE_PLATE_REGEX.test('A'.repeat(20))).toBe(true)
    })

    it('rejects plates with invalid characters or out-of-range length', () => {
      expect(VEHICLE_PLATE_REGEX.test('ABC')).toBe(false)
      expect(VEHICLE_PLATE_REGEX.test('A'.repeat(21))).toBe(false)
      expect(VEHICLE_PLATE_REGEX.test('LT.824.EF')).toBe(false)
      expect(VEHICLE_PLATE_REGEX.test('LT#824$EF')).toBe(false)
    })
  })

  describe('resolveApiAssetUrl', () => {
    it('returns null for null, undefined, or empty path', () => {
      expect(resolveApiAssetUrl(null)).toBeNull()
      expect(resolveApiAssetUrl(undefined)).toBeNull()
      expect(resolveApiAssetUrl('')).toBeNull()
      expect(resolveApiAssetUrl('   ')).toBeNull()
    })

    it('returns full URLs as is', () => {
      expect(resolveApiAssetUrl('http://example.com/avatar.jpg')).toBe('http://example.com/avatar.jpg')
      expect(resolveApiAssetUrl('https://example.com/avatar.jpg')).toBe('https://example.com/avatar.jpg')
      expect(resolveApiAssetUrl('blob:http://localhost:5173/1234')).toBe('blob:http://localhost:5173/1234')
      expect(resolveApiAssetUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc')
    })

    it('resolves relative paths against API base URL and preserves query string', () => {
      const resolved = resolveApiAssetUrl('/users/123/avatar?v=abc')
      expect(resolved).toMatch(/\/users\/123\/avatar\?v=abc$/)
      expect(resolved).toMatch(/^https?:\/\//)

      const resolvedNoSlash = resolveApiAssetUrl('users/123/avatar?v=abc')
      expect(resolvedNoSlash).toBe(resolved)
    })
  })

  describe('validateImageFile', () => {
    it('accepts JPEG and PNG files within limit', () => {
      const jpeg = new File(['mock content'], 'test.jpg', { type: 'image/jpeg' })
      expect(validateImageFile(jpeg, 1024 * 1024)).toBeNull()

      const png = new File(['mock content'], 'test.png', { type: 'image/png' })
      expect(validateImageFile(png, 1024 * 1024)).toBeNull()
    })

    it('rejects unsupported file formats', () => {
      const webp = new File(['mock content'], 'test.webp', { type: 'image/webp' })
      expect(validateImageFile(webp, 1024 * 1024)).toContain('Only JPEG and PNG')

      const pdf = new File(['mock content'], 'test.pdf', { type: 'application/pdf' })
      expect(validateImageFile(pdf, 1024 * 1024)).toContain('Only JPEG and PNG')
    })

    it('rejects files exceeding max byte size', () => {
      const largeFile = new File([new Uint8Array(2000)], 'test.jpg', { type: 'image/jpeg' })
      expect(validateImageFile(largeFile, 1000)).toContain('must not exceed')
    })
  })
})
