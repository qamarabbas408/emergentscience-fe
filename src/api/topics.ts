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

export interface TopicIndexMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface TopicsIndexResponse {
  success: boolean
  message: string
  data: TopicResource[]
  meta?: TopicIndexMeta
  facets?: {
    journals: { id: number; slug: string; title: string; count: number }[]
    discipline_categories: { id: number; slug: string; name: string; count: number }[]
  }
}

export interface TopicsIndexParams {
  discipline?: string
  search?: string
  page?: number
  per_page?: number
}

export const topicsApi = {
  index: (params: TopicsIndexParams = {}) =>
    apiClient.get<TopicsIndexResponse>(apiEndpoints.topics.index, { params }),
}
