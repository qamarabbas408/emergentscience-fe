import { apiClient } from '../lib/apiClient'
import { apiEndpoints } from './apiEndpoints'

export interface FileRequirement {
  enabled: boolean
  max_size_mb: number | null
  extensions: string[]
}

export interface FileTypeRequirements {
  manuscript?: FileRequirement
  figures?: FileRequirement
  supplementary?: FileRequirement
  reviewer_materials?: FileRequirement
}

export interface ArticleTypeResource {
  slug: string
  name: string
  max_word_count: number | null
  max_summary_words: number | null
  max_figures_tables: number | null
  file_requirements?: FileTypeRequirements | null
}

export interface ArticleTypesResponse {
  success: boolean
  message: string
  data: ArticleTypeResource[]
}

export const articleTypesApi = {
  index: () => apiClient.get<ArticleTypesResponse>(apiEndpoints.articleTypes.index),
}