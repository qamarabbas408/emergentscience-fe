import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  Grid,
  List,
  Sparkles,
  Zap,
  X,
  RotateCcw,
  Bookmark,
} from 'lucide-react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { ArticleCardSkeleton } from '../components/skeletons'
import { ArticleCard } from '../components/ArticleCard'
import { ArticleDetailModal } from '../components/ArticleDetailModal'
import { QuickCiteModal } from '../components/QuickCiteModal'
import { ARTICLES_DATA, type Article } from '../data/articlesData'

const MONTH_INDEX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

function parseDateLabel(label: string): number {
  const [day, month, year] = label.split(' ')
  return new Date(Number(year), MONTH_INDEX[month] ?? 0, Number(day)).getTime()
}

function daysAgo(dateLabel: string): number {
  return Math.floor((Date.now() - parseDateLabel(dateLabel)) / 86_400_000)
}

function inDateRange(dateLabel: string, from: string, to: string): boolean {
  if (!from && !to) return true
  const time = parseDateLabel(dateLabel)
  const fromMs = from ? new Date(from).getTime() : -Infinity
  const toMs = to ? new Date(to).getTime() : Infinity
  return time >= fromMs && time <= toMs
}

const TRENDING_KEYWORDS = [
  'Perovskites',
  'Medical Foundation Models',
  'CRISPR-Cas9',
  'Solid-State Batteries',
  'Microbiome & Metabolism',
  'Quantum NLP',
  'Alzheimers',
]

type SortBy = 'recent' | 'citations' | 'views' | 'downloads'
type ViewMode = 'list' | 'grid'
type DateFilter = 'all' | '7d' | '30d' | '90d' | 'custom'

const JOURNAL_OPTIONS = [...new Set(ARTICLES_DATA.map((article) => article.journal))]
const TYPE_OPTIONS = [...new Set(ARTICLES_DATA.map((article) => article.type))]

const PAGE_SIZE = 5

function useArticles() {
  return useQuery({
    queryKey: ['articles-revamped'],
    queryFn: () =>
      new Promise<Article[]>((resolve) => {
        setTimeout(() => resolve(ARTICLES_DATA), 400)
      }),
  })
}

