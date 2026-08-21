import { apiClient } from '../lib/apiClient'
import { apiEndpoints } from './apiEndpoints'

export interface ArticleAuthorResource {
  name: string
  email: string | null
  orcid: string | null
  affiliation: string | null
  is_corresponding: boolean
}

export interface ArticleJournalResource {
  id: number
  slug: string
  title: string
  abbreviation: string | null
}

export interface ArticleTypeRefResource {
  slug: string
  name: string
  max_word_count: number | null
  max_summary_words: number | null
  max_figures_tables: number | null
}

export interface ArticleTopicResource {
  id: number
  slug: string
  title: string
}

export interface ArticleResource {
  id: number
  slug: string
  title: string
  abstract: string
  keywords?: string[] | null
  doi: string
  status: string
  language: string
  volume: number | null
  issue: string | null
  page_start: string | null
  page_end: string | null
  publication_date: string
  date_submitted: string | null
  date_accepted: string | null
  view_count: number
  download_count: number
  citation_count: number
  journal?: ArticleJournalResource
  article_type?: ArticleTypeRefResource
  topics?: ArticleTopicResource[] | null
  authors?: ArticleAuthorResource[] | null
}

export interface ArticlesIndexMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface FacetJournal {
  id: number
  slug: string
  title: string
  count: number
}

export interface FacetArticleType {
  id: number
  slug: string
  name: string
  count: number
}

export interface ArticlesFacets {
  journals: FacetJournal[]
  article_types: FacetArticleType[]
}

export interface ArticlesIndexResponse {
  success: boolean
  message: string
  data: ArticleResource[]
  meta: ArticlesIndexMeta
  facets?: ArticlesFacets
}

export interface ArticlesIndexParams {
  journal?: string
  topic?: string
  type?: string
  published_from?: string
  published_to?: string
  search?: string
  sort?: string
  page?: number
  per_page?: number
}

export const articlesApi = {
  index: (params: ArticlesIndexParams = {}) =>
    apiClient.get<ArticlesIndexResponse>(apiEndpoints.articles.index, { params }),
}
