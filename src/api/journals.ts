import { apiClient } from '../lib/apiClient'
import { apiEndpoints } from './apiEndpoints'

export interface JournalResource {
  id: number
  slug: string
  title: string
  abbreviation: string | null
  tagline: string | null
  category: string | null
  is_new: boolean
  field_chief_editor: string | null
  sections_count: number
  articles_count: number
  views: number
  citations: number
  impact_factor: number | null
  citescore: number | null
}

export interface JournalIndexMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface JournalIndexResponse {
  success: boolean
  message: string
  data: JournalResource[]
  meta: JournalIndexMeta
}

export interface JournalResourceList {
  success: boolean
  message: string
  data: JournalResource[]
}

export interface JournalIndexParams {
  category?: string
  search?: string
  sort?: string
  page?: number
  per_page?: number
}

export const journalsApi = {
  index: (params: JournalIndexParams = {}) =>
    apiClient.get<JournalIndexResponse>(apiEndpoints.journals.index, { params }),
}

export async function fetchAllJournals(
  params: JournalIndexParams = {},
): Promise<JournalResource[]> {
  const collected: JournalResource[] = []
  let page = 1
  for (;;) {
    if (page > 20) break
    const res = await journalsApi.index({ ...params, page, per_page: 100 })
    collected.push(...res.data.data)
    const total = res.data.meta?.total ?? collected.length
    const lastPage = res.data.meta?.last_page ?? 1
    if (page >= lastPage || collected.length >= total) break
    page += 1
  }
  return collected
}