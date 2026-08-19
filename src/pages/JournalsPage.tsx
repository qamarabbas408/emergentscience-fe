import { useRef, useState } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { appRoutes } from '../appRoutes'

interface Journal {
  name: string
  abbr: string
  tagline: string
  editor: string
  color: string
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

type Scope = 'all' | 'articles' | 'journals' | 'topics' | 'authors'

const SCOPES: { key: Scope; label: string }[] = [
  { key: 'all', label: 'All Science' },
  { key: 'articles', label: 'Articles' },
  { key: 'journals', label: 'Journals' },
  { key: 'topics', label: 'Research Topics' },
  { key: 'authors', label: 'Authors & Editors' },
]

function matchesScope(journal: Journal, scope: Scope, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  switch (scope) {
    case 'articles':
      return journal.tagline.toLowerCase().includes(q)
    case 'journals':
      return journal.name.toLowerCase().includes(q)
    case 'topics':
      return journal.tagline.toLowerCase().includes(q)
    case 'authors':
      return journal.editor.toLowerCase().includes(q)
    default:
      return (
        journal.name.toLowerCase().includes(q) ||
        journal.tagline.toLowerCase().includes(q) ||
        journal.editor.toLowerCase().includes(q)
      )
  }
}

export function JournalsPage() {
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<Scope>('all')
  const [journalFilter, setJournalFilter] = useState('')
  const resultsRef = useRef<HTMLDivElement>(null)

  const filtered = JOURNALS.filter(
    (journal) =>
      matchesScope(journal, scope, query) &&
      (!journalFilter || journal.name === journalFilter),
  )

  const hasFilter = Boolean(query.trim()) || journalFilter !== ''

  const scrollToResults = () => resultsRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div>
      <Header />

      <main>
        <section className="relative overflow-hidden bg-body">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(0,59,222,0.08),transparent)]" />

          <div className="relative px-6 py-12 lg:py-16">
            <div className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
              <div className="p-6 sm:p-10 lg:p-12">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-tint px-3 py-1 text-xs font-bold text-primary-deep">
                  <StarIcon />
                  Open Access Academic Publishing
                </span>

                <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
                  Discover Open-Access Research Across All Fields
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-secondary sm:text-base">
                  EmergentSci. is a leading academic publisher. We make science open through
                  rigorous peer review and community-led research topics.
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {SCOPES.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setScope(s.key)}
                      className={`rounded-full px-4 py-2 text-xs font-bold transition-colors sm:text-sm ${
                        scope === s.key
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-primary-tint text-primary hover:bg-primary/15'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-3 rounded-full border-2 border-border bg-white px-5 py-3 transition-all focus-within:border-red-600 focus-within:ring-4 focus-within:ring-red-500/10 sm:flex-row sm:items-center">
                  <div className="flex flex-1 items-center gap-3">
                    <SearchIcon />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search 250,000+ peer-reviewed articles, topics, DOIs…"
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted"
                    />
                  </div>
                  <div className="flex items-center gap-3 sm:border-l sm:border-border sm:pl-4">
                    <select
                      value={journalFilter}
                      onChange={(e) => setJournalFilter(e.target.value)}
                      className="max-w-44 cursor-pointer bg-transparent text-sm font-semibold text-ink-secondary outline-none"
                      aria-label="Filter by journal"
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
                      className="hidden shrink-0 rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 sm:block"
                    >
                      Search
                    </button>
                  </div>
                </div>

                <button
                  onClick={scrollToResults}
                  className="mt-3 w-full rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 sm:hidden"
                >
                  Search
                </button>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-muted">
                    <BoltIcon />
                    Trending
                  </span>
                  {TRENDING_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => {
                        setQuery(topic)
                        setScope('topics')
                        scrollToResults()
                      }}
                      className="rounded-full border border-border bg-body px-3 py-1.5 text-xs font-semibold text-ink-secondary transition-colors hover:border-primary hover:bg-primary-tint hover:text-primary"
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 border-t border-border pt-8 sm:grid-cols-3">
                  <a
                    href={appRoutes.submit}
                    className="group flex items-start gap-3 rounded-card border border-border p-4 transition-all hover:border-primary hover:bg-primary-tint/40 hover:shadow-card"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <FileIcon />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink">Submit Manuscript</span>
                      <span className="mt-0.5 block text-xs text-ink-muted">Direct submission flow</span>
                    </span>
                  </a>
                  <button
                    onClick={scrollToResults}
                    className="group flex items-start gap-3 rounded-card border border-border p-4 text-left transition-all hover:border-primary hover:bg-primary-tint/40 hover:shadow-card"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <BooksIcon />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink">Browse Journals A–Z</span>
                      <span className="mt-0.5 block text-xs text-ink-muted">Directory below</span>
                    </span>
                  </button>
                  <a
                    href={appRoutes.topics}
                    className="group flex items-start gap-3 rounded-card border border-border p-4 transition-all hover:border-primary hover:bg-primary-tint/40 hover:shadow-card"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <LightbulbIcon />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink">Propose Research Topic</span>
                      <span className="mt-0.5 block text-xs text-ink-muted">Guest editor call</span>
                    </span>
                  </a>
                </div>
              </div>

              <div ref={resultsRef} className="scroll-mt-20 border-t border-border bg-body/60 p-6 sm:p-10 lg:p-12">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-medium tracking-tight text-ink">All Journals</h2>
                  <span className="rounded-full bg-primary-tint px-2.5 py-1 text-xs font-bold text-primary">
                    {filtered.length} {filtered.length === 1 ? 'journal' : 'journals'}
                  </span>
                  <div className="ml-auto flex items-center gap-2 text-xs text-ink-muted">
                    {query.trim() && (
                      <span className="hidden sm:inline">
                        Showing results for “{query.trim()}”
                      </span>
                    )}
                    {hasFilter && (
                      <button
                        onClick={() => {
                          setQuery('')
                          setScope('all')
                          setJournalFilter('')
                        }}
                        className="font-bold text-primary hover:text-primary-hover"
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-8 grid gap-10 lg:grid-cols-3">
                  <div className="space-y-5 lg:col-span-2">
                    {filtered.length === 0 ? (
                      <p className="rounded-card border border-border bg-surface p-10 text-center text-sm text-ink-muted">
                        No matches to your query could be found. Try another search term.
                      </p>
                    ) : (
                      filtered.map((journal) => <JournalCard key={journal.name} journal={journal} />)
                    )}
                  </div>

                  <aside className="lg:col-span-1">
                    <div className="rounded-card border border-border bg-surface p-6">
                      <h3 className="text-lg font-medium tracking-tight text-ink">Most viewed</h3>
                      <div className="mt-5 space-y-5">
                        {MOST_VIEWED.map((article) => (
                          <article key={article.title}>
                            <a href="#" className="group">
                              <p className="text-[11px] font-bold uppercase tracking-wider text-sky">
                                {article.type}
                              </p>
                              <h4 className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-ink group-hover:text-primary">
                                {article.title}
                              </h4>
                              <p className="mt-1 line-clamp-1 text-xs text-ink-muted">
                                {article.authors}
                              </p>
                              <p className="mt-2 text-xs font-semibold text-primary">
                                {article.journal}
                                <span className="ml-2 font-normal text-ink-muted">
                                  {article.views} views
                                  {article.citations ? ` · ${article.citations} citation` : ''}
                                </span>
                              </p>
                            </a>
                          </article>
                        ))}
                      </div>
                      <a
                        href="#"
                        className="mt-5 inline-block text-sm font-bold text-primary hover:text-primary-hover"
                      >
                        See all articles →
                      </a>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function JournalCard({ journal }: { journal: Journal }) {
  return (
    <article className="flex flex-col gap-5 rounded-card border border-border bg-white p-6 transition-shadow duration-300 hover:shadow-card sm:flex-row">
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${journal.color}`}
      >
        {journal.abbr}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-medium text-ink">{journal.name}</h3>
          {journal.isNew && (
            <span className="rounded-full bg-primary-tint px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              New
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-sm font-light leading-relaxed text-ink-secondary">
          {journal.tagline}
        </p>
        {journal.editor && (
          <p className="mt-2 text-xs text-ink-muted">
            <span className="font-semibold text-ink-secondary">Field chief editor</span> ·{' '}
            {journal.editor}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4">
          {journal.sections !== undefined && (
            <Metric label="Sections" value={journal.sections.toString()} />
          )}
          {journal.articles !== undefined && (
            <Metric label="Articles" value={journal.articles.toLocaleString('en-US')} />
          )}
          {journal.views && <Metric label="Article views" value={journal.views} />}
          {journal.citations && <Metric label="Citations" value={journal.citations} />}
          {journal.impactFactor && <Metric label="IF" value={journal.impactFactor} />}
          {journal.citescore && <Metric label="Citescore" value={journal.citescore} />}
        </div>
      </div>
    </article>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="text-sm font-semibold text-ink">{value}</p>
    </div>
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