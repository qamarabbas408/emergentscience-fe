import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi, type LoginRequest, type RegisterRequest } from './auth'
import { getAuthToken, type UserResource } from '../lib/apiClient'

export const authKeys = {
  me: ['auth', 'me'] as const,
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: (res) => queryClient.setQueryData(authKeys.me, res.data),
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RegisterRequest) => authApi.register(payload),
    onSuccess: (res) => queryClient.setQueryData(authKeys.me, res.data),
  })
}

export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => authApi.me(),
    retry: false,
    enabled: Boolean(getAuthToken()),
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData<UserResource | null>(authKeys.me, null)
    },
  })
}