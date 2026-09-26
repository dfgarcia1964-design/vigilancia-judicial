import axios, { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

let apiClient: AxiosInstance | null = null

export function getApiClient(): AxiosInstance {
  if (apiClient) return apiClient

  apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  apiClient.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )

  return apiClient
}

export const api = {
  get: (url: string, config?: any) => getApiClient().get(url, config),
  post: (url: string, data?: any, config?: any) => getApiClient().post(url, data, config),
  put: (url: string, data?: any, config?: any) => getApiClient().put(url, data, config),
  delete: (url: string, config?: any) => getApiClient().delete(url, config),
  patch: (url: string, data?: any, config?: any) => getApiClient().patch(url, data, config),
}
