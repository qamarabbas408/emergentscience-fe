import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { JournalCardSkeleton, Skeleton } from '../components/skeletons'
import { appRoutes } from '../appRoutes'

type Category = 'science' | 'health' | 'engineering' | 'social' | 'humanities' | 'economics' | 'data'

interface Journal {
  name: string
  abbr: string
  tagline: string
  editor: string
  color: string
  category: Category
  isNew?: boolean
  sections?: number
  articles?: number
  views?: string
  citations?: string
  impactFactor?: string
  citescore?: string
}

const JOURNALS: Journal[] = [
  {
    name: 'Frontiers in Artificial Intelligence',
    abbr: 'AI',
    category: 'science',
    tagline:
      'Research on AI and large language models across healthcare, finance, law, and education, advancing innovation and interdisciplinary collaboration.',
    editor: 'Thomas Hartung, Johns Hopkins University, United States',
    color: 'bg-primary-tint text-primary',
    sections: 12,
    articles: 2621,
    views: '17.7M',
    citations: '33,693',
    impactFactor: '6.7',
    citescore: '8.0',
  },
  {
    name: 'Frontiers in Aging Neuroscience',
    abbr: 'AN',
    category: 'health',
    tagline:
      'One of the most cited journals in geriatrics and gerontology, with research on central nervous system aging.',
    editor: 'Thomas Wisniewski, NYU Grossman School of Medicine, United States',
    color: 'bg-sky/10 text-sky',
    sections: 6,
    articles: 8288,
    views: '70.7M',
    citations: '231,761',
    impactFactor: '5.2',
    citescore: '10.0',
  },
  {
    name: 'Frontiers in Astronomy and Space Sciences',
    abbr: 'AS',
    category: 'science',
    tagline:
      'Advancing our understanding of the universe, covering topics from planetary science to cosmology.',
    editor: 'Julio Navarro, University of Victoria, Canada',
    color: 'bg-emerald-50 text-emerald-700',
    sections: 15,
    articles: 1995,
    views: '8.8M',
    citations: '21,273',
    impactFactor: '2.4',
    citescore: '5.5',
  },
  {
    name: 'Frontiers in Antibiotics',
    abbr: 'AB',
    category: 'health',
    tagline:
      'Research exploring solutions to antibiotic resistance, development and delivery to improve the health of the global population.',
    editor: 'Stephen Henry Gillespie, University of St Andrews, United Kingdom',
    color: 'bg-red-50 text-red-600',
    isNew: true,
    sections: 5,
    articles: 136,
    views: '686,574',
    impactFactor: '3.9',
    citescore: '5.0',
  },
  {
    name: 'Frontiers in Allergy',
    abbr: 'AL',
    category: 'health',
    tagline:
      'One of the most cited journals in its field, advancing our understanding of allergic diseases and how to manage them.',
    editor: 'Nikolaos (Nikos) G Papadopoulos, University of Athens, Greece',
    color: 'bg-amber-50 text-amber-600',
    sections: 13,
    articles: 972,
    views: '4.9M',
    citations: '6,849',
    impactFactor: '3.4',
    citescore: '4.3',
  },
  {
    name: 'Frontiers in Agronomy',
    abbr: 'AG',
    category: 'science',
    tagline:
      'Research focusing on cropping systems, sustainable agriculture and climate-resilient food production.',
    editor: 'John R Porter, University of Copenhagen, Denmark',
    color: 'bg-primary-tint text-primary',
    sections: 7,
    articles: 1031,
    views: '4.7M',
    citations: '10,145',
    impactFactor: '4.2',
    citescore: '6.8',
  },
  {
    name: 'Frontiers in Applied Mathematics and Statistics',
    abbr: 'AM',
    category: 'science',
    tagline:
      'Research on applied mathematics and statistics, driving innovation in science, engineering, finance, and data science.',
    editor: 'Charles K. Chui, Stanford University, United States',
    color: 'bg-violet-50 text-violet-700',
    sections: 8,
    articles: 988,
    views: '5.0M',
    citations: '6,773',
    impactFactor: '2.0',
    citescore: '3.6',
  },
  {
    name: 'Frontiers in Animal Science',
    abbr: 'ANI',
    category: 'science',
    tagline:
      'Research on sustainable animal science, covering topics such as welfare, nutrition and genetics.',
    editor: 'Christine Janet Nicol, Royal Veterinary College, United Kingdom',
    color: 'bg-sky/10 text-sky',
    sections: 5,
    articles: 988,
    views: '3.9M',
    citations: '5,437',
    impactFactor: '2.8',
    citescore: '4.2',
  },
  {
    name: 'Frontiers in Acoustics',
    abbr: 'AC',
    category: 'engineering',
    tagline:
      'Covering all areas of acoustics, including metamaterials, noise control, and sound perception.',
    editor: 'Massimo Ruzzene, University of Colorado Boulder, United States',
    color: 'bg-emerald-50 text-emerald-700',
    isNew: true,
    sections: 4,
    articles: 39,
    views: '143,721',
  },
  {
    name: 'Frontiers in Adolescent Medicine',
    abbr: 'ADM',
    category: 'health',
    tagline:
      'Exploring all aspects of adolescent medicine to improve the health of our growing population.',
    editor: 'Charles E Irwin Jr., University of California, San Francisco, United States',
    color: 'bg-red-50 text-red-600',
    isNew: true,
    sections: 4,
    articles: 49,
    views: '115,226',
  },
  {
    name: 'Acta Biochimica Polonica',
    abbr: 'ABP',
    category: 'health',
    tagline:
      'Open Access journal of the Polish Biochemical Society, publishing research on enzymology and metabolism.',
    editor: 'Polish Biochemical Society, Poland',
    color: 'bg-amber-50 text-amber-600',
    isNew: true,
    impactFactor: '2.2',
    citescore: '4.8',
  },
  {
    name: 'Frontiers in Aerospace Engineering',
    abbr: 'AE',
    category: 'engineering',
    tagline:
      'Research exploring aerospace applications for civil and commercial aviation, as well as new and futuristic aerospace technologies.',
    editor: 'Ramesh K Agarwal, Washington University in St. Louis, United States',
    color: 'bg-violet-50 text-violet-700',
    sections: 5,
    articles: 47,
    views: '252,830',
  },
  {
    name: 'Frontiers in Genome Editing',
    abbr: 'GE',
    category: 'health',
    tagline:
      'CRISPR gene editing and precision genome engineering across medicine, agriculture, and synthetic biology.',
    editor: 'David Liu, Broad Institute of MIT and Harvard, United States',
    color: 'bg-primary-tint text-primary',
    isNew: true,
    sections: 4,
    articles: 214,
    views: '2.1M',
    citations: '18,902',
    impactFactor: '8.1',
    citescore: '11.4',
  },
  {
    name: 'Frontiers in Photovoltaics',
    abbr: 'PV',
    category: 'engineering',
    tagline:
      'Perovskite photovoltaics, solar cell engineering, and next-generation renewable energy materials.',
    editor: 'Henry Snaith, University of Oxford, United Kingdom',
    color: 'bg-amber-50 text-amber-600',
    isNew: true,
    sections: 5,
    articles: 318,
    views: '3.6M',
    citations: '29,401',
    impactFactor: '6.2',
    citescore: '9.0',
  },
  {
    name: 'Frontiers in Quantum Computing',
    abbr: 'QC',
    category: 'science',
    tagline:
      'Quantum computing, quantum algorithms, and the emerging foundations of quantum machine learning.',
    editor: 'Peter Knight, Imperial College London, United Kingdom',
    color: 'bg-violet-50 text-violet-700',
    isNew: true,
    sections: 6,
    articles: 187,
    views: '1.9M',
    citations: '11,334',
    impactFactor: '5.8',
    citescore: '7.6',
  },
  {
    name: 'Frontiers in Battery Technology',
    abbr: 'BT',
    category: 'engineering',
    tagline:
      'Solid-state batteries, energy storage systems, and electrochemical materials for a clean energy future.',
    editor: 'Y. Shirley Meng, University of Chicago, United States',
    color: 'bg-sky/10 text-sky',
    isNew: true,
    sections: 4,
    articles: 245,
    views: '2.8M',
    citations: '22,116',
    impactFactor: '7.3',
    citescore: '10.2',
  },
  {
    name: 'Frontiers in Microbiome Research',
    abbr: 'MB',
    category: 'health',
    tagline:
      'Microbiome therapy, host-microbe interactions, and the gut-brain axis across human and environmental health.',
    editor: 'Rob Knight, University of California San Diego, United States',
    color: 'bg-emerald-50 text-emerald-700',
    isNew: true,
    sections: 7,
    articles: 512,
    views: '6.4M',
    citations: '41,207',
    impactFactor: '6.9',
    citescore: '9.8',
  },
]

