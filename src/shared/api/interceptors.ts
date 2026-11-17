import type {
  AxiosBasicCredentials,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import type { AuthMode } from '../types'
import { useToast } from '../composables/useToast'
import { normalizeApiError } from './error'

export interface ParcellaRequestConfig<D = unknown> extends Omit<AxiosRequestConfig<D>, 'auth'> {
  auth?: AuthMode | AxiosBasicCredentials
}

export interface ParcellaInternalRequestConfig<D = unknown>
  extends Omit<InternalAxiosRequestConfig<D>, 'auth'> {
  auth?: AuthMode | AxiosBasicCredentials
}

export interface ParcellaAxiosInstance
  extends Omit<
    AxiosInstance,
    'request' | 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch'
  > {
  request<T = unknown, R = AxiosResponse<T>, D = unknown>(
    config: ParcellaRequestConfig<D>,
  ): Promise<R>
  get<T = unknown, R = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: ParcellaRequestConfig<D>,
  ): Promise<R>
  delete<T = unknown, R = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: ParcellaRequestConfig<D>,
  ): Promise<R>
  head<T = unknown, R = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: ParcellaRequestConfig<D>,
  ): Promise<R>
  options<T = unknown, R = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: ParcellaRequestConfig<D>,
  ): Promise<R>
  post<T = unknown, R = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: ParcellaRequestConfig<D>,
  ): Promise<R>
  put<T = unknown, R = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: ParcellaRequestConfig<D>,
  ): Promise<R>
  patch<T = unknown, R = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: ParcellaRequestConfig<D>,
  ): Promise<R>
}

export const TOKEN_STORAGE_KEY = 'parcella_token'

export type UnauthorizedHandler = (redirectPath: string) => void

let unauthorizedHandler: UnauthorizedHandler | null = null

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler
}

export function attachAuthRequestInterceptor(
  config: ParcellaInternalRequestConfig,
): InternalAxiosRequestConfig {
  const authMode = config.auth
  if (authMode === 'user' || authMode === 'none') {
    delete config.auth
  }

  if (authMode === 'user') {
    const token =
      typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }
  }
  return config as InternalAxiosRequestConfig
}

export function handleApiResponseError(error: unknown): Promise<never> {
  const apiError = normalizeApiError(error)
  const toast = useToast()

  if (apiError.status === 401) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
    const currentPath =
      typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}`
        : '/'
    if (unauthorizedHandler) {
      unauthorizedHandler(currentPath)
    } else if (
      typeof window !== 'undefined' &&
      !window.location.pathname.startsWith('/login')
    ) {
      const encoded = encodeURIComponent(currentPath)
      window.history.replaceState(null, '', `/login?redirect=${encoded}`)
    }
  } else if (apiError.status === 403) {
    toast.error('You do not have permission to perform this action.')
  } else if (apiError.status === 409) {
    toast.error(apiError.detail || 'Action conflicts with current state.')
  }

  return Promise.reject(apiError)
}

export function setupInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use((config) =>
    attachAuthRequestInterceptor(config as ParcellaInternalRequestConfig),
  )
  client.interceptors.response.use((response) => response, handleApiResponseError)
}
