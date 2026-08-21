import { useEffect, useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { EmptyState } from '../components/EmptyState'
import { Skeleton } from '../components/skeletons'
import { appRoutes } from '../appRoutes'
import {
  TOPIC_REPRINTS,
  type ResearchTopic,
  type TopicReprintBook,
} from '../data/topicsData'
import { topicsApi, type TopicResource } from '../api/topics'
import { ProposeTopicModal } from '../components/topics/ProposeTopicModal'
import { TopicDetailModal } from '../components/topics/TopicDetailModal'
import { TopicAwardModal } from '../components/topics/TopicAwardModal'
import { TopicReprintModal } from '../components/topics/TopicReprintModal'

type SortOption = 'default' | 'title'
type StatusFilter = 'all' | 'open' | 'closed'

/** Map the thin /v1/topics payload onto the rich display model; missing facets degrade gracefully */
function toDisplayTopic(t: TopicResource): ResearchTopic {
  return {
    id: String(t.id),
    slug: t.slug,
    title: t.title,
    abstract: t.description ?? '',
    discipline: t.journals[0]?.title ?? 'General',
    isSubmissionOpen: t.is_active,
    isAwardNominee: false,
    submissionDeadline: '',
    deadlineDate: '',
    editors: [],
    keywords: [],
    participatingJournals: t.journals.map((j) => j.title),
    articlesCount: 0,
    viewsCount: 0,
    citationsCount: 0,
    bannerGradient: 'from-slate-900 via-primary-deep to-slate-950',
  }
}

export function TopicsPage() {
  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedDisciplineSlug, setSelectedDisciplineSlug] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [viewMode, setViewMode] = useState<'cards' | 'compact'>('cards')
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)

  // Modals state
  const [selectedTopic, setSelectedTopic] = useState<ResearchTopic | null>(null)
  const [proposeModalOpen, setProposeModalOpen] = useState(false)
  const [awardModalOpen, setAwardModalOpen] = useState(false)
  const [selectedReprint, setSelectedReprint] = useState<TopicReprintBook | null>(null)
  const [bookmarkedTopicIds, setBookmarkedTopicIds] = useState<Set<string>>(new Set())
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  // Live topics: server-side discipline + search; client-side status/sort/pagination
  const { data: topicsRes, isPending: topicsPending } = useQuery({
    queryKey: ['topics', selectedDisciplineSlug, debouncedQuery],
    queryFn: async () => {
      const res = await topicsApi.index({
        discipline: selectedDisciplineSlug ?? undefined,
        search: debouncedQuery.trim() || undefined,
      })
      return res.data
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })

  const allTopics = useMemo(
    () =>
      (topicsRes?.data ?? []).map((t) => ({
        ...toDisplayTopic(t),
        discipline: t.journals[0]?.title ?? 'General',
      })),
    [topicsRes],
  )

  // Canonical discipline list + counts from response facets (server excludes own-group filter)
  const facets = topicsRes?.facets
  const DISCIPLINE_OPTIONS = useMemo(
    () => [
      { name: 'All Disciplines', slug: null as string | null, count: null as number | null },
      ...(facets?.discipline_categories ?? []).map((d) => ({
        name: d.name,
        slug: d.slug as string | null,
        count: d.count as number | null,
      })),
    ],
    [facets],
  )

  // Filter & sort logic
  const filteredTopics = useMemo(() => {
    const list = allTopics.filter((topic) => {
      // Status
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'open' && topic.isSubmissionOpen) ||
        (statusFilter === 'closed' && !topic.isSubmissionOpen)

      return matchesStatus
    })

    // Sort
    return list.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      }
      return 0
    })
  }, [allTopics, statusFilter, sortBy])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredTopics.length / itemsPerPage))
  const paginatedTopics = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredTopics.slice(start, start + itemsPerPage)
  }, [filteredTopics, currentPage, itemsPerPage])

  const toggleBookmark = (topicId: string) => {
    setBookmarkedTopicIds((prev) => {
      const next = new Set(prev)
      if (next.has(topicId)) {
        next.delete(topicId)
        showToast('Topic removed from your saved list')
      } else {
        next.add(topicId)
        showToast('Topic saved to your bookmarks')
      }
      return next
    })
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const resetAllFilters = () => {
    setSearchQuery('')
    setSelectedDisciplineSlug(null)
    setStatusFilter('all')
    setSortBy('default')
    setCurrentPage(1)
  }

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedDisciplineSlug !== null ||
    statusFilter !== 'all'

  return (
    <div className="min-h-screen bg-body text-ink font-sans">
      <Header />

      <main className="pb-16 space-y-6">
        {/* =========================================================================
            1. HERO CAROUSEL / TOPICS AWARD BANNER
           ========================================================================= */}
        <section className="bg-gradient-to-r from-slate-900 via-primary-deep to-slate-950 text-white border-b border-border relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-12 items-center">
              {/* Left text highlight */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 px-3 py-0.5 text-xs font-bold text-amber-300">
                    <TrophyIcon />
                    2026 Emergent Science Topics Award
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
                    $10,000 Research Grant Prize
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Interdisciplinary Research Topics &amp; Special Collections
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Collaborative, cross-journal collections created and led by world-renowned guest editors.
                  Publishing high-impact open-access research with unified citation metrics and book reprints.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => setAwardModalOpen(true)}
                    className="rounded-full bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 shadow-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <TrophyIcon />
                    <span>Explore 2026 Topics Award</span>
                  </button>
                  <button
                    onClick={() => setProposeModalOpen(true)}
                    className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-xs font-bold text-white hover:bg-white/20 transition-colors flex items-center gap-1.5"
                  >
                    <LightbulbIcon />
                    <span>Propose a New Topic</span>
                  </button>
                </div>
              </div>

              {/* Right Mini Bento Card - Topic Highlight */}
              <div className="lg:col-span-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                      Featured Collection
                    </span>
                    {allTopics[0]?.isSubmissionOpen && (
                      <span className="rounded bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                        Open for Submissions
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => allTopics[0] && setSelectedTopic(allTopics[0])}
                    className="text-sm font-bold text-white hover:text-primary-tint cursor-pointer transition-colors line-clamp-2"
                  >
                    {allTopics[0]?.title ?? '—'}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {allTopics[0]?.abstract || 'Explore the full research topics directory.'}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-2.5">
                    <span>{allTopics.length} Topics in Directory</span>
                    <button
                      onClick={() => allTopics[0] && setSelectedTopic(allTopics[0])}
                      className="font-bold text-amber-300 hover:text-white"
                    >
                      View Topic →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. GLOBAL SEARCH & ADVANCED FILTER BAR
           ========================================================================= */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-white p-4 shadow-xs space-y-3">
            <div className="grid gap-3 lg:grid-cols-12 items-center">
              {/* Search input (9 cols) */}
              <div className="lg:col-span-9 relative">
                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-slate-50 px-3.5 py-2.5 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <SearchIcon />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    placeholder="Search by title, keyword, guest editor, or participating journal..."
                    className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-ink-muted"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-ink-muted hover:text-ink text-xs font-bold px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Status Segmented Control (3 cols) */}
              <div className="lg:col-span-3 flex items-center bg-slate-100 rounded-xl p-1 border border-border">
                <button
                  onClick={() => {
                    setStatusFilter('all')
                    setCurrentPage(1)
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    statusFilter === 'all'
                      ? 'bg-white text-ink shadow-2xs'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => {
                    setStatusFilter('open')
                    setCurrentPage(1)
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    statusFilter === 'open'
                      ? 'bg-white text-emerald-700 shadow-2xs'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    setStatusFilter('closed')
                    setCurrentPage(1)
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    statusFilter === 'closed'
                      ? 'bg-white text-slate-700 shadow-2xs'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Closed
                </button>
              </div>

              {/* Reset Action (1 col) */}
              <div className="lg:col-span-1 flex justify-end">
                {hasActiveFilters ? (
                  <button
                    onClick={resetAllFilters}
                    className="text-xs font-bold text-red-600 hover:text-red-700 underline whitespace-nowrap"
                  >
                    Reset
                  </button>
                ) : (
                  <span className="text-[11px] text-ink-muted">Filters active</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. MAIN CONTENT LAYOUT: SIDEBAR (3 COLS) + TOPICS STREAM (9 COLS)
           ========================================================================= */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            
            {/* =====================================================================
                LEFT SIDEBAR (3 COLS)
               ===================================================================== */}
            <aside className="lg:col-span-3 space-y-6">
              
              {/* PRIMARY CTA: Propose a Research Topic */}
              <div className="rounded-2xl border border-border bg-gradient-to-br from-primary-tint/60 via-white to-primary-tint/20 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <LightbulbIcon />
                  <span>Lead a Collection</span>
                </div>
                <h3 className="text-sm font-bold text-ink leading-snug">
                  Propose an Interdisciplinary Research Topic
                </h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Join over 12,000 international guest editors. Shape your field and curate high-impact papers.
                </p>
                <button
                  onClick={() => setProposeModalOpen(true)}
                  className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                >
                  <PlusIcon />
                  <span>Propose a Topic</span>
                </button>
              </div>

              {/* Quick Sub-Navigation Menu */}
              <div className="rounded-2xl border border-border bg-white p-4 shadow-xs space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink px-2">
                  Topic Resources
                </h4>
                <nav className="space-y-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setAwardModalOpen(true)}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-ink-secondary hover:bg-slate-50 hover:text-primary transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <TrophyIcon />
                      2026 Topics Award
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                      $10k
                    </span>
                  </button>

                  <a
                    href="#categories"
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-ink-secondary hover:bg-slate-50 hover:text-primary transition-colors"
                  >
                    <span>Browse Disciplines</span>
                    <span className="text-ink-muted">→</span>
                  </a>

                  <a
                    href={appRoutes.submit}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-ink-secondary hover:bg-slate-50 hover:text-primary transition-colors"
                  >
                    <span>Author Submission Guidelines</span>
                    <span className="text-ink-muted">→</span>
                  </a>

                  <a
                    href={appRoutes.fees}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-ink-secondary hover:bg-slate-50 hover:text-primary transition-colors"
                  >
                    <span>Institutional APC Coverage</span>
                    <span className="text-ink-muted">→</span>
                  </a>
                </nav>
              </div>

              {/* Disciplines Selection List */}
              <div id="categories" className="rounded-2xl border border-border bg-white p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-2 px-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                    Disciplines ({DISCIPLINE_OPTIONS.length - 1})
                  </h4>
                  {selectedDisciplineSlug !== null && (
                    <button
                      onClick={() => {
                        setSelectedDisciplineSlug(null)
                        setCurrentPage(1)
                      }}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  {DISCIPLINE_OPTIONS.map(({ name, slug, count }) => {
                    const isSelected = selectedDisciplineSlug === slug
                    const isDisabled = count === 0 && !isSelected

                    return (
                      <button
                        key={slug ?? 'all'}
                        disabled={isDisabled}
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedDisciplineSlug(slug)
                            setCurrentPage(1)
                          }
                        }}
                        className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-all ${
                          isSelected
                            ? 'bg-primary text-white font-bold shadow-xs'
                            : isDisabled
                              ? 'cursor-not-allowed opacity-50 text-ink-muted'
                              : 'text-ink-secondary hover:bg-slate-50 hover:text-primary font-medium'
                        }`}
                      >
                        <span className="truncate pr-2">{name}</span>
                        {count !== null && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : isDisabled
                                  ? 'bg-slate-100 text-ink-muted'
                                  : 'bg-slate-100 text-ink-muted'
                          }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Emergent Science Books & Open Access Reprints */}
              <div className="rounded-2xl border border-border bg-white p-4 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2 px-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                    <BookIcon />
                    <span>Topic Books &amp; Reprints</span>
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Open Access
                  </span>
                </div>

                <p className="text-[11px] text-ink-muted leading-relaxed">
                  Completed Topics are compiled into downloadable open-access hardbound monographs.
                </p>

                <div className="space-y-3">
                  {TOPIC_REPRINTS.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => setSelectedReprint(book)}
                      className="group flex items-start gap-3 p-2 rounded-xl border border-border/80 hover:border-primary hover:bg-slate-50/50 cursor-pointer transition-all"
                    >
                      {/* Mini Book Spine Thumbnail */}
                      <div
                        className={`w-12 h-16 shrink-0 rounded p-1 text-[7px] font-bold flex flex-col justify-between ${book.coverColor} shadow-xs`}
                      >
                        <span className="opacity-70 line-clamp-1">ES BOOK</span>
                        <span className="opacity-90 line-clamp-2 leading-tight">
                          {book.title.slice(0, 24)}...
                        </span>
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h5 className="text-xs font-bold text-ink group-hover:text-primary line-clamp-2 transition-colors">
                          {book.title}
                        </h5>
                        <p className="text-[10px] text-ink-muted truncate">{book.editors}</p>
                        <span className="text-[10px] text-primary font-semibold block pt-0.5">
                          Free PDF ({book.downloads.toLocaleString()} dl)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </aside>

            {/* =====================================================================
                RIGHT TOPICS STREAM (9 COLS)
               ===================================================================== */}
            <div className="lg:col-span-9 space-y-4">
              
              {/* STREAM HEADER & SORTING TOOLBAR */}
              <div className="rounded-2xl border border-border bg-white p-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Left Title & Count */}
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-bold text-ink">
                      Research Topics Directory
                    </h2>
                    <span className="rounded-full bg-primary-tint px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
                      {filteredTopics.length} {filteredTopics.length === 1 ? 'Topic' : 'Topics'}
                    </span>
                    {selectedDisciplineSlug !== null && (
                      <span className="hidden sm:inline text-xs text-ink-muted">
                        in{' '}
                        <strong className="text-ink">
                          {DISCIPLINE_OPTIONS.find((d) => d.slug === selectedDisciplineSlug)?.name}
                        </strong>
                      </span>
                    )}
                  </div>

                  {/* Right Sort & View Controls */}
                  <div className="flex items-center gap-3 text-xs">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-ink-muted font-medium">Sort:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="bg-body border border-border rounded-lg px-2.5 py-1 text-xs font-semibold text-ink outline-none cursor-pointer"
                      >
                        <option value="default">Default Order</option>
                        <option value="title">Alphabetical (A–Z)</option>
                      </select>
                    </div>

                    {/* Results per page selector */}
                    <div className="hidden sm:flex items-center gap-1.5 border-l border-border pl-3">
                      <span className="text-ink-muted font-medium">Show:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value))
                          setCurrentPage(1)
                        }}
                        className="bg-body border border-border rounded-lg px-2 py-1 text-xs font-semibold text-ink outline-none cursor-pointer"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                      </select>
                    </div>

                    {/* View Density Switcher */}
                    <div className="flex items-center border-l border-border pl-3 gap-1">
                      <button
                        onClick={() => setViewMode('cards')}
                        className={`p-1.5 rounded-md ${
                          viewMode === 'cards'
                            ? 'bg-primary-tint text-primary'
                            : 'text-ink-muted hover:text-ink'
                        }`}
                        title="Detailed Card View"
                        aria-label="Detailed card view"
                      >
                        <GridIcon />
                      </button>
                      <button
                        onClick={() => setViewMode('compact')}
                        className={`p-1.5 rounded-md ${
                          viewMode === 'compact'
                            ? 'bg-primary-tint text-primary'
                            : 'text-ink-muted hover:text-ink'
                        }`}
                        title="Compact Row View"
                        aria-label="Compact row view"
                      >
                        <ListIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* LIST OF TOPIC CARDS */}
              {topicsPending ? (
                <div className="space-y-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-3">
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-28 rounded-full" />
                      </div>
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : paginatedTopics.length === 0 ? (
                <EmptyState
                  icon={<SearchIcon />}
                  title="No research topics found"
                  description="We could not find any research topics matching your current search parameters, journal filter, or discipline."
                  action={
                    <button
                      onClick={resetAllFilters}
                      className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary-hover transition-colors"
                    >
                      Reset All Filters
                    </button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {paginatedTopics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      isCompact={viewMode === 'compact'}
                      isBookmarked={bookmarkedTopicIds.has(topic.id)}
                      onBookmark={() => toggleBookmark(topic.id)}
                      onOpenDetail={() => setSelectedTopic(topic)}
                    />
                  ))}
                </div>
              )}

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between rounded-2xl border border-border bg-white px-5 py-3 shadow-xs text-xs">
                  <span className="text-ink-muted">
                    Page <strong className="text-ink">{currentPage}</strong> of{' '}
                    <strong className="text-ink">{totalPages}</strong> ({filteredTopics.length} total topics)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="rounded-lg border border-border px-3 py-1.5 font-bold text-ink-secondary hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    >
                      ← Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => setCurrentPage(num)}
                        className={`h-8 w-8 rounded-lg font-bold transition-all ${
                          currentPage === num
                            ? 'bg-primary text-white shadow-xs'
                            : 'border border-border text-ink-secondary hover:bg-slate-50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="rounded-lg border border-border px-3 py-1.5 font-bold text-ink-secondary hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />

      {/* =========================================================================
          MODALS & TOAST NOTIFICATIONS
         ========================================================================= */}
      {selectedTopic && (
        <TopicDetailModal
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
          isBookmarked={bookmarkedTopicIds.has(selectedTopic.id)}
          onBookmarkToggle={toggleBookmark}
        />
      )}

      {proposeModalOpen && (
        <ProposeTopicModal
          onClose={() => setProposeModalOpen(false)}
          onSuccess={(proposalTitle) => {
            showToast(`Topic proposal "${proposalTitle}" submitted successfully! Our editorial office will contact you within 48h.`)
          }}
        />
      )}

      {awardModalOpen && (
        <TopicAwardModal
          onClose={() => setAwardModalOpen(false)}
          onNominateClick={() => setProposeModalOpen(true)}
        />
      )}

      {selectedReprint && (
        <TopicReprintModal
          book={selectedReprint}
          onClose={() => setSelectedReprint(null)}
        />
      )}

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white shadow-2xl transition-all">
          {toastMessage}
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   TOPIC CARD COMPONENT (Supports Standard & Compact View Modes)
   ========================================================================= */

function TopicCard({
  topic,
  isCompact,
  isBookmarked,
  onBookmark,
  onOpenDetail,
}: {
  topic: ResearchTopic
  isCompact: boolean
  isBookmarked: boolean
  onBookmark: () => void
  onOpenDetail: () => void
}) {
  if (isCompact) {
    return (
      <article className="group rounded-xl border border-border bg-white p-4 transition-all hover:border-primary/40 hover:shadow-xs space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              {topic.isSubmissionOpen ? (
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ● Open
                </span>
              ) : (
                <span className="text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                  Closed
                </span>
              )}
              {topic.submissionDeadline && (
                <span className="text-ink-muted">Deadline: {topic.submissionDeadline}</span>
              )}
            </div>

            <h3
              onClick={onOpenDetail}
              className="text-sm font-bold text-ink group-hover:text-primary transition-colors cursor-pointer"
            >
              {topic.title}
            </h3>

            {topic.editors[0] && (
              <p className="text-xs text-ink-muted truncate">
                Lead: {topic.editors[0]?.name} ({topic.editors[0]?.affiliation})
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`${appRoutes.submit}?topic=${topic.slug}`}
              className="rounded-full bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-2xs"
            >
              Submit
            </a>
            <button
              onClick={onBookmark}
              className={`p-1.5 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'border-primary bg-primary-tint text-primary'
                  : 'border-border text-ink-muted hover:text-ink'
              }`}
            >
              <BookmarkIcon filled={isBookmarked} />
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-card space-y-4">
      {/* Top Meta Line: Discipline, Award badge, Status, Bookmark */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {topic.isSubmissionOpen ? (
            <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs font-bold border border-emerald-200 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Submissions Open
            </span>
          ) : (
            <span className="rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-xs font-bold border border-slate-200">
              Submissions Closed
            </span>
          )}

          {topic.isAwardNominee && (
            <span className="rounded-full bg-amber-50 text-amber-800 px-2.5 py-0.5 text-xs font-bold border border-amber-200 flex items-center gap-1">
              ★ Award Nominee
            </span>
          )}
        </div>

          <div className="flex items-center gap-3">
            {topic.submissionDeadline && (
              <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
                <CalendarIcon />
                <span>
                  Deadline: <strong className="text-ink">{topic.submissionDeadline}</strong>
                </span>
              </div>
            )}

          <button
            onClick={onBookmark}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBookmarked
                ? 'border-primary bg-primary-tint text-primary'
                : 'border-border text-ink-muted hover:text-ink'
            }`}
            title={isBookmarked ? 'Saved topic' : 'Bookmark topic'}
          >
            <BookmarkIcon filled={isBookmarked} />
          </button>
        </div>
      </div>

      {/* Topic Title & Abstract snippet */}
      <div className="space-y-2">
        <h3
          onClick={onOpenDetail}
          className="text-base sm:text-lg font-bold text-ink leading-snug group-hover:text-primary transition-colors cursor-pointer"
        >
          {topic.title}
        </h3>

        <p className="line-clamp-2 text-xs sm:text-sm text-ink-secondary leading-relaxed font-normal">
          {topic.abstract}
        </p>
      </div>

      {/* Guest Editors Section with clean avatar icons */}
      {topic.editors.length > 0 && (
        <div className="rounded-xl border border-border bg-slate-50/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            <span>Topic Guest Editors</span>
            <span>{topic.editors.length} Editors</span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {topic.editors.map((editor) => (
              <div key={editor.name} className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                    editor.avatarColor || 'bg-primary text-white'
                  }`}
                >
                  {editor.name
                    .split(' ')
                    .filter((w) => !w.startsWith('Dr') && !w.startsWith('Prof'))
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')}
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-ink truncate leading-tight">
                    {editor.name}
                  </span>
                  <span className="block text-[10px] text-ink-muted truncate">
                    {editor.affiliation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Participating Journals Tags */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block">
          Participating Journals:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {topic.participatingJournals.map((j) => (
            <span
              key={j}
              className="rounded-md border border-border bg-white px-2 py-0.5 text-[11px] font-semibold text-ink-secondary hover:border-primary hover:text-primary transition-colors"
            >
              {j}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Action Strip: Metrics & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3.5">
        {/* Metrics */}
        {(topic.articlesCount > 0 || topic.viewsCount > 0 || topic.citationsCount > 0) && (
          <div className="flex items-center gap-4 text-xs text-ink-secondary">
            <div className="flex items-center gap-1">
              <span className="font-bold text-ink">{topic.articlesCount}</span>
              <span className="text-ink-muted">Articles</span>
            </div>
            <span className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1">
              <span className="font-bold text-ink">{topic.viewsCount.toLocaleString()}</span>
              <span className="text-ink-muted">Views</span>
            </div>
            <span className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1">
              <span className="font-bold text-ink">{topic.citationsCount.toLocaleString()}</span>
              <span className="text-ink-muted">Citations</span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDetail}
            className="rounded-full border border-border bg-body px-4 py-1.5 text-xs font-bold text-ink hover:border-primary hover:text-primary transition-colors"
          >
            Explore Collection
          </button>
          <a
            href={`${appRoutes.submit}?topic=${topic.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors"
          >
            <FileIcon />
            <span>Submit Manuscript</span>
          </a>
        </div>
      </div>
    </article>
  )
}

/* =========================================================================
   ICONS
   ========================================================================= */

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-ink-muted"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H8v2h8v-2h-3v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  )
}

function LightbulbIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6M10 22h4" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function BookmarkIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
}