const MOST_VIEWED = [
  {
    type: 'Case Report',
    title:
      'Transient multidomain functional improvement in advanced Alzheimer’s disease following high-dose psilocybin-containing mushroom administration: a case report',
    authors: 'Marcos Lago, Mariana Cerveira, Joe Xavier Simonet',
    journal: 'Frontiers in Neuroscience',
    views: '189,889',
    citations: '1',
  },
  {
    type: 'Perspective',
    title:
      'Beyond the bare minimum: the case for revised physical activity guidelines and protein intake recommendations that maximise healthspan',
    authors: 'Chris Macdonald',
    journal: 'Frontiers in Nutrition',
    views: '140,900',
    citations: '1',
  },
  {
    type: 'Brief Research Report',
    title:
      'Fragmentation of sharp-tail sunfish (Masturus lanceolatus) caused by high-impact ramming behavior in orcas (Orcinus orca)',
    authors: 'Kathryn A. Ayres, Austin J. Gallagher, Christine V. Avena, Carlos M. Duarte, Jesús Erick Higuera Rivas',
    journal: 'Frontiers in Ethology',
    views: '115,992',
  },
  {
    type: 'Lead Article',
    title: 'Regulatory T cells: master orchestrators of immune tolerance and tissue homeostasis',
    authors: 'Jeffrey A. Bluestone, Megan K. Levings, Frederick J. Ramsdell, Alexander Y. Rudensky, Qizhi Tang, Piotr Trzonkowski',
    journal: 'Frontiers in Science',
    views: '85,349',
    citations: '3',
  },
]

