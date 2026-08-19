export const API_PREFIX = '/v1'

export const apiEndpoints = {
  health: `${API_PREFIX}/health`,
  auth: {
    login: `${API_PREFIX}/auth/login`,
    register: `${API_PREFIX}/auth/register`,
    logout: `${API_PREFIX}/auth/logout`,
    me: `${API_PREFIX}/auth/me`,
  },
} as const