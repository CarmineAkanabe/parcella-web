import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AxiosHeaders } from 'axios'
import {
  ApiError,
  attachAuthRequestInterceptor,
  handleApiResponseError,
  normalizeApiError,
  setUnauthorizedHandler,
  TOKEN_STORAGE_KEY,
  type ParcellaInternalRequestConfig,
} from '../index'
import { useToast } from '../../composables/useToast'

describe('shared/api/error & interceptors', () => {
  beforeEach(() => {
    localStorage.clear()
    setUnauthorizedHandler(null)
    useToast().dismiss()
  })

  describe('normalizeApiError', () => {
    it('returns existing ApiError instance unchanged', () => {
      const existing = new ApiError({
        status: 404,
        title: 'Not Found',
        detail: 'Delivery #42 was not found.',
      })
      expect(normalizeApiError(existing)).toBe(existing)
    })

    it('extracts RFC 9457 ProblemDetail fields and field errors from AxiosError-like objects', () => {
      const rawAxiosError = {
        isAxiosError: true,
        message: 'Request failed with status code 422',
        response: {
          status: 422,
          statusText: 'Unprocessable Entity',
          data: {
            type: 'https://parcella.cm/errors/validation',
            title: 'Validation Failed',
            status: 422,
            detail: 'One or more fields failed validation.',
            errors: {
              paymentPhoneNumber: ['Phone number must start with 237 followed by 9 digits'],
              email: ['Email is already registered'],
            },
          },
        },
      }

      const normalized = normalizeApiError(rawAxiosError)
      expect(normalized).toBeInstanceOf(ApiError)
      expect(normalized.status).toBe(422)
      expect(normalized.title).toBe('Validation Failed')
      expect(normalized.detail).toBe('One or more fields failed validation.')
      expect(normalized.type).toBe('https://parcella.cm/errors/validation')
      expect(normalized.errors).toEqual({
        paymentPhoneNumber: ['Phone number must start with 237 followed by 9 digits'],
        email: ['Email is already registered'],
      })
    })

    it('normalizes network and generic Error instances gracefully', () => {
      const networkErr = normalizeApiError({
        isAxiosError: true,
        message: 'Network Error',
        response: undefined,
      })
      expect(networkErr.status).toBe(0)
      expect(networkErr.title).toBe('Network Error')

      const genericErr = normalizeApiError(new Error('Unexpected crash'))
      expect(genericErr.status).toBe(0)
      expect(genericErr.detail).toBe('Unexpected crash')
    })
  })

  describe('attachAuthRequestInterceptor', () => {
    it('attaches Authorization Bearer header only when auth is "user" and token exists', () => {
      localStorage.setItem(TOKEN_STORAGE_KEY, 'jwt-secret-token')

      const authedConfig = attachAuthRequestInterceptor({
        headers: new AxiosHeaders(),
        auth: 'user',
      } as ParcellaInternalRequestConfig)
      expect(authedConfig.headers.get('Authorization')).toBe('Bearer jwt-secret-token')

      const publicConfig = attachAuthRequestInterceptor({
        headers: new AxiosHeaders(),
        auth: 'none',
      } as ParcellaInternalRequestConfig)
      expect(publicConfig.headers.get('Authorization')).toBeUndefined()
    })
  })

  describe('handleApiResponseError', () => {
    it('clears token and invokes unauthorized handler on 401', async () => {
      localStorage.setItem(TOKEN_STORAGE_KEY, 'expired-token')
      const onUnauthorized = vi.fn()
      setUnauthorizedHandler(onUnauthorized)

      await expect(
        handleApiResponseError({
          isAxiosError: true,
          response: {
            status: 401,
            data: { title: 'Unauthorized', detail: 'Token expired' },
          },
        }),
      ).rejects.toBeInstanceOf(ApiError)

      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull()
      expect(onUnauthorized).toHaveBeenCalledTimes(1)
    })

    it('triggers toast error on 403 and 409 responses', async () => {
      const toast = useToast()

      await expect(
        handleApiResponseError({
          isAxiosError: true,
          response: {
            status: 403,
            data: { title: 'Forbidden', detail: 'Insufficient role' },
          },
        }),
      ).rejects.toMatchObject({ status: 403 })

      expect(toast.visible.value).toBe(true)
      expect(toast.variant.value).toBe('error')
      expect(toast.message.value).toBe('You do not have permission to perform this action.')

      await expect(
        handleApiResponseError({
          isAxiosError: true,
          response: {
            status: 409,
            data: { title: 'Conflict', detail: 'Delivery has already been accepted.' },
          },
        }),
      ).rejects.toMatchObject({ status: 409 })

      expect(toast.message.value).toBe('Delivery has already been accepted.')
    })
  })
})
