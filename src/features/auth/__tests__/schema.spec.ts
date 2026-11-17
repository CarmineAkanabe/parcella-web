import { describe, expect, it } from 'vitest'
import {
  locationSchema,
  loginSchema,
  registerSchema,
  registerStep1Schema,
  updateProfileSchema,
} from '../schema'
import { useFormErrors } from '@/shared/composables/useFormErrors'

describe('Auth & Profile Zod Schemas (Slice F2)', () => {
  describe('locationSchema', () => {
    it('accepts valid Cameroon coordinates and non-blank address', () => {
      const result = locationSchema.safeParse({
        lat: 3.848,
        lng: 11.5021,
        address: 'Bastos, Yaoundé, Cameroon',
      })
      expect(result.success).toBe(true)
    })

    it('rejects out-of-range latitude/longitude and blank or >500 char address', () => {
      expect(
        locationSchema.safeParse({ lat: 95, lng: 11.5, address: 'Yaoundé' }).success,
      ).toBe(false)
      expect(
        locationSchema.safeParse({ lat: 3.8, lng: -185, address: 'Yaoundé' }).success,
      ).toBe(false)
      expect(
        locationSchema.safeParse({ lat: 3.8, lng: 11.5, address: '   ' }).success,
      ).toBe(false)
      expect(
        locationSchema.safeParse({
          lat: 3.8,
          lng: 11.5,
          address: 'A'.repeat(501),
        }).success,
      ).toBe(false)
    })
  })

  describe('loginSchema', () => {
    it('accepts valid email and password', () => {
      const res = loginSchema.safeParse({
        email: 'operator@parcella.cm',
        password: 'password123',
      })
      expect(res.success).toBe(true)
    })

    it('rejects invalid email or empty password', () => {
      expect(
        loginSchema.safeParse({ email: 'not-an-email', password: 'secret' }).success,
      ).toBe(false)
      expect(
        loginSchema.safeParse({ email: 'operator@parcella.cm', password: '' }).success,
      ).toBe(false)
    })
  })

  describe('registerStep1Schema & registerSchema', () => {
    const validStep1 = {
      role: 'CUSTOMER' as const,
      fullName: 'Jean-Paul Mbarga',
      email: 'jp.mbarga@parcella.cm',
      password: 'securePassword123',
      paymentPhoneNumber: '237670112233',
      preferredContactNumber: '237690445566',
    }

    it('accepts valid CUSTOMER and DRIVER registration payloads', () => {
      expect(registerStep1Schema.safeParse(validStep1).success).toBe(true)
      expect(
        registerSchema.safeParse({
          ...validStep1,
          role: 'DRIVER',
          registeredLocation: {
            lat: 4.0511,
            lng: 9.7679,
            address: 'Akwa, Douala, Cameroon',
          },
        }).success,
      ).toBe(true)
    })

    it('rejects ADMIN role, short/long passwords, and invalid Cameroon phone numbers', () => {
      expect(
        registerStep1Schema.safeParse({
          ...validStep1,
          role: 'ADMIN',
        }).success,
      ).toBe(false)

      expect(
        registerStep1Schema.safeParse({
          ...validStep1,
          password: 'short',
        }).success,
      ).toBe(false)

      expect(
        registerStep1Schema.safeParse({
          ...validStep1,
          password: 'p'.repeat(73),
        }).success,
      ).toBe(false)

      expect(
        registerStep1Schema.safeParse({
          ...validStep1,
          paymentPhoneNumber: '0670112233',
        }).success,
      ).toBe(false)
    })
  })

  describe('updateProfileSchema & nested dot-path errors', () => {
    it('validates partial profile updates and maps nested registeredLocation dot paths', () => {
      expect(
        updateProfileSchema.safeParse({
          fullName: 'Updated Name',
          paymentPhoneNumber: '237677889900',
        }).success,
      ).toBe(true)

      const formErrors = useFormErrors(registerSchema)
      formErrors.setServerErrors({
        status: 422,
        title: 'Validation Error',
        detail: 'Invalid request content.',
        errors: {
          'registeredLocation.lat': ['Latitude must be between -90 and 90'],
        },
      })

      expect(formErrors.firstError('registeredLocation.lat')).toBe(
        'Latitude must be between -90 and 90',
      )
      expect(formErrors.firstErrorForPrefix('registeredLocation')).toBe(
        'Latitude must be between -90 and 90',
      )

      formErrors.clearPrefix('registeredLocation')
      expect(formErrors.firstErrorForPrefix('registeredLocation')).toBeUndefined()
    })
  })
})
