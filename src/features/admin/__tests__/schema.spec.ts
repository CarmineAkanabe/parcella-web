import { describe, expect, it } from 'vitest'
import { rejectDriverSchema } from '../schema'

describe('admin/schema', () => {
  describe('rejectDriverSchema', () => {
    it('accepts valid rejection notes between 1 and 500 characters', () => {
      const valid = rejectDriverSchema.safeParse({
        note: 'The uploaded driver license is blurry and illegible. Please submit a high-resolution photo.',
      })
      expect(valid.success).toBe(true)
    })

    it('rejects empty or whitespace-only notes', () => {
      expect(rejectDriverSchema.safeParse({ note: '' }).success).toBe(false)
      expect(rejectDriverSchema.safeParse({ note: '   ' }).success).toBe(false)
    })

    it('rejects notes longer than 500 characters', () => {
      const overLimit = rejectDriverSchema.safeParse({
        note: 'A'.repeat(501),
      })
      expect(overLimit.success).toBe(false)
    })
  })
})
