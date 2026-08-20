import { useEffect, useMemo, useRef, useState } from 'react'
import { EmptyState } from './EmptyState'

export interface JournalOption {
  name: string
  abbr: string
  color: string
  domain: string
  description: string
  about: string
  editorialBoard: string[]
  specialties: string[]
}

const JOURNAL_DOMAINS = [
  'All',
  'Engineering',
  'Health',
  'Humanities & Social Sciences',
  'Science',
  'Sustainability',
  'Young Minds',
]

const BANNER_GRADIENTS = [
  'from-sky-400 to-blue-600',
  'from-violet-400 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-amber-400 to-orange-500',
  'from-red-400 to-rose-600',
  'from-emerald-400 to-green-600',
  'from-pink-400 to-rose-500',
  'from-lime-400 to-green-500',
  'from-cyan-400 to-sky-600',
  'from-indigo-400 to-blue-600',
  'from-teal-400 to-emerald-600',
  'from-orange-400 to-amber-600',
  'from-rose-400 to-pink-600',
]

function bannerFor(abbr: string): string {
  let h = 0
  for (const c of abbr) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return BANNER_GRADIENTS[h % BANNER_GRADIENTS.length]
}

type DetailTab = 'journal' | 'about' | 'board'

interface JournalPickerModalProps {
  open: boolean
  onClose: () => void
  journals: JournalOption[]
  onSelect: (journal: JournalOption, specialty: string) => void
}

export function JournalPickerModal({
  open,
  onClose,
  journals,
  onSelect,
}: JournalPickerModalProps) {
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState('All')
  const [expanded, setExpanded] = useState<JournalOption | null>(null)
  const [tab, setTab] = useState<DetailTab>('journal')
  const [specialty, setSpecialty] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setDomain('All')
      setExpanded(null)
      setTab('journal')
      setSpecialty('')
      requestAnimationFrame(() => searchRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (expanded) setExpanded(null)
        else onClose()
      }
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, expanded, onClose])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return journals.filter((j) => {
      const matchesDomain = domain === 'All' || j.domain === domain
      const matchesQuery =
        !q ||
        j.name.toLowerCase().includes(q) ||
        j.specialties.some((s) => s.toLowerCase().includes(q))
      return matchesDomain && matchesQuery
    })
  }, [journals, domain, query])

  const activeExpanded =
    expanded && filtered.some((j) => j.name === expanded.name) ? expanded : null

  const expand = (journal: JournalOption) => {
    setExpanded(journal)
    setTab('journal')
    setSpecialty(journal.specialties[0] ?? '')
    requestAnimationFrame(() =>
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    )
  }

  const confirm = () => {
    if (activeExpanded && specialty) onSelect(activeExpanded, specialty)
  }

  const renderDetailPane = (journal: JournalOption) => (
    <div ref={detailRef} className="list-pop rounded-2xl border border-border bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-black shadow-2xs ${journal.color}`}
          >
            {journal.abbr}
          </span>
          <div>
            <p className="text-base font-bold text-ink">{journal.name}</p>
            <p className="text-[11px] font-semibold text-ink-muted">
              {journal.specialties.length} {journal.specialties.length === 1 ? 'specialty' : 'specialties'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(null)}
          aria-label="Collapse journal details"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
        >
          <XIcon />
        </button>
      </div>

      <div className="mt-4 flex gap-5 border-b border-border">
        {(
          [
            ['journal', 'Journal'],
            ['about', 'About'],
            ['board', 'Editorial Board'],
          ] as [DetailTab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 pb-2 text-xs font-bold transition-colors ${
              tab === key ? 'border-primary text-primary' : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 min-h-[60px] text-xs leading-relaxed text-ink-secondary">
        {tab === 'journal' && journal.description}
        {tab === 'about' && journal.about}
        {tab === 'board' && (
          <ul className="list-disc space-y-1 pl-4">
            {journal.editorialBoard.map((editor) => (
              <li key={editor}>{editor}</li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-ink">Select your specialty</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {journal.specialties.map((s) => (
          <label
            key={s}
            className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              specialty === s
                ? 'border-primary bg-primary-tint text-primary'
                : 'border-border text-ink-secondary hover:border-primary/40'
            }`}
          >
            <input
              type="radio"
              name="specialty"
              checked={specialty === s}
              onChange={() => setSpecialty(s)}
              className="accent-red-600"
            />
            {s}
          </label>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={confirm}
          className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700"
        >
          Select
        </button>
      </div>
    </div>
  )

  if (!open) return null

  return (
    <div
      className="overlay-fade fixed inset-0 z-50 bg-slate-950/60 sm:p-6"
      onClick={onClose}
    >
      <div
        className="modal-pop mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden bg-white sm:h-[92vh] sm:rounded-3xl sm:shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: title + close */}
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-8">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-ink">Select your journal</h2>
            <p className="mt-0.5 text-xs text-ink-muted">Search by journal name or specialty</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close journal picker"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
          >
            <XIcon />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-border px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-white px-4 py-3 transition-colors focus-within:border-primary">
            <SearchIcon />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search and select..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-ink-muted hover:text-ink"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-6 overflow-x-auto border-b border-border px-5 sm:px-8">
          {JOURNAL_DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className={`-mb-px whitespace-nowrap border-b-2 px-1 py-3 text-sm font-bold transition-colors ${
                domain === d
                  ? 'border-primary text-primary'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6 sm:px-8">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<SearchIcon />}
              title="No journals found"
              description="Try a different search or domain filter."
            />
          ) : (
            <div
              key={`${domain}-${query.trim().toLowerCase()}`}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((j) =>
                activeExpanded?.name === j.name ? (
                  <div key={j.name} className="sm:col-span-2 lg:col-span-3">
                    {renderDetailPane(j)}
                  </div>
                ) : (
                  <button
                    key={j.name}
                    onClick={() => expand(j)}
                    className={`list-pop group overflow-hidden rounded-xl border bg-white text-left transition-all duration-200 hover:border-primary/40 hover:shadow-lg active:scale-[0.98] ${
                      activeExpanded?.name === j.name
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border'
                    }`}
                  >
                    <span className={`block h-24 w-full bg-gradient-to-br ${bannerFor(j.abbr)}`}>
                      <span className="flex h-full items-end justify-between p-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-xs font-black text-white backdrop-blur-sm">
                          {j.abbr}
                        </span>
                        <span className="text-3xl font-black leading-none text-white/30">{j.abbr}</span>
                      </span>
                    </span>
                    <span className="flex items-center justify-between gap-2 p-3">
                      <span className="min-w-0 text-sm font-bold text-ink">{j.name}</span>
                      <span className="shrink-0 rounded-full bg-primary-tint px-2.5 py-1 text-[11px] font-bold text-primary">
                        {j.specialties.length} {j.specialties.length === 1 ? 'specialty' : 'specialties'}
                      </span>
                    </span>
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>
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

function XIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}