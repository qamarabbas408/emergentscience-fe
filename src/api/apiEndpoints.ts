export const API_PREFIX = '/v1'

export const apiEndpoints = {
  health: `${API_PREFIX}/health`,
  auth: {
    login: `${API_PREFIX}/auth/login`,
    register: `${API_PREFIX}/auth/register`,
    logout: `${API_PREFIX}/auth/logout`,
    me: `${API_PREFIX}/auth/me`,
  },
  journals: {
    index: `${API_PREFIX}/journals`,
  },
  disciplineCategories: {
    index: `${API_PREFIX}/discipline-categories`,
    journals: (id: number) => `${API_PREFIX}/discipline-categories/${id}/journals`,
  },
} as const