import { z } from 'zod'

export const rejectDriverSchema = z.object({
  note: z
    .string()
    .trim()
    .min(1, 'Please provide a reason for rejecting the driver application')
    .max(500, 'Rejection note must not exceed 500 characters'),
})

export type RejectDriverFormValues = z.infer<typeof rejectDriverSchema>
