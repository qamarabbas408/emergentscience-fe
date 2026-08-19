import axios from 'axios'

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://127.0.0.1:8000/api'

const TOKEN_KEY = 'es_token'

export interface UserResource {
  id: number
  name: string
  email: string
  status: 'active' | 'suspended'
  created_at: string | null
}

export const apiClient = axios.create({ baseURL: API_BASE_URL })

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY)

export const setAuthToken = (token: string | null) => {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}