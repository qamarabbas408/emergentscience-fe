import { useMemo, useState, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { ArticleCardSkeleton } from '../components/skeletons'

const MONTH_INDEX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

function parseDateLabel(label: string): number {
  const [day, month, year] = label.split(' ')
  return new Date(Number(year), MONTH_INDEX[month], Number(day)).getTime()
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

interface Article {
  id: number
  type: string
  title: string
  authors: string[]
  journal: string
  doi: string
  published: string
  citations: number
  views: number
  topic?: string
  abstract: string
}

const ARTICLES: Article[] = [
  {
    id: 1,
    type: 'Original Research',
    title: 'High-Efficiency Perovskite Solar Cells with Low-Cost Hole-Transporting Carbon Interlayers',
    authors: ['Dr. Elena Rostova', 'Prof. Kenji Takahashi'],
    journal: 'Frontiers in Photovoltaics',
    doi: '10.3389/fpv.2026.000124',
    published: '14 Aug 2026',
    citations: 4,
    views: 1892,
    abstract:
      'We demonstrate carbon-based hole-transporting interlayers that boost perovskite cell efficiency to 27.1% while cutting module material costs by 40%, paving the way for grid-scale deployment.',
  },
  {
    id: 2,
    type: 'Review',
    title: 'Clinical Validation of Foundation Vision-Language Models in Multi-Center Radiomic Diagnostics',
    authors: ['Sarah Jenkins', 'David Liu', 'Clara Monnier'],
    journal: 'Frontiers in Artificial Intelligence',
    doi: '10.3389/frai.2026.001355',
    published: '12 Aug 2026',
    citations: 9,
    views: 3410,
    topic: 'AI in Diagnostics',
    abstract:
      'This review consolidates clinical validation studies of vision-language foundation models across 23 radiology centers, assessing calibration, generalizability, and regulatory readiness.',
  },
  {
    id: 3,
    type: 'Case Report',
    title: 'Transient Multidomain Cognitive Improvement Following High-Dose Psilocybin Administration: A Case Report',
    authors: ['Marcos Lago', 'Mariana Cerveira', 'Joe Xavier Simonet'],
    journal: 'Frontiers in Neuroscience',
    doi: '10.3389/fnins.2026.1813281',
    published: '11 May 2026',
    citations: 1,
    views: 189889,
    abstract:
      'We report transient multidomain functional improvement in advanced Alzheimer\u2019s disease following a monitored high-dose psilocybin session, with serial neuropsychological and imaging follow-up.',
  },
  {
    id: 4,
    type: 'Original Research',
    title: 'CRISPR-Cas9 Screens Identify Synthetic Lethal Targets in BRCA1-Deficient Triple-Negative Breast Cancer',
    authors: ['Dr. Anika Sharma', 'Dr. Wei Zhao'],
    journal: 'Frontiers in Genome Editing',
    doi: '10.3389/fge.2026.000312',
    published: '08 Aug 2026',
    citations: 21,
    views: 5810,
    abstract:
      'Genome-wide CRISPR knockout screens across 14 BRCA1-deficient cell lines reveal seven druggable synthetic lethal candidates, validated in patient-derived organoids.',
  },
  {
    id: 5,
    type: 'Systematic Review',
    title: 'Gut-Microbiome Interventions for Metabolic Health: A Systematic Review of 92 Randomized Controlled Trials',
    authors: ['Rob Knight', 'Lena Fischer'],
    journal: 'Frontiers in Microbiome Research',
    doi: '10.3389/fmbr.2026.000089',
    published: '02 Aug 2026',
    citations: 34,
    views: 12450,
    topic: 'Microbiome & Metabolism',
    abstract:
      'Pooled analysis of 92 RCTs shows probiotic and FMT interventions confer modest but significant improvements in HbA1c, triglycerides, and inflammatory markers over 12 weeks.',
  },
  {
    id: 6,
    type: 'Perspective',
    title: 'Toward Interpretable Quantum Large Language Models: Benchmarks, Pitfalls, and Open Problems',
    authors: ['Peter Knight', 'Dr. Sofia Almeida'],
    journal: 'Frontiers in Quantum Computing',
    doi: '10.3389/fqco.2026.000071',
    published: '28 Jul 2026',
    citations: 5,
    views: 2205,
    abstract:
      'We argue that near-term quantum LLM evaluations conflate encoding efficiency with reasoning ability, and propose task-specific benchmarks that isolate genuinely quantum advantage.',
  },
  {
    id: 7,
    type: 'Original Research',
    title: 'Solid-State Electrolyte Interfaces for Fast-Charging Lithium Batteries at Scale',
    authors: ['Y. Shirley Meng', 'Tomás Navarro'],
    journal: 'Frontiers in Battery Technology',
    doi: '10.3389/fbat.2026.000203',
    published: '20 Jul 2026',
    citations: 12,
    views: 7840,
    topic: 'Solid-State Batteries',
    abstract:
      'Interfacial engineering of sulfide electrolytes enables 15-minute fast charging with <5% capacity fade after 800 cycles in 10 Ah pouch cells.',
  },
  {
    id: 8,
    type: 'Brief Research Report',
    title: 'Perovskite Stability Under Dual Stress: Humidity and Ultraviolet Cycling in Outdoor Conditions',
    authors: ['Henry Snaith', 'Grace Okafor'],
    journal: 'Frontiers in Photovoltaics',
    doi: '10.3389/fpv.2026.000148',
    published: '15 Jul 2026',
    citations: 3,
    views: 1540,
    abstract:
      'Outdoor degradation tracking over 14 months reveals that coupled humidity-UV stress accelerates phase segregation beyond either stressor alone, informing encapsulation requirements.',
  },
  {
    id: 9,
    type: 'Editorial',
    title: 'Research Integrity in an Age of Automated Manuscript Generation',
    authors: ['The Editorial Board'],
    journal: 'Frontiers in Artificial Intelligence',
    doi: '10.3389/frai.2026.001420',
    published: '10 Jul 2026',
    citations: 8,
    views: 6210,
    abstract:
      'Editors outline policy responses to large-scale automated manuscript generation, including provenance tracking, disclosure standards, and reviewer tooling.',
  },
  {
    id: 10,
    type: 'Original Research',
    title: 'Microbiome-Associated Metabolites Predict Anti-Tumor Response in Checkpoint Inhibitor Therapy',
    authors: ['Dr. Kenji Takahashi', 'Amelie Rousseau'],
    journal: 'Frontiers in Microbiome Research',
    doi: '10.3389/fmbr.2026.000104',
    published: '05 Jul 2026',
    citations: 17,
    views: 9250,
    abstract:
      'Untargeted metabolomics of 210 patients identifies three gut-derived metabolites whose baseline abundance predicts durable response to PD-1 blockade with 0.82 AUC.',
  },
]

const TRENDING_KEYWORDS = [
  'CRISPR-Cas9',
  'LLM Benchmarks',
  'Perovskite Stability',
  'Microbiome Health',
]

type SortBy = 'recent' | 'citations' | 'views'
type ViewMode = 'list' | 'grid'
type DateFilter = 'all' | '7d' | '30d' | 'custom'

const JOURNAL_OPTIONS = [...new Set(ARTICLES.map((article) => article.journal))]

const TYPE_OPTIONS = [...new Set(ARTICLES.map((article) => article.type))]

const PAGE_SIZE = 5

function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: () =>
      new Promise<Article[]>((resolve) => {
        setTimeout(() => resolve(ARTICLES), 900)
      }),
  })
}

export function ArticlesPage() {
  const { data: articles, isPending } = useArticles()

  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('recent')
  const [view, setView] = useState<ViewMode>('list')
  const [openAccessOnly, setOpenAccessOnly] = useState(true)
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [selectedJournals, setSelectedJournals] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [researchTopicOnly, setResearchTopicOnly] = useState(false)
  const [journalSearch, setJournalSearch] = useState('')
  const [showAllJournals, setShowAllJournals] = useState(false)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let list = (articles ?? []).filter((article) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.authors.join(' ').toLowerCase().includes(q) ||
        article.journal.toLowerCase().includes(q) ||
        article.doi.toLowerCase().includes(q) ||
        article.abstract.toLowerCase().includes(q)
      const matchesJournal =
        selectedJournals.length === 0 || selectedJournals.includes(article.journal)
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(article.type)
      const matchesTopic = !researchTopicOnly || Boolean(article.topic)
      let matchesDate = true
      if (dateFilter === '7d') matchesDate = daysAgo(article.published) <= 7
      if (dateFilter === '30d') matchesDate = daysAgo(article.published) <= 30
      if (dateFilter === 'custom') {
        matchesDate = inDateRange(article.published, customFrom, customTo)
      }
      return matchesQuery && matchesJournal && matchesType && matchesTopic && matchesDate
    })

    list = [...list].sort((a, b) => {
      if (sortBy === 'citations') return b.citations - a.citations
      if (sortBy === 'views') return b.views - a.views
      return daysAgo(a.published) - daysAgo(b.published)
    })
    return list
  }, [articles, query, sortBy, selectedJournals, selectedTypes, researchTopicOnly, dateFilter, customFrom, customTo])

  const hasFilters =
    Boolean(query.trim()) ||
    selectedJournals.length > 0 ||
    selectedTypes.length > 0 ||
    researchTopicOnly ||
    dateFilter !== 'all' ||
    !openAccessOnly

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const clearAll = () => {
    setQuery('')
    setSortBy('recent')
    setOpenAccessOnly(true)
    setDateFilter('all')
    setCustomFrom('')
    setCustomTo('')
    setSelectedJournals([])
    setSelectedTypes([])
    setResearchTopicOnly(false)
    setPage(1)
  }

  const toggleInList = (list: string[], value: string, setter: (v: string[]) => void) =>
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const visibleJournals = JOURNAL_OPTIONS.filter((j) =>
    j.toLowerCase().includes(journalSearch.toLowerCase()),
  ).slice(0, showAllJournals ? JOURNAL_OPTIONS.length : 4)

  const journalCount = (name: string) => (articles ?? []).filter((a) => a.journal === name).length
  const typeCount = (name: string) => (articles ?? []).filter((a) => a.type === name).length

  return (
    <div className="min-h-screen bg-body font-sans text-ink">
      <Header />

      <main className="space-y-8 pb-16">
        <section className="relative border-b border-border bg-surface">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,59,222,0.05),transparent_70%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-tint px-3.5 py-1 text-xs font-bold text-primary-deep shadow-2xs">
                <StarIcon />
                <span>All Articles &amp; Latest Publications</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                  Explore Open-Access Articles
                </h1>
                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-secondary sm:text-base">
                  Search and download over 250,000 peer-reviewed research papers across all
                  EmergentSci. journals.
                </p>
              </div>

              <div className="mx-auto max-w-3xl">
                <div className="flex flex-col items-stretch gap-2 rounded-2xl border-2 border-border bg-white p-1.5 shadow-sm transition-all focus-within:border-red-600 focus-within:ring-4 focus-within:ring-red-500/10 sm:flex-row sm:items-center sm:rounded-full">
                  <div className="flex flex-1 items-center gap-3 px-3 py-1">
                    <SearchIcon />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value)
                        setPage(1)
                      }}
                      placeholder="Search by article title, author, keyword, DOI, or abstract…"
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted"
                    />
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        className="rounded-full bg-body px-2 py-0.5 text-xs font-medium text-ink-muted hover:text-ink"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setPage(1)}
                    className="shrink-0 rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-red-700"
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
                <span className="mr-1 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  <BoltIcon />
                  Trending Keywords:
                </span>
                {TRENDING_KEYWORDS.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => {
                      setQuery(keyword)
                      setPage(1)
                    }}
                    className="rounded-full border border-border bg-body px-2.5 py-0.5 text-xs font-medium text-ink-secondary transition-colors hover:border-primary hover:bg-primary-tint hover:text-primary"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-ink">
                Showing {isPending ? '…' : `${(safePage - 1) * PAGE_SIZE + 1} – ${Math.min(safePage * PAGE_SIZE, filtered.length)}`}{' '}
                of <span className="text-primary">{isPending ? '…' : filtered.length.toLocaleString()}</span> Articles
              </span>
              <span className="mx-1 h-4 w-px bg-border" />
              {openAccessOnly && (
                <Chip label="Open Access (CC BY 4.0)" onRemove={() => setOpenAccessOnly(false)} />
              )}
            </div>

            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 font-medium text-ink-muted">
                Sort By:
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="cursor-pointer rounded-lg border border-border bg-body px-2.5 py-1 text-xs font-semibold text-ink outline-none"
                >
                  <option value="recent">Most Recent</option>
                  <option value="citations">Most Cited</option>
                  <option value="views">Most Viewed</option>
                </select>
              </label>
              <div className="flex items-center gap-1 border-l border-border pl-3">
                <button
                  onClick={() => setView('list')}
                  title="List view"
                  aria-label="List view"
                  aria-pressed={view === 'list'}
                  className={`rounded-md p-1.5 ${view === 'list' ? 'bg-primary-tint text-primary' : 'text-ink-muted hover:text-ink'}`}
                >
                  <ListIcon />
                </button>
                <button
                  onClick={() => setView('grid')}
                  title="Grid view"
                  aria-label="Grid view"
                  aria-pressed={view === 'grid'}
                  className={`rounded-md p-1.5 ${view === 'grid' ? 'bg-primary-tint text-primary' : 'text-ink-muted hover:text-ink'}`}
                >
                  <GridIcon />
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            <aside className="space-y-4 lg:col-span-3">
              <FilterGroup title="Publication Date">
                <RadioOption checked={dateFilter === 'all'} label="All Time" onClick={() => setDateFilter('all')} />
                <RadioOption checked={dateFilter === '7d'} label="Last 7 Days" onClick={() => setDateFilter('7d')} />
                <RadioOption checked={dateFilter === '30d'} label="Last 30 Days" onClick={() => setDateFilter('30d')} />
                <RadioOption checked={dateFilter === 'custom'} label="Custom Range" onClick={() => setDateFilter('custom')} />
                {dateFilter === 'custom' && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-border bg-body px-2 py-1 text-[11px] outline-none focus:border-primary"
                    />
                    <span className="text-[11px] text-ink-muted">to</span>
                    <input
                      type="date"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-border bg-body px-2 py-1 text-[11px] outline-none focus:border-primary"
                    />
                  </div>
                )}
              </FilterGroup>

              <FilterGroup title="Field & Journal">
                <div className="relative">
                  <SearchIcon />
                  <input
                    type="text"
                    value={journalSearch}
                    onChange={(e) => setJournalSearch(e.target.value)}
                    placeholder="Search journals…"
                    className="w-full rounded-lg border border-border bg-body py-1.5 pl-8 pr-2 text-[11px] outline-none focus:border-primary"
                  />
                </div>
                <div className="mt-2 space-y-1.5">
                  {visibleJournals.map((journal) => (
                    <CheckOption
                      key={journal}
                      label={`${journal} (${journalCount(journal)})`}
                      checked={selectedJournals.includes(journal)}
                      onChange={() => toggleInList(selectedJournals, journal, setSelectedJournals)}
                    />
                  ))}
                </div>
                {JOURNAL_OPTIONS.length > 4 && (
                  <button
                    onClick={() => setShowAllJournals((s) => !s)}
                    className="mt-2 text-[11px] font-bold text-primary hover:text-primary-hover"
                  >
                    {showAllJournals ? '− Show less' : `+ Show ${JOURNAL_OPTIONS.length - 4} more journals`}
                  </button>
                )}
              </FilterGroup>

              <FilterGroup title="Article Type">
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
              </FilterGroup>

              <FilterGroup title="Research Topics & Special Issues">
                <CheckOption
                  label="Part of a Research Topic only"
                  checked={researchTopicOnly}
                  onChange={() => setResearchTopicOnly((v) => !v)}
                />
              </FilterGroup>

              <FilterGroup title="Institutional Affiliation">
                <input
                  type="text"
                  placeholder="Filter by University / Institute…"
                  className="w-full rounded-lg border border-border bg-body px-2 py-1.5 text-[11px] outline-none focus:border-primary"
                />
              </FilterGroup>

              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="w-full rounded-xl border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
                >
                  Clear All Filters
                </button>
              )}
            </aside>

            <div className="space-y-4 lg:col-span-9">
              {isPending ? (
                <div className="space-y-4" role="status" aria-live="polite" aria-label="Loading articles">
                  {Array.from({ length: 4 }, (_, i) => (
                    <ArticleCardSkeleton key={i} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-border bg-white p-12 text-center shadow-xs">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint text-primary">
                    <SearchIcon />
                  </div>
                  <h3 className="mt-3 text-base font-bold text-ink">No articles found</h3>
                  <p className="mx-auto mt-1 max-w-sm text-xs text-ink-muted">
                    We could not find any publications matching your current filters.
                  </p>
                  <button
                    onClick={clearAll}
                    className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-hover"
                  >
                    Reset Filters &amp; View All
                  </button>
                </div>
              ) : (
                <>
                  <div className={view === 'grid' ? 'grid gap-4 md:grid-cols-2' : 'space-y-4'}>
                    {pageItems.map((article) => (
                      <ArticleCard key={article.id} article={article} grid={view === 'grid'} />
                    ))}
                  </div>

                  <Pagination
                    page={safePage}
                    totalPages={totalPages}
                    onPage={setPage}
                  />
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function ArticleCard({ article, grid }: { article: Article; grid: boolean }) {
  const [showAbstract, setShowAbstract] = useState(false)

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-white p-5 shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-card">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          Open Access
        </span>
        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700">
          {article.type}
        </span>
        {article.topic && (
          <span className="rounded-full bg-primary-tint px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            Topic: {article.topic}
          </span>
        )}
        <a
          href="#"
          className="ml-auto text-[10px] font-semibold text-primary hover:text-primary-hover"
        >
          doi: {article.doi}
        </a>
      </div>

      <h3 className={`mt-3 font-bold leading-snug text-ink transition-colors hover:text-primary ${grid ? 'text-base' : 'text-lg'}`}>
        <a href="#">{article.title}</a>
      </h3>

      <p className="mt-1.5 text-xs text-ink-muted">
        <span className="font-semibold text-ink-secondary">Authors:</span> {article.authors.join(', ')}
      </p>
      <p className="mt-0.5 text-xs text-ink-muted">
        <span className="font-semibold text-ink-secondary">Journal:</span>{' '}
        <span className="font-medium text-primary">{article.journal}</span>
      </p>
      <p className="mt-0.5 text-xs text-ink-muted">
        Published: {article.published} • Citations: {article.citations} • Views:{' '}
        {article.views.toLocaleString()}
      </p>

      {showAbstract && (
        <p className="mt-3 rounded-xl bg-body p-3 text-xs leading-relaxed text-ink-secondary">
          {article.abstract}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3">
        <button
          onClick={() => setShowAbstract((s) => !s)}
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover"
        >
          <span className={showAbstract ? 'rotate-180 transition-transform' : 'transition-transform'}>
            <ChevronDownIcon />
          </span>
          {showAbstract ? 'Hide Abstract' : 'Read Abstract'}
        </button>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-primary-hover"
        >
          <DownloadIcon />
          Download Full-Text PDF
        </a>
      </div>
    </article>
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
    <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-xs">
      <button
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
        className="rounded-lg border border-border bg-white px-3 py-1.5 font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
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
            onClick={() => onPage(p)}
            className={`h-8 w-8 rounded-lg font-bold transition-colors ${
              p === page ? 'bg-primary text-white' : 'border border-border bg-white text-ink-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
        className="rounded-lg border border-border bg-white px-3 py-1.5 font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-xs">
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-ink">{title}</h3>
      <div className="mt-2.5">{children}</div>
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
    <label className="flex cursor-pointer items-start gap-2 text-xs text-ink-secondary hover:text-ink">
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
    <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-secondary hover:text-ink">
      <input type="radio" checked={checked} onChange={onClick} className="h-3.5 w-3.5 accent-primary" />
      <span>{label}</span>
    </label>
  )
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-tint px-2.5 py-1 text-[11px] font-bold text-primary">
      {label}
      <button onClick={onRemove} className="text-primary/60 hover:text-primary" aria-label={`Remove ${label}`}>
        <CloseIcon />
      </button>
    </span>
  )
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-warning" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  )
}