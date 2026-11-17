import axios from 'axios'
import type { ProblemDetail } from '../types'

export interface ApiErrorInit {
  status: number
  title: string
  detail: string
  type?: string
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  status: number
  title: string
  detail: string
  type?: string
  errors: Record<string, string[]>

  constructor(init: ApiErrorInit) {
    super(init.detail || init.title || 'An unexpected error occurred')
    this.name = 'ApiError'
    this.status = init.status
    this.title = init.title
    this.detail = init.detail
    this.type = init.type
    this.errors = init.errors ? { ...init.errors } : {}
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

function normalizeFieldErrors(rawErrors: unknown): Record<string, string[]> {
  if (!rawErrors || typeof rawErrors !== 'object' || Array.isArray(rawErrors)) {
    return {}
  }

  const normalized: Record<string, string[]> = {}
  for (const [key, value] of Object.entries(rawErrors as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      const messages = value.filter((item): item is string => typeof item === 'string')
      if (messages.length > 0) {
        normalized[key] = messages
      }
    } else if (typeof value === 'string' && value.trim().length > 0) {
      normalized[key] = [value]
    }
  }
  return normalized
}

export function normalizeApiError(err: unknown): ApiError {
  if (err instanceof ApiError) {
    return err
  }

  if (
    axios.isAxiosError(err) ||
    (typeof err === 'object' && err !== null && 'response' in err)
  ) {
    const axiosLike = err as {
      message?: string
      response?: {
        status?: number
        statusText?: string
        data?: ProblemDetail | Record<string, unknown> | string
      }
    }

    const response = axiosLike.response
    if (response) {
      const status = typeof response.status === 'number' ? response.status : 500
      const data =
        typeof response.data === 'object' && response.data !== null
          ? (response.data as ProblemDetail & Record<string, unknown>)
          : undefined

      const title =
        (typeof data?.title === 'string' && data.title) ||
        response.statusText ||
        (status === 400 || status === 422
          ? 'Validation Error'
          : status === 401
            ? 'Unauthorized'
            : status === 403
              ? 'Forbidden'
              : status === 404
                ? 'Not Found'
                : status === 409
                  ? 'Conflict'
                  : 'Request Failed')

      const detail =
        (typeof data?.detail === 'string' && data.detail) ||
        (typeof data?.message === 'string' && data.message) ||
        axiosLike.message ||
        'The server could not process the request.'

      const type = typeof data?.type === 'string' ? data.type : undefined
      const errors = normalizeFieldErrors(data?.errors)

      return new ApiError({
        status,
        title,
        detail,
        type,
        errors,
      })
    }

    return new ApiError({
      status: 0,
      title: 'Network Error',
      detail:
        axiosLike.message ||
        'Unable to reach the server. Please check your network connection.',
      errors: {},
    })
  }

  if (err instanceof Error) {
    return new ApiError({
      status: 0,
      title: err.name || 'Error',
      detail: err.message || 'An unexpected error occurred.',
      errors: {},
    })
  }

  return new ApiError({
    status: 0,
    title: 'Unknown Error',
    detail: typeof err === 'string' ? err : 'An unexpected error occurred.',
    errors: {},
  })
}
