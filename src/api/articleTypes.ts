import { apiClient } from '../lib/apiClient'
import { apiEndpoints } from './apiEndpoints'

export interface ArticleTypeResource {
  slug: string
  name: string
  max_word_count: number | null
  max_summary_words: number | null
  max_figures_tables: number | null
}

export interface ArticleTypesResponse {
  success: boolean
  message: string
  data: ArticleTypeResource[]
}

export const articleTypesApi = {
  index: () => apiClient.get<ArticleTypesResponse>(apiEndpoints.articleTypes.index),
}