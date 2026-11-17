import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { useFormErrors } from '../useFormErrors'
import { ApiError } from '../../api/error'

const sampleSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  pickup: z.object({
    address: z.string().min(3, 'Pickup address is required'),
  }),
})

describe('shared/composables/useFormErrors', () => {
  it('validates data against a Zod schema and populates dotted path errors', () => {
    const form = useFormErrors(sampleSchema)

    const isValid = form.validate({
      fullName: 'A',
      email: 'not-an-email',
      pickup: { address: '' },
    })

    expect(isValid).toBe(false)
    expect(form.firstError('fullName')).toBe('Full name is required')
    expect(form.firstError('email')).toBe('Invalid email address')
    expect(form.firstError('pickup.address')).toBe('Pickup address is required')
  })

  it('returns true and clears errors when validation passes', () => {
    const form = useFormErrors(sampleSchema)
    form.validate({ fullName: '', email: 'bad', pickup: { address: '' } })
    expect(Object.keys(form.errors.value).length).toBeGreaterThan(0)

    const isValid = form.validate({
      fullName: 'Jean-Paul Mbarga',
      email: 'jp@parcella.cm',
      pickup: { address: 'Bastos, Yaoundé' },
    })

    expect(isValid).toBe(true)
    expect(form.errors.value).toEqual({})
    expect(form.formError.value).toBeNull()
  })

  it('maps server ProblemDetail errors and detail message via setServerErrors', () => {
    const form = useFormErrors(sampleSchema)
    const serverError = new ApiError({
      status: 422,
      title: 'Validation Error',
      detail: 'Unable to register account.',
      errors: {
        email: ['This email is already in use.'],
      },
    })

    form.setServerErrors(serverError)

    expect(form.formError.value).toBe('Unable to register account.')
    expect(form.firstError('email')).toBe('This email is already in use.')
  })

  it('clears individual fields and all errors cleanly', () => {
    const form = useFormErrors(sampleSchema)
    form.setServerErrors({
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          title: 'Bad Request',
          detail: 'Invalid payload',
          errors: {
            fullName: ['Too short'],
            email: ['Invalid domain'],
          },
        },
      },
    })

    form.clearField('fullName')
    expect(form.firstError('fullName')).toBeUndefined()
    expect(form.firstError('email')).toBe('Invalid domain')

    form.clearAll()
    expect(form.errors.value).toEqual({})
    expect(form.formError.value).toBeNull()
  })
})