export function ArticlesPage() {
  const { data: articles, isPending } = useArticles()

  // Filter and view states
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('recent')
  const [view, setView] = useState<ViewMode>('list')
  const [openAccessOnly, setOpenAccessOnly] = useState(true)
  const [editorPickOnly, setEditorPickOnly] = useState(false)
  const [openDataOnly, setOpenDataOnly] = useState(false)
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [selectedJournals, setSelectedJournals] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [researchTopicOnly, setResearchTopicOnly] = useState(false)
  const [journalSearch, setJournalSearch] = useState('')
  const [showAllJournals, setShowAllJournals] = useState(false)
  const [page, setPage] = useState(1)

  // Bookmarks persistence (localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('es_bookmarked_articles')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [filterBookmarkedOnly, setFilterBookmarkedOnly] = useState(false)

  // Modals state
  const [activeArticleModal, setActiveArticleModal] = useState<Article | null>(null)
  const [citeArticleModal, setCiteArticleModal] = useState<Article | null>(null)

  const handleBookmarkToggle = (id: number) => {
    setBookmarkedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      try {
        localStorage.setItem('es_bookmarked_articles', JSON.stringify(updated))
      } catch (err) {
        console.error('Failed to save bookmark', err)
      }
      return updated
    })
  }

  // Filter and sort calculation
  const filtered = useMemo(() => {
    let list = (articles ?? []).filter((article) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.authors.join(' ').toLowerCase().includes(q) ||
        article.journal.toLowerCase().includes(q) ||
        article.doi.toLowerCase().includes(q) ||
        article.abstract.toLowerCase().includes(q) ||
        (article.keywords && article.keywords.some((kw) => kw.toLowerCase().includes(q)))

      const matchesJournal =
        selectedJournals.length === 0 || selectedJournals.includes(article.journal)
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(article.type)
      const matchesTopic = !researchTopicOnly || Boolean(article.topic)
      const matchesEditorPick = !editorPickOnly || Boolean(article.isEditorPick)
      const matchesOpenData = !openDataOnly || Boolean(article.isOpenData)
      const matchesBookmark = !filterBookmarkedOnly || bookmarkedIds.includes(article.id)

      const matchesKeywords =
        selectedKeywords.length === 0 ||
        (article.keywords && selectedKeywords.every((kw) => article.keywords?.includes(kw)))

      let matchesDate = true
      if (dateFilter === '7d') matchesDate = daysAgo(article.published) <= 7
      if (dateFilter === '30d') matchesDate = daysAgo(article.published) <= 30
      if (dateFilter === '90d') matchesDate = daysAgo(article.published) <= 90
      if (dateFilter === 'custom') {
        matchesDate = inDateRange(article.published, customFrom, customTo)
      }

      return (
        matchesQuery &&
        matchesJournal &&
        matchesType &&
        matchesTopic &&
        matchesEditorPick &&
        matchesOpenData &&
        matchesBookmark &&
        matchesKeywords &&
        matchesDate
      )
    })

    list = [...list].sort((a, b) => {
      if (sortBy === 'citations') return b.citations - a.citations
      if (sortBy === 'views') return b.views - a.views
      if (sortBy === 'downloads') return (b.downloads || 0) - (a.downloads || 0)
      return parseDateLabel(b.published) - parseDateLabel(a.published)
    })

    return list
  }, [
    articles,
    query,
    sortBy,
    selectedJournals,
    selectedTypes,
    selectedKeywords,
    researchTopicOnly,
    editorPickOnly,
    openDataOnly,
    filterBookmarkedOnly,
    bookmarkedIds,
    dateFilter,
    customFrom,
    customTo,
  ])

  const hasActiveFilters =
    Boolean(query.trim()) ||
    selectedJournals.length > 0 ||
    selectedTypes.length > 0 ||
    selectedKeywords.length > 0 ||
    researchTopicOnly ||
    editorPickOnly ||
    openDataOnly ||
    filterBookmarkedOnly ||
    dateFilter !== 'all' ||
    !openAccessOnly

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const clearAllFilters = () => {
    setQuery('')
    setSortBy('recent')
    setOpenAccessOnly(true)
    setEditorPickOnly(false)
    setOpenDataOnly(false)
    setFilterBookmarkedOnly(false)
    setDateFilter('all')
    setCustomFrom('')
    setCustomTo('')
    setSelectedJournals([])
    setSelectedTypes([])
    setSelectedKeywords([])
    setResearchTopicOnly(false)
    setPage(1)
  }

  const toggleInList = (list: string[], value: string, setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
    setPage(1)
  }

  const visibleJournals = JOURNAL_OPTIONS.filter((j) =>
    j.toLowerCase().includes(journalSearch.toLowerCase()),
  ).slice(0, showAllJournals ? JOURNAL_OPTIONS.length : 5)

  const journalCount = (name: string) => (articles ?? []).filter((a) => a.journal === name).length
  const typeCount = (name: string) => (articles ?? []).filter((a) => a.type === name).length

  // Quick stats summary
  const totalCitations = useMemo(
    () => (articles ?? []).reduce((acc, curr) => acc + curr.citations, 0),
    [articles],
  )
  const totalViews = useMemo(
    () => (articles ?? []).reduce((acc, curr) => acc + curr.views, 0),
    [articles],
  )

  return (
    <div className="min-h-screen bg-body font-sans text-ink">
      <Header />

      <main className="space-y-8 pb-16">
        {/* Hero Section with Academic Search Engine Header */}
        <section className="relative border-b border-border bg-white overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,59,222,0.06),transparent_75%)]" />
          
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-6 text-center">
              {/* Category Pill */}
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-tint px-3.5 py-1.5 text-xs font-bold text-primary shadow-2xs border border-primary/20">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Emergent Science Digital Library • 250,000+ Peer-Reviewed Papers</span>
              </div>

              {/* Headings */}
              <div className="space-y-3">
                <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl lg:text-5xl">
                  Explore Open-Access Articles
                </h1>
                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-secondary sm:text-base">
                  Search, cite, and download fully peer-reviewed, open-access research papers published with immediate worldwide access under CC BY 4.0.
                </p>
              </div>

              {/* Search Bar Input Container */}
              <div className="mx-auto max-w-3xl">
                <div className="flex flex-col items-stretch gap-2 rounded-3xl border-2 border-border bg-white p-2 shadow-card transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 sm:flex-row sm:items-center">
                  <div className="flex flex-1 items-center gap-3 px-3 py-1">
                    <Search className="h-5 w-5 shrink-0 text-ink-muted" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value)
                        setPage(1)
                      }}
                      placeholder="Search title, author, DOI, keyword, or structured abstract..."
                      className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-ink-muted"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="rounded-full bg-body px-2.5 py-1 text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 border-t border-border pt-2 sm:border-t-0 sm:border-l sm:pl-3">
                    <select
                      value={selectedJournals.length === 1 ? selectedJournals[0] : ''}
                      onChange={(e) => {
                        setSelectedJournals(e.target.value ? [e.target.value] : [])
                        setPage(1)
                      }}
                      className="max-w-[170px] truncate bg-transparent text-xs font-bold text-ink-secondary outline-none cursor-pointer py-1"
                      aria-label="Filter by journal"
                    >
                      <option value="">All Publications</option>
                      {JOURNAL_OPTIONS.map((journal) => (
                        <option key={journal} value={journal}>
                          {journal}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setPage(1)}
                      className="shrink-0 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-2xs transition-colors hover:bg-primary-hover"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Trending Keywords Quick Bar */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
                <span className="mr-1 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  Trending Research:
                </span>
                {TRENDING_KEYWORDS.map((keyword) => {
                  const isSelected = selectedKeywords.includes(keyword)
                  return (
                    <button
                      key={keyword}
                      type="button"
                      onClick={() => toggleInList(selectedKeywords, keyword, setSelectedKeywords)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-primary text-white shadow-2xs'
                          : 'border border-border bg-white text-ink-secondary hover:border-primary hover:text-primary'
                      }`}
                    >
                      {keyword}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="border-t border-border bg-body/40 py-3 px-4">
            <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-center sm:justify-between gap-4 text-xs font-medium text-ink-muted">
              <div className="flex items-center gap-6">
                <span>📚 <strong>10</strong> Featured Studies</span>
                <span>📈 <strong>{totalCitations}</strong> Total Citations</span>
                <span>👁️ <strong>{totalViews.toLocaleString()}</strong> Article Impressions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span>Indexed in Crossref, DOAJ, Scopus &amp; PubMed</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Layout */}
        <section className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
          {/* Controls and Active Filters Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-ink">
                Showing{' '}
                {isPending
                  ? '…'
                  : `${filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1} – ${Math.min(safePage * PAGE_SIZE, filtered.length)}`}{' '}
                of <span className="text-primary font-black">{isPending ? '…' : filtered.length}</span> Publications
              </span>

              <span className="mx-1 h-4 w-px bg-border" />

              {/* Active Filter Chips */}
              {openAccessOnly && (
                <FilterChip
                  label="Open Access"
                  onRemove={() => setOpenAccessOnly(false)}
                />
              )}
              {editorPickOnly && (
                <FilterChip
                  label="Editor's Choice"
                  onRemove={() => setEditorPickOnly(false)}
                />
              )}
              {openDataOnly && (
                <FilterChip
                  label="Open Data Repository"
                  onRemove={() => setOpenDataOnly(false)}
                />
              )}
              {filterBookmarkedOnly && (
                <FilterChip
                  label={`Saved (${bookmarkedIds.length})`}
                  onRemove={() => setFilterBookmarkedOnly(false)}
                />
              )}
              {selectedJournals.map((j) => (
                <FilterChip
                  key={j}
                  label={`Journal: ${j}`}
                  onRemove={() => toggleInList(selectedJournals, j, setSelectedJournals)}
                />
              ))}
              {selectedKeywords.map((k) => (
                <FilterChip
                  key={k}
                  label={`Keyword: ${k}`}
                  onRemove={() => toggleInList(selectedKeywords, k, setSelectedKeywords)}
                />
              ))}
              {selectedTypes.map((t) => (
                <FilterChip
                  key={t}
                  label={`Type: ${t}`}
                  onRemove={() => toggleInList(selectedTypes, t, setSelectedTypes)}
                />
              ))}
            </div>

            {/* View Mode & Sort Controls */}
            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 font-medium text-ink-muted">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="cursor-pointer rounded-xl border border-border bg-body px-3 py-1.5 text-xs font-bold text-ink outline-none"
                >
                  <option value="recent">Most Recent Date</option>
                  <option value="citations">Most Cited First</option>
                  <option value="views">Most Viewed First</option>
                  <option value="downloads">Highest Downloads</option>
                </select>
              </label>

              <div className="flex items-center gap-1 border-l border-border pl-3">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  title="List view"
                  aria-label="List view"
                  aria-pressed={view === 'list'}
                  className={`rounded-xl p-2 transition-colors ${
                    view === 'list' ? 'bg-primary text-white shadow-2xs' : 'text-ink-muted hover:bg-body hover:text-ink'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView('grid')}
                  title="Grid view"
                  aria-label="Grid view"
                  aria-pressed={view === 'grid'}
                  className={`rounded-xl p-2 transition-colors ${
                    view === 'grid' ? 'bg-primary text-white shadow-2xs' : 'text-ink-muted hover:bg-body hover:text-ink'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Sidebar Filters Panel */}
            <aside className="space-y-4 lg:col-span-3">
              {/* Quick Saved Bookmarks Shortcut */}
              <div className="rounded-2xl border border-border bg-white p-4 shadow-xs">
                <button
                  type="button"
                  onClick={() => setFilterBookmarkedOnly((prev) => !prev)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                    filterBookmarkedOnly
                      ? 'bg-primary-tint text-primary border border-primary/30'
                      : 'bg-body text-ink-secondary hover:bg-body/80 hover:text-ink'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4" fill={filterBookmarkedOnly ? 'currentColor' : 'none'} />
                    <span>My Saved Articles</span>
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] shadow-2xs border border-border">
                    {bookmarkedIds.length}
                  </span>
                </button>
              </div>

              {/* Special Flags Filter */}
              <FilterSection title="Curated Filters">
                <div className="space-y-2">
                  <CheckOption
                    label="Editor's Choice Articles"
                    checked={editorPickOnly}
                    onChange={() => setEditorPickOnly((v) => !v)}
                  />
                  <CheckOption
                    label="With Open Data Repositories"
                    checked={openDataOnly}
                    onChange={() => setOpenDataOnly((v) => !v)}
                  />
                  <CheckOption
                    label="Part of a Research Topic only"
                    checked={researchTopicOnly}
                    onChange={() => setResearchTopicOnly((v) => !v)}
                  />
                </div>
              </FilterSection>

              {/* Publication Date */}
              <FilterSection title="Publication Date">
                <div className="space-y-1.5">
                  <RadioOption checked={dateFilter === 'all'} label="All Time" onClick={() => setDateFilter('all')} />
                  <RadioOption checked={dateFilter === '7d'} label="Last 7 Days" onClick={() => setDateFilter('7d')} />
                  <RadioOption checked={dateFilter === '30d'} label="Last 30 Days" onClick={() => setDateFilter('30d')} />
                  <RadioOption checked={dateFilter === '90d'} label="Last 90 Days" onClick={() => setDateFilter('90d')} />
                  <RadioOption checked={dateFilter === 'custom'} label="Custom Date Range" onClick={() => setDateFilter('custom')} />
                </div>

                {dateFilter === 'custom' && (
                  <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-border">
                    <input
                      type="date"
                      value={customFrom}
                      onChange={(e) => {
                        setCustomFrom(e.target.value)
                        setPage(1)
                      }}
                      className="min-w-0 flex-1 rounded-lg border border-border bg-body px-2 py-1 text-[11px] outline-none focus:border-primary"
                    />
                    <span className="text-[11px] text-ink-muted">to</span>
                    <input
                      type="date"
                      value={customTo}
                      onChange={(e) => {
                        setCustomTo(e.target.value)
                        setPage(1)
                      }}
                      className="min-w-0 flex-1 rounded-lg border border-border bg-body px-2 py-1 text-[11px] outline-none focus:border-primary"
                    />
                  </div>
                )}
              </FilterSection>

              {/* Field & Journal Filter */}
              <FilterSection title="Journals & Publications">
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-ink-muted" />
                  <input
                    type="text"
                    value={journalSearch}
                    onChange={(e) => setJournalSearch(e.target.value)}
                    placeholder="Filter journals…"
                    className="w-full rounded-xl border border-border bg-body py-1.5 pl-8 pr-2 text-[11px] outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  {visibleJournals.map((journal) => (
                    <CheckOption
                      key={journal}
                      label={`${journal} (${journalCount(journal)})`}
                      checked={selectedJournals.includes(journal)}
                      onChange={() => toggleInList(selectedJournals, journal, setSelectedJournals)}
                    />
                  ))}
                </div>

                {JOURNAL_OPTIONS.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setShowAllJournals((s) => !s)}
                    className="mt-2 text-[11px] font-bold text-primary hover:underline"
                  >
                    {showAllJournals ? '− Show fewer journals' : `+ Show ${JOURNAL_OPTIONS.length - 5} more journals`}
                  </button>
                )}
              </FilterSection>

              {/* Article Types */}
              <FilterSection title="Article Type">
                <div className="space-y-1.5">
                  {TYPE_OPTIONS.map((type) => (
                    <CheckOption
                      key={type}
                      label={`${type} (${typeCount(type)})`}
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleInList(selectedTypes, type, setSelectedTypes)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Reset All Filters Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-red-200 bg-red-50 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset All Applied Filters</span>
                </button>
              )}
            </aside>

            {/* Articles List / Grid Area */}
            <div className="space-y-5 lg:col-span-9">
              {isPending ? (
                <div className="space-y-4" role="status" aria-live="polite" aria-label="Loading articles">
                  {Array.from({ length: 4 }, (_, i) => (
                    <ArticleCardSkeleton key={i} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-3xl border border-border bg-white p-12 text-center shadow-xs">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-tint text-primary border border-primary/20">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-ink">No scientific articles match your criteria</h3>
                  <p className="mx-auto mt-1 max-w-md text-xs sm:text-sm leading-relaxed text-ink-secondary">
                    Try broadening your search keywords, clearing selected journal filters, or resetting date parameters.
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-2xs transition-colors hover:bg-primary-hover"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset All Filters &amp; View All Papers</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className={view === 'grid' ? 'grid gap-5 md:grid-cols-2' : 'space-y-4'}>
                    {pageItems.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        grid={view === 'grid'}
                        isBookmarked={bookmarkedIds.includes(article.id)}
                        onBookmarkToggle={handleBookmarkToggle}
                        onOpenDetails={(art) => setActiveArticleModal(art)}
                        onQuickCite={(art) => setCiteArticleModal(art)}
                      />
                    ))}
                  </div>

                  {/* Pagination Component */}
                  <Pagination
                    page={safePage}
                    totalPages={totalPages}
                    onPage={(p) => {
                      setPage(p)
                      window.scrollTo({ top: 400, behavior: 'smooth' })
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Article Detail Interactive Modal */}
      <ArticleDetailModal
        article={activeArticleModal}
        isOpen={Boolean(activeArticleModal)}
        onClose={() => setActiveArticleModal(null)}
        onBookmarkToggle={handleBookmarkToggle}
        isBookmarked={activeArticleModal ? bookmarkedIds.includes(activeArticleModal.id) : false}
      />

      {/* Quick Cite Export Modal */}
      <QuickCiteModal
        article={citeArticleModal}
        isOpen={Boolean(citeArticleModal)}
        onClose={() => setCiteArticleModal(null)}
      />

      <Footer />
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-xs">
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-ink mb-2.5">{title}</h3>
      <div>{children}</div>
    </div>
  )
}

function CheckOption({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-xs text-ink-secondary hover:text-ink transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 accent-primary"
      />
      <span className="leading-tight">{label}</span>
    </label>
  )
}

function RadioOption({
  label,
  checked,
  onClick,
}: {
  label: string
  checked: boolean
  onClick: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-secondary hover:text-ink transition-colors">
      <input type="radio" checked={checked} onChange={onClick} className="h-3.5 w-3.5 accent-primary" />
      <span>{label}</span>
    </label>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-tint px-2.5 py-1 text-[11px] font-bold text-primary border border-primary/20">
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="text-primary/60 hover:text-primary transition-colors"
        aria-label={`Remove filter ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number
  totalPages: number
  onPage: (p: number) => void
}) {
  const pages: (number | '…')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i)
    else if (pages[pages.length - 1] !== '…') pages.push('…')
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4 text-xs">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
        className="rounded-xl border border-border bg-white px-3.5 py-2 font-bold text-ink-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-1 text-ink-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPage(p)}
            className={`h-8 w-8 rounded-xl font-bold transition-all ${
              p === page
                ? 'bg-primary text-white shadow-2xs'
                : 'border border-border bg-white text-ink-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
        className="rounded-xl border border-border bg-white px-3.5 py-2 font-bold text-ink-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  )
}
