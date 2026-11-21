import { z } from 'zod'
import { VEHICLE_PLATE_REGEX } from '@/shared/utils'

export const vehicleSchema = z.object({
  type: z.enum(['BIKE', 'MOTORBIKE', 'CAR', 'VAN'] as const, {
    message: 'Please select a valid vehicle type',
  }),
  plateNumber: z
    .string()
    .trim()
    .regex(
      VEHICLE_PLATE_REGEX,
      'Plate number must be 4–20 characters (letters, numbers, spaces, or hyphens)',
    ),
  maxPackageSize: z.enum(['SMALL', 'MEDIUM', 'LARGE'] as const, {
    message: 'Please select maximum parcel size capacity',
  }),
})

export type VehicleFormValues = z.infer<typeof vehicleSchema>

export const availabilitySchema = z.object({
  availabilityStatus: z.enum(['AVAILABLE', 'OFFLINE'] as const, {
    message: 'Driver can only toggle availability to AVAILABLE or OFFLINE',
  }),
})

export type AvailabilityFormValues = z.infer<typeof availabilitySchema>
