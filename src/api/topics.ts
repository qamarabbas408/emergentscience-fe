import { apiClient } from '../lib/apiClient'
import { apiEndpoints } from './apiEndpoints'

export interface TopicJournal {
  id: number
  slug: string
  title: string
  abbreviation: string
}

export interface TopicResource {
  id: number
  slug: string
  title: string
  description: string | null
  is_active: boolean
  sort_order: number | null
  journals: TopicJournal[]
}

export interface TopicsIndexResponse {
  success: boolean
  message: string
  data: TopicResource[]
  facets?: {
    journals: { id: number; slug: string; title: string; count: number }[]
    discipline_categories: { id: number; slug: string; name: string; count: number }[]
  }
}

export interface TopicsIndexParams {
  discipline?: string
  search?: string
}

export const topicsApi = {
  index: (params: TopicsIndexParams = {}) =>
    apiClient.get<TopicsIndexResponse>(apiEndpoints.topics.index, { params }),
}
