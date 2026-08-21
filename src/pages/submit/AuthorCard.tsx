import { useState, useMemo, type KeyboardEvent } from 'react'
import {
  Building2,
  Mail,
  MoveUp,
  MoveDown,
  Trash2,
  Plus,
  X,
  AlertCircle,
  Search,
  Star,
} from 'lucide-react'
import { AFFILIATIONS, TITLE_OPTIONS, type Author, type NameTitle } from './types'

interface AuthorCardProps {
  author: Author
  index: number
  total: number
  onChange: (patch: Partial<Author>) => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
  showErrors: boolean
}

export function AuthorCard({
  author,
  index,
  total,
  onChange,
  onRemove,
  onMove,
  showErrors,
}: AuthorCardProps) {
  const [affiliationQuery, setAffiliationQuery] = useState('')
  const [affiliationOpen, setAffiliationOpen] = useState(false)

  const isLead = index === 0

  const matchingAffiliations = useMemo(() => {
    return AFFILIATIONS.filter((aff) =>
      aff.toLowerCase().includes(affiliationQuery.toLowerCase()),
    ).filter((aff) => !author.affiliations.includes(aff))
  }, [affiliationQuery, author.affiliations])

  const addAffiliation = (aff: string) => {
    const clean = aff.trim()
    if (!clean) return
    if (!author.affiliations.includes(clean)) {
      onChange({ affiliations: [...author.affiliations, clean] })
    }
    setAffiliationQuery('')
    setAffiliationOpen(false)
  }

  const removeAffiliation = (aff: string) => {
    onChange({ affiliations: author.affiliations.filter((a) => a !== aff) })
  }

  const handleAffiliationKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (affiliationQuery.trim()) {
        addAffiliation(affiliationQuery.trim())
      }
    }
  }

  const missingNames =
    showErrors && (author.firstName.trim() === '' || author.lastName.trim() === '')
  const missingEmail = showErrors && author.email.trim() === ''
  const missingAffiliation = showErrors && author.affiliations.length === 0

  return (
    <div
      className={`rounded-2xl border bg-body/40 p-5 transition-all sm:p-6 ${
        isLead ? 'border-primary/30 ring-1 ring-primary/10' : 'border-border'
      }`}
    >
      {/* Author Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
              isLead ? 'bg-primary text-white' : 'bg-white text-ink-secondary border border-border'
            }`}
          >
            {index + 1}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-ink">
                {author.firstName || author.lastName
                  ? `${author.title} ${author.firstName} ${author.lastName}`.trim()
                  : `Author #${index + 1}`}
              </span>
              {isLead && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                  Lead Author
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            title="Move author up"
            aria-label="Move author up"
            className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-white hover:text-primary disabled:opacity-25"
          >
            <MoveUp className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            title="Move author down"
            aria-label="Move author down"
            className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-white hover:text-primary disabled:opacity-25"
          >
            <MoveDown className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onRemove}
            disabled={total === 1}
            title="Delete author"
            aria-label="Delete author"
            className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-red-50 hover:text-danger disabled:opacity-25"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="mt-4 space-y-4">
        {/* Name Grid */}
        <div className="grid gap-3 sm:grid-cols-12">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary">
              Title
            </label>
            <select
              value={author.title}
              onChange={(e) => onChange({ title: e.target.value as NameTitle })}
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-xs font-semibold text-ink outline-none focus:border-primary"
            >
              {TITLE_OPTIONS.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4">
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary">
              First Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={author.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              placeholder="First name"
              className={`mt-1 w-full rounded-xl border bg-white px-3 py-2.5 text-xs outline-none focus:border-primary ${
                showErrors && !author.firstName.trim() ? 'border-danger' : 'border-border'
              }`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary">
              Middle
            </label>
            <input
              type="text"
              value={author.middleName}
              onChange={(e) => onChange({ middleName: e.target.value })}
              placeholder="Initial"
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-xs outline-none focus:border-primary"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary">
              Last Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={author.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              placeholder="Last name"
              className={`mt-1 w-full rounded-xl border bg-white px-3 py-2.5 text-xs outline-none focus:border-primary ${
                showErrors && !author.lastName.trim() ? 'border-danger' : 'border-border'
              }`}
            />
          </div>
        </div>

        {missingNames && (
          <p className="text-xs font-semibold text-danger flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Please provide both first and last name
          </p>
        )}

        {/* Email & Institutional Email */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary">
              Primary Email <span className="text-danger">*</span>
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
              <input
                type="email"
                value={author.email}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder="author@institution.edu"
                className={`w-full rounded-xl border bg-white py-2.5 pl-9 pr-3 text-xs outline-none focus:border-primary ${
                  missingEmail ? 'border-danger' : 'border-border'
                }`}
              />
            </div>
            {missingEmail && (
              <p className="mt-1 text-xs font-semibold text-danger flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Email address is required
              </p>
            )}
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary">
              Institutional Email <span className="text-xs font-normal text-ink-muted">(Optional)</span>
            </label>
            <div className="relative mt-1">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
              <input
                type="email"
                value={author.institutionalEmail}
                onChange={(e) => onChange({ institutionalEmail: e.target.value })}
                placeholder="official.id@university.edu"
                className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-3 text-xs outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Corresponding Author Toggle */}
        <div className="pt-1">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:border-primary/40">
            <input
              type="checkbox"
              checked={author.isCorresponding}
              onChange={(e) => onChange({ isCorresponding: e.target.checked })}
              className="h-4 w-4 rounded accent-primary"
            />
            <span className="flex items-center gap-1.5">
              <Star
                className={`h-3.5 w-3.5 ${author.isCorresponding ? 'text-amber-500 fill-amber-500' : 'text-ink-muted'}`}
              />
              Designate as Corresponding Author for peer review correspondence
            </span>
          </label>
        </div>

        {/* Affiliations Multi-select & Search */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary">
              Institutional Affiliations <span className="text-danger">*</span>
            </label>
            <span className="text-[11px] text-ink-muted">
              {author.affiliations.length} added
            </span>
          </div>

          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
            <input
              type="text"
              value={affiliationQuery}
              onChange={(e) => {
                setAffiliationQuery(e.target.value)
                setAffiliationOpen(true)
              }}
              onFocus={() => setAffiliationOpen(true)}
              onKeyDown={handleAffiliationKey}
              placeholder="Search university / research institute or type custom affiliation and press Enter..."
              className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-4 text-xs outline-none placeholder:text-ink-muted/60 focus:border-primary"
            />

            {/* Autocomplete Dropdown */}
            {affiliationOpen && (
              <div
                className="absolute left-0 top-full z-20 mt-1.5 max-h-52 w-full overflow-y-auto rounded-2xl border border-border bg-white p-1.5 shadow-card"
                onMouseLeave={() => setAffiliationOpen(false)}
              >
                {matchingAffiliations.length > 0 ? (
                  matchingAffiliations.map((aff) => (
                    <button
                      key={aff}
                      type="button"
                      onClick={() => addAffiliation(aff)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs text-ink-secondary hover:bg-primary-tint hover:text-primary transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 shrink-0 text-ink-muted" />
                        {aff}
                      </span>
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center">
                    <p className="text-xs text-ink-muted">No exact pre-configured match.</p>
                    {affiliationQuery.trim() && (
                      <button
                        type="button"
                        onClick={() => addAffiliation(affiliationQuery.trim())}
                        className="mt-2 rounded-xl bg-primary-tint px-4 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        Add “{affiliationQuery}” as custom affiliation
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Affiliation Badges */}
          {author.affiliations.length > 0 ? (
            <ul className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {author.affiliations.map((aff) => (
                <li
                  key={aff}
                  className="flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary-tint/80 px-3 py-1 text-xs font-medium text-primary shadow-2xs"
                >
                  <Building2 className="h-3 w-3 shrink-0" />
                  <span className="max-w-[340px] truncate">{aff}</span>
                  <button
                    type="button"
                    onClick={() => removeAffiliation(aff)}
                    aria-label={`Remove affiliation ${aff}`}
                    className="rounded-full p-0.5 text-primary/60 hover:bg-primary/20 hover:text-primary transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            missingAffiliation && (
              <p className="mt-1.5 text-xs font-semibold text-danger flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Please attach at least one institutional affiliation
              </p>
            )
          )}
        </div>
      </div>
    </div>
  )
}
