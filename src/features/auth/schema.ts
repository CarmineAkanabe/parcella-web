import { z } from 'zod'
import { cameroonPhoneSchema } from '@/shared/utils'

export const locationSchema = z.object({
  lat: z
    .number({ message: 'Latitude is required' })
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  lng: z
    .number({ message: 'Longitude is required' })
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  address: z
    .string({ message: 'Address is required' })
    .trim()
    .min(1, 'Address cannot be blank')
    .max(500, 'Address must be at most 500 characters'),
})

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .max(255, 'Email must be at most 255 characters'),
  password: z.string().min(1, 'Password is required'),
})

export const registerStep1Schema = z.object({
  role: z.enum(['CUSTOMER', 'DRIVER'], {
    message: 'Select either CUSTOMER or DRIVER',
  }),
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .max(150, 'Full name must be at most 150 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .max(255, 'Email must be at most 255 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'),
  paymentPhoneNumber: cameroonPhoneSchema,
  preferredContactNumber: cameroonPhoneSchema,
})

export const registerSchema = registerStep1Schema.extend({
  registeredLocation: locationSchema,
})

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .max(150, 'Full name must be at most 150 characters')
    .optional(),
  paymentPhoneNumber: cameroonPhoneSchema.optional(),
  preferredContactNumber: cameroonPhoneSchema.optional(),
  registeredLocation: locationSchema.optional(),
})