const TRENDING_TOPICS = [
  'CRISPR Gene Editing',
  'Perovskite Photovoltaics',
  'Quantum LLMs',
  'Solid-State Batteries',
  'Microbiome Therapy',
]

type SortBy = 'name' | 'impactFactor' | 'citescore' | 'articles'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

type CategoryKey = Category | 'all'

const CATEGORY_FILTERS: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'All Sciences' },
  { key: 'science', label: 'Science' },
  { key: 'health', label: 'Health' },
  { key: 'engineering', label: 'Engineering' },
  { key: 'social', label: 'Social Sciences' },
  { key: 'humanities', label: 'Humanities' },
  { key: 'economics', label: 'Economics & Business' },
  { key: 'data', label: 'Data & Information' },
]

function matchesSearch(journal: Journal, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    journal.name.toLowerCase().includes(q) ||
    journal.tagline.toLowerCase().includes(q) ||
    journal.editor.toLowerCase().includes(q)
  )
}

function useJournals() {
  return useQuery({
    queryKey: ['journals'],
    queryFn: () =>
      new Promise<Journal[]>((resolve) => {
        setTimeout(() => resolve(JOURNALS), 800)
      }),
  })
}

export function JournalsPage() {
  const [query, setQuery] = useState('')
  const [journalFilter, setJournalFilter] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortBy>('name')
  const [viewDensity, setViewDensity] = useState<'cards' | 'compact'>('cards')
  const [category, setCategory] = useState<CategoryKey>('all')

  const resultsRef = useRef<HTMLDivElement>(null)
  const { data: journals, isPending } = useJournals()

  // Filter & Sorting Logic
  const filtered = useMemo(() => {
    let list = (journals ?? []).filter((journal) => {
      const matchesSearchQuery = matchesSearch(journal, query)
      const matchesDropdown = !journalFilter || journal.name === journalFilter
      const matchesLetter = !selectedLetter || journal.name.toUpperCase().startsWith(selectedLetter)
      const matchesCategory = category === 'all' || journal.category === category
      return matchesSearchQuery && matchesDropdown && matchesLetter && matchesCategory
    })

    return list.sort((a, b) => {
      if (sortBy === 'impactFactor') {
        return parseFloat(b.impactFactor || '0') - parseFloat(a.impactFactor || '0')
      }
      if (sortBy === 'citescore') {
        return parseFloat(b.citescore || '0') - parseFloat(a.citescore || '0')
      }
      if (sortBy === 'articles') {
        return (b.articles || 0) - (a.articles || 0)
      }
      return a.name.localeCompare(b.name)
    })
  }, [journals, query, journalFilter, selectedLetter, category, sortBy])

  const hasFilter =
    Boolean(query.trim()) || journalFilter !== '' || selectedLetter !== null || category !== 'all'

  const resetFilters = () => {
    setQuery('')
    setJournalFilter('')
    setSelectedLetter(null)
    setCategory('all')
    setSortBy('name')
  }

  const scrollToResults = () => resultsRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-body text-ink font-sans">
      <Header />

      <main className="space-y-8 pb-16">
        {/* =========================================================================
            1. HERO DISCOVERY HEADER (Clean, Centered, High-Hierarchy)
           ========================================================================= */}
        <section className="relative bg-surface border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,59,222,0.05),transparent_70%)]" />

          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="mx-auto max-w-4xl text-center space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-tint px-3.5 py-1 text-xs font-bold text-primary-deep shadow-2xs">
                <StarIcon />
                <span>Open Access Academic Publishing</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                  Discover Open-Access Research
                </h1>
                <p className="text-sm leading-relaxed text-ink-secondary sm:text-base max-w-2xl mx-auto">
                  EmergentSci. empowers global researchers through transparent peer review and community-led research topics.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                {CATEGORY_FILTERS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setCategory(c.key)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                      category === c.key
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-body border border-border text-ink-secondary hover:border-primary hover:text-primary'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Search Bar Box */}
              <div className="mx-auto max-w-3xl">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl sm:rounded-full border-2 border-border bg-white p-1.5 shadow-sm transition-all focus-within:border-red-600 focus-within:ring-4 focus-within:ring-red-500/10">
                  <div className="flex flex-1 items-center gap-3 px-3 py-1">
                    <SearchIcon />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search 250,000+ peer-reviewed articles, topics, DOIs…"
                      className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
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

                  <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-border pt-2 sm:pt-0 sm:pl-3">
                    <select
                      value={journalFilter}
                      onChange={(e) => setJournalFilter(e.target.value)}
                      className="max-w-[150px] truncate bg-transparent text-xs font-semibold text-ink-secondary outline-none cursor-pointer"
                    >
                      <option value="">All Journals</option>
                      {JOURNALS.map((j) => (
                        <option key={j.name} value={j.name}>
                          {j.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={scrollToResults}
                      className="rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-red-700 shadow-xs"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Trending Topics Strip */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted mr-1">
                  <BoltIcon />
                  Trending:
                </span>
                {TRENDING_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => {
                      setQuery(topic)
                      scrollToResults()
                    }}
                    className="rounded-full border border-border bg-body px-2.5 py-0.5 text-xs font-medium text-ink-secondary transition-colors hover:border-primary hover:bg-primary-tint hover:text-primary"
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Quick Action Bento Trio */}
              <div className="grid gap-3 text-left sm:grid-cols-3 pt-2">
                <a
                  href={appRoutes.submit}
                  className="group flex items-center gap-3.5 rounded-2xl border border-border bg-white p-4 transition-all hover:border-primary hover:bg-primary-tint/30 hover:shadow-card"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <FileIcon />
                  </span>
                  <div>
                    <span className="block text-sm font-bold text-ink group-hover:text-primary transition-colors">
                      Submit Manuscript
                    </span>
                    <span className="text-[11px] text-ink-muted">Direct submission flow</span>
                  </div>
                </a>

                <button
                  onClick={scrollToResults}
                  className="group flex items-center gap-3.5 rounded-2xl border border-border bg-white p-4 text-left transition-all hover:border-primary hover:bg-primary-tint/30 hover:shadow-card"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <BooksIcon />
                  </span>
                  <div>
                    <span className="block text-sm font-bold text-ink group-hover:text-primary transition-colors">
                      Browse Journals A–Z
                    </span>
                    <span className="text-[11px] text-ink-muted">Complete index directory</span>
                  </div>
                </button>

                <a
                  href={appRoutes.topics}
                  className="group flex items-center gap-3.5 rounded-2xl border border-border bg-white p-4 transition-all hover:border-primary hover:bg-primary-tint/30 hover:shadow-card"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <LightbulbIcon />
                  </span>
                  <div>
                    <span className="block text-sm font-bold text-ink group-hover:text-primary transition-colors">
                      Propose Research Topic
                    </span>
                    <span className="text-[11px] text-ink-muted">Lead special issue</span>
                  </div>
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            2. JOURNALS DIRECTORY TOOLBAR & CONTENT STREAM
           ========================================================================= */}
        <section ref={resultsRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-6 space-y-6">
          
          {/* CONTROL TOOLBAR (A-Z Filter + Sort + Density Switcher) */}
          <div className="rounded-2xl border border-border bg-white p-4 shadow-xs space-y-3">
            
            {/* Top Toolbar Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold tracking-tight text-ink">Peer-Reviewed Journals</h2>
                {isPending ? (
                  <Skeleton className="h-5 w-14 rounded-full" />
                ) : (
                  <span className="rounded-full bg-primary-tint px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
                    {filtered.length} {filtered.length === 1 ? 'journal' : 'journals'}
                  </span>
                )}
                <span className="hidden sm:block h-5 w-px bg-border" />
                <LetterFilterDropdown
                  journals={journals ?? []}
                  selectedLetter={selectedLetter}
                  onChange={setSelectedLetter}
                />
              </div>

              {/* Sorting & Density Controls */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-ink-muted font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="bg-body border border-border rounded-lg px-2.5 py-1 text-xs font-semibold text-ink outline-none cursor-pointer"
                  >
                    <option value="name">Alphabetical (A–Z)</option>
                    <option value="impactFactor">Highest Impact Factor</option>
                    <option value="citescore">Highest CiteScore</option>
                    <option value="articles">Most Articles</option>
                  </select>
                </div>

                <div className="hidden sm:flex items-center border-l border-border pl-3 gap-1">
                  <button
                    onClick={() => setViewDensity('cards')}
                    className={`p-1.5 rounded-md ${viewDensity === 'cards' ? 'bg-primary-tint text-primary' : 'text-ink-muted hover:text-ink'}`}
                    title="Detailed Card View"
                  >
                    <GridIcon />
                  </button>
                  <button
                    onClick={() => setViewDensity('compact')}
                    className={`p-1.5 rounded-md ${viewDensity === 'compact' ? 'bg-primary-tint text-primary' : 'text-ink-muted hover:text-ink'}`}
                    title="Compact Row View"
                  >
                    <ListIcon />
                  </button>
                </div>

                {hasFilter && (
                  <button
                    onClick={resetFilters}
                    className="font-bold text-red-600 hover:text-red-700 text-xs border-l border-border pl-3"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* MAIN DUAL-COLUMN LAYOUT (8 COLS JOURNALS / 4 COLS SIDEBAR) */}
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            
            {/* LEFT 8 COLUMNS: JOURNAL STREAM */}
            <div className="space-y-4 lg:col-span-8">
              {isPending ? (
                <div className="space-y-4" role="status" aria-live="polite">
                  {Array.from({ length: 4 }, (_, i) => (
                    <JournalCardSkeleton key={i} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-border bg-white p-12 text-center shadow-xs space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint text-primary">
                    <SearchIcon />
                  </div>
                  <h3 className="text-base font-bold text-ink">No journals found</h3>
                  <p className="text-xs text-ink-muted max-w-sm mx-auto">
                    We could not find any publications matching your current search or letter filter.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-2 inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-hover transition-colors"
                  >
                    Reset Filters & View All
                  </button>
                </div>
              ) : (
                filtered.map((journal) => (
                  <JournalCard key={journal.name} journal={journal} isCompact={viewDensity === 'compact'} />
                ))
              )}
            </div>

            {/* RIGHT 4 COLUMNS: STICKY IMPACT SIDEBAR */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              
              {/* Most Viewed Widget */}
              <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-600"></span>
                    <span>Most Viewed Articles</span>
                  </h3>
                  <span className="text-[10px] font-bold text-primary bg-primary-tint px-2 py-0.5 rounded-full">
                    Top Impact
                  </span>
                </div>

                <div className="divide-y divide-border/60">
                  {MOST_VIEWED.map((article, idx) => (
                    <article key={article.title} className="py-3 first:pt-0 last:pb-0">
                      <a href="#" className="group block space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sky">
                            {article.type}
                          </span>
                          <span className="text-[10px] font-mono text-ink-muted">
                            #{idx + 1}
                          </span>
                        </div>

                        <h4 className="line-clamp-2 text-xs font-bold leading-snug text-ink group-hover:text-primary transition-colors">
                          {article.title}
                        </h4>

                        <p className="line-clamp-1 text-[11px] text-ink-muted">
                          {article.authors}
                        </p>

                        <div className="pt-0.5 flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-primary truncate max-w-[130px]">
                            {article.journal}
                          </span>
                          <span className="font-medium text-ink-muted">
                            {article.views} views
                          </span>
                        </div>
                      </a>
                    </article>
                  ))}
                </div>

                <div className="border-t border-border pt-3">
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover transition-colors"
                  >
                    <span>See all trending research</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

              {/* Author Fast-Track Submission Box */}
              <div className="rounded-2xl border border-border bg-gradient-to-br from-surface via-white to-primary-tint/30 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <FileIcon />
                  <span>Ready to Publish?</span>
                </div>
                <h4 className="text-sm font-bold text-ink">Collaborative Open Access Review</h4>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Experience our 38-day median peer-review process with interactive author-reviewer dialogue and automated ORCID credit.
                </p>
                <a
                  href={appRoutes.submit}
                  className="block text-center rounded-xl bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-2xs"
                >
                  Submit a Manuscript
                </a>
              </div>

            </aside>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

/* =========================================================================
   JOURNAL CARD (Responsive to Compact & Standard Modes)
   ========================================================================= */

function JournalCard({ journal, isCompact }: { journal: Journal; isCompact?: boolean }) {
  if (isCompact) {
    return (
      <article className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-white p-3.5 transition-all hover:border-primary/40 hover:shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-black ${journal.color}`}>
            {journal.abbr}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-ink group-hover:text-primary truncate transition-colors">
              {journal.name}
            </h3>
            <p className="text-[11px] text-ink-muted truncate">
              {journal.editor || journal.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-xs">
          {journal.impactFactor && (
            <span className="rounded bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 font-bold text-[11px]">
              IF {journal.impactFactor}
            </span>
          )}
          {journal.citescore && (
            <span className="rounded bg-primary-tint text-primary border border-primary/20 px-2 py-0.5 font-bold text-[11px]">
              CS {journal.citescore}
            </span>
          )}
          <span className="text-ink-muted text-[11px] hidden sm:inline">
            {journal.articles?.toLocaleString()} arts.
          </span>
        </div>
      </article>
    )
  }

  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 transition-all duration-200 hover:border-primary/50 hover:shadow-card sm:flex-row">
      <div className={`flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl text-base sm:text-lg font-black tracking-tight shadow-2xs ${journal.color}`}>
        {journal.abbr}
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base sm:text-lg font-bold text-ink group-hover:text-primary transition-colors">
            {journal.name}
          </h3>
          {journal.isNew && (
            <span className="rounded-full bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              New
            </span>
          )}
        </div>

        <p className="line-clamp-2 text-xs sm:text-sm leading-relaxed text-ink-secondary">
          {journal.tagline}
        </p>

        {journal.editor && (
          <p className="text-xs text-ink-muted">
            <span className="font-semibold text-ink-secondary">Field Chief Editor:</span>{' '}
            {journal.editor}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3 text-xs">
          {journal.impactFactor && (
            <div className="flex items-center gap-1 bg-red-50 text-red-800 border border-red-100 rounded-md px-2 py-0.5 font-semibold text-xs">
              <span className="text-[10px] font-bold text-red-600 uppercase">IF:</span>
              <span>{journal.impactFactor}</span>
            </div>
          )}
          {journal.citescore && (
            <div className="flex items-center gap-1 bg-primary-tint text-primary border border-primary/20 rounded-md px-2 py-0.5 font-semibold text-xs">
              <span className="text-[10px] font-bold uppercase">CiteScore:</span>
              <span>{journal.citescore}</span>
            </div>
          )}
          {journal.sections !== undefined && (
            <Metric label="Sections" value={journal.sections.toString()} />
          )}
          {journal.articles !== undefined && (
            <Metric label="Articles" value={journal.articles.toLocaleString('en-US')} />
          )}
          {journal.views && <Metric label="Views" value={journal.views} />}
          {journal.citations && <Metric label="Citations" value={journal.citations} />}
        </div>
      </div>
    </article>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">{label}:</span>
      <span className="text-xs font-semibold text-ink">{value}</span>
    </div>
  )
}

function LetterFilterDropdown({
  journals,
  selectedLetter,
  onChange,
}: {
  journals: Journal[]
  selectedLetter: string | null
  onChange: (letter: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const select = (letter: string | null) => {
    onChange(letter)
    setOpen(false)
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-body px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:border-primary hover:text-primary"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
          By first letter
        </span>
        <span className={selectedLetter ? 'text-primary' : ''}>{selectedLetter ?? '(All)'}</span>
        <ChevronDownIcon className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-30 mt-2 w-60 rounded-xl border border-border bg-white p-3 shadow-card"
        >
          <div className="flex flex-wrap items-center gap-1 text-[11px] font-bold">
            <button
              onClick={() => select(null)}
              className={`h-7 px-2.5 rounded-md border transition-colors ${
                selectedLetter === null
                  ? 'border-primary bg-primary text-white'
                  : 'border-border text-ink-secondary hover:border-primary hover:text-primary'
              }`}
            >
              (All)
            </button>
            {ALPHABET.map((char) => {
              const hasMatching = journals.some((j) => j.name.toUpperCase().startsWith(char))
              return (
                <button
                  key={char}
                  disabled={!hasMatching}
                  onClick={() => select(char)}
                  className={`h-7 w-8 rounded-md transition-colors ${
                    selectedLetter === char
                      ? 'bg-primary text-white'
                      : hasMatching
                      ? 'text-ink-secondary hover:bg-body hover:text-primary'
                      : 'cursor-not-allowed text-ink-muted/30'
                  }`}
                >
                  {char}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   ICONS
   ========================================================================= */

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`h-3.5 w-3.5 ${className ?? ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
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

function FileIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
      <path d="M14 2v6h6M9 13h6M9 17h6" />
    </svg>
  )
}

function BooksIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function LightbulbIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 2z" />
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