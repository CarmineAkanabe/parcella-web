import { describe, expect, it } from 'vitest'
import {
  CAMEROON_PHONE_REGEX,
  cameroonPhoneSchema,
  formatDateTime,
  formatDistance,
  formatXaf,
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
})
