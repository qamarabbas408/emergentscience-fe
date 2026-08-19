import { apiClient } from '../lib/apiClient'
import { apiEndpoints } from './apiEndpoints'
import type { JournalResourceList } from './journals'

export interface DisciplineCategoryResource {
  id: number
  name: string
  slug: string
  description: string | null
  is_active: boolean
  sort_order: number | null
}

export interface DisciplineCategoriesResponse {
  success: boolean
  message: string
  data: DisciplineCategoryResource[]
}

export const disciplineCategoriesApi = {
  index: () =>
    apiClient.get<DisciplineCategoriesResponse>(apiEndpoints.disciplineCategories.index),
  journals: (id: number) =>
    apiClient.get<JournalResourceList>(apiEndpoints.disciplineCategories.journals(id)),
}