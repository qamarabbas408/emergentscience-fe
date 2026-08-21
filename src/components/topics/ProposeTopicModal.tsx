import { useState } from 'react'
import { TOPIC_DISCIPLINES } from '../../data/topicsData'

interface ProposeTopicModalProps {
  onClose: () => void
  onSuccess: (proposalTitle: string) => void
}

export function ProposeTopicModal({ onClose, onSuccess }: ProposeTopicModalProps) {
  const [title, setTitle] = useState('')
  const [discipline, setDiscipline] = useState<string>(TOPIC_DISCIPLINES[1])
  const [leadEditor, setLeadEditor] = useState('')
  const [affiliation, setAffiliation] = useState('')
  const [email, setEmail] = useState('')
  const [orcid, setOrcid] = useState('')
  const [coEditors, setCoEditors] = useState<{ name: string; affiliation: string }[]>([
    { name: '', affiliation: '' },
  ])
  const [journals, setJournals] = useState<string[]>([
    'Frontiers in Artificial Intelligence',
    'Applied Sciences & Computing',
  ])
  const [abstract, setAbstract] = useState('')
  const [targetArticles, setTargetArticles] = useState('20')
  const [submitting, setSubmitting] = useState(false)

  const addCoEditor = () => {
    setCoEditors([...coEditors, { name: '', affiliation: '' }])
  }

  const updateCoEditor = (index: number, field: 'name' | 'affiliation', val: string) => {
    const updated = [...coEditors]
    updated[index][field] = val
    setCoEditors(updated)
  }

  const removeCoEditor = (index: number) => {
    if (coEditors.length <= 1) return
    setCoEditors(coEditors.filter((_, i) => i !== index))
  }

  const availableJournals = [
    'Frontiers in Artificial Intelligence',
    'Applied Sciences & Computing',
    'Frontiers in Aging Neuroscience',
    'Metals & Materials',
    'Biomedicines & Oncology',
    'Remote Sensing & Geomatics',
    'Sustainable Energy Materials',
    'Digital Medicine & Health Informatics',
  ]

  const toggleJournal = (j: string) => {
    if (journals.includes(j)) {
      if (journals.length > 1) {
        setJournals(journals.filter((item) => item !== j))
      }
    } else {
      setJournals([...journals, j])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !leadEditor.trim() || !email.trim() || !abstract.trim()) {
      alert('Please fill out all required fields marked with *')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      onSuccess(title)
      onClose()
    }, 600)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative my-8 w-full max-w-3xl rounded-2xl border border-border bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-tint text-primary font-bold">
              <LightbulbIcon />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">Propose a Research Topic</h2>
              <p className="text-xs text-ink-muted">
                Lead an interdisciplinary special issue across participating Emergent Science journals.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-ink-muted hover:bg-slate-200/60 hover:text-ink transition-colors"
            aria-label="Close dialog"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Topic Overview */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              1. Topic Title &amp; Discipline
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">
                Proposed Research Topic Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Next-Generation Perovskite Photovoltaics for Extreme Environments"
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink">
                  Primary Discipline <span className="text-red-600">*</span>
                </label>
                <select
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {TOPIC_DISCIPLINES.filter((d) => d !== 'All Disciplines').map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink">Target Article Count</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={targetArticles}
                  onChange={(e) => setTargetArticles(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Lead Guest Editor */}
          <div className="space-y-4 border-t border-border pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              2. Lead Guest Editor Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink">
                  Full Name &amp; Academic Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={leadEditor}
                  onChange={(e) => setLeadEditor(e.target.value)}
                  placeholder="e.g. Prof. Dr. Elena Rostova"
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink">
                  Institutional Affiliation <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                  placeholder="e.g. ETH Zürich, Department of Physics, Switzerland"
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink">
                  Institutional Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. elena.rostova@phys.ethz.ch"
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink">ORCID iD (Optional)</label>
                <input
                  type="text"
                  value={orcid}
                  onChange={(e) => setOrcid(e.target.value)}
                  placeholder="0000-0002-XXXX-XXXX"
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Co-Editors */}
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                3. Proposed Co-Editors (1–4 recommended)
              </h3>
              <button
                type="button"
                onClick={addCoEditor}
                className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1"
              >
                + Add Co-Editor
              </button>
            </div>

            {coEditors.map((ce, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-border">
                <div className="flex-1 grid gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder={`Co-Editor #${idx + 1} Name`}
                    value={ce.name}
                    onChange={(e) => updateCoEditor(idx, 'name', e.target.value)}
                    className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-ink outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Institution & Country"
                    value={ce.affiliation}
                    onChange={(e) => updateCoEditor(idx, 'affiliation', e.target.value)}
                    className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-ink outline-none focus:border-primary"
                  />
                </div>
                {coEditors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCoEditor(idx)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Remove co-editor"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Section 4: Participating Journals Selection */}
          <div className="space-y-3 border-t border-border pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              4. Participating Journals (Cross-Publishing)
            </h3>
            <p className="text-xs text-ink-muted">
              Select which Emergent Science journals should cross-publish articles within this Research Topic:
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {availableJournals.map((j) => {
                const selected = journals.includes(j)
                return (
                  <button
                    key={j}
                    type="button"
                    onClick={() => toggleJournal(j)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all ${
                      selected
                        ? 'border-primary bg-primary-tint/60 text-primary font-bold'
                        : 'border-border bg-white text-ink-secondary hover:border-slate-300'
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        selected ? 'border-primary bg-primary text-white text-[10px]' : 'border-slate-300'
                      }`}
                    >
                      {selected ? '✓' : ''}
                    </span>
                    <span className="truncate">{j}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 5: Topic Scope & Abstract */}
          <div className="space-y-2 border-t border-border pt-4">
            <label className="text-xs font-bold text-ink flex items-center justify-between">
              <span>
                Topic Scope &amp; Call for Papers Overview <span className="text-red-600">*</span>
              </span>
              <span className="text-[11px] font-normal text-ink-muted">Minimum 100 characters</span>
            </label>
            <textarea
              required
              rows={4}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Outline the scientific rationale, key sub-themes, target methodologies, and importance to the global research community..."
              className="w-full rounded-xl border border-border bg-white p-3 text-sm text-ink outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2 text-xs font-bold text-ink-secondary hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting Proposal...' : 'Submit Topic Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function LightbulbIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6M10 22h4" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
