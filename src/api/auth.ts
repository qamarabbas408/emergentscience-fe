import { apiClient, setAuthToken, type UserResource } from '../lib/apiClient'
import { apiEndpoints } from './apiEndpoints'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  message: string
  data: UserResource
  token: string
}

export const authApi = {
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(apiEndpoints.auth.login, payload)
    setAuthToken(data.token)
    return data
  },
  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(apiEndpoints.auth.register, payload)
    setAuthToken(data.token)
    return data
  },
  me: async (): Promise<UserResource> => {
    const { data } = await apiClient.get<{ data: UserResource }>(apiEndpoints.auth.me)
    return data.data
  },
  logout: async (): Promise<void> => {
    await apiClient.post<{ message: string }>(apiEndpoints.auth.logout)
    setAuthToken(null)
  },
}