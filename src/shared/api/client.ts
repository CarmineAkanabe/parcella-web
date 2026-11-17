import axios from 'axios'
import { setupInterceptors, type ParcellaAxiosInstance } from './interceptors'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, application/problem+json',
  },
  timeout: 15000,
})

setupInterceptors(instance)

export const apiClient = instance as unknown as ParcellaAxiosInstance
