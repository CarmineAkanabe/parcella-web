import { describe, expect, it } from 'vitest'
import { availabilitySchema, vehicleSchema } from '../schema'

describe('driver/schema', () => {
  describe('vehicleSchema', () => {
    it('accepts valid Cameroon vehicle data', () => {
      const validCases = [
        { type: 'BIKE', plateNumber: 'BK-100', maxPackageSize: 'SMALL' },
        { type: 'MOTORBIKE', plateNumber: 'LT 824 EF', maxPackageSize: 'MEDIUM' },
        { type: 'CAR', plateNumber: 'CE-410-AB', maxPackageSize: 'LARGE' },
        { type: 'VAN', plateNumber: 'LT 999 1234', maxPackageSize: 'LARGE' },
      ]

      for (const valid of validCases) {
        const result = vehicleSchema.safeParse(valid)
        expect(result.success).toBe(true)
      }
    })

    it('rejects invalid plate numbers', () => {
      // Too short (< 4 chars)
      expect(vehicleSchema.safeParse({
        type: 'CAR',
        plateNumber: 'ABC',
        maxPackageSize: 'MEDIUM',
      }).success).toBe(false)

      // Too long (> 20 chars)
      expect(vehicleSchema.safeParse({
        type: 'CAR',
        plateNumber: 'A'.repeat(21),
        maxPackageSize: 'MEDIUM',
      }).success).toBe(false)

      // Disallowed special characters
      expect(vehicleSchema.safeParse({
        type: 'CAR',
        plateNumber: 'LT@824#EF',
        maxPackageSize: 'MEDIUM',
      }).success).toBe(false)
    })

    it('rejects invalid vehicle types or package sizes', () => {
      expect(vehicleSchema.safeParse({
        type: 'TRUCK',
        plateNumber: 'LT 824 EF',
        maxPackageSize: 'MEDIUM',
      }).success).toBe(false)

      expect(vehicleSchema.safeParse({
        type: 'CAR',
        plateNumber: 'LT 824 EF',
        maxPackageSize: 'EXTRA_LARGE',
      }).success).toBe(false)
    })
  })

  describe('availabilitySchema', () => {
    it('accepts AVAILABLE and OFFLINE', () => {
      expect(availabilitySchema.safeParse({ availabilityStatus: 'AVAILABLE' }).success).toBe(true)
      expect(availabilitySchema.safeParse({ availabilityStatus: 'OFFLINE' }).success).toBe(true)
    })

    it('rejects BUSY or unsupported statuses', () => {
      // Driver cannot manually set BUSY
      expect(availabilitySchema.safeParse({ availabilityStatus: 'BUSY' }).success).toBe(false)
      expect(availabilitySchema.safeParse({ availabilityStatus: 'ACTIVE' }).success).toBe(false)
    })
  })
})
