import { useState, useMemo } from 'react'
import {
  BookOpen,
  X,
  ArrowRight,
  Save,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react'
import {
  SCOPE_WORD_LIMIT,
  type ArticleTypeDetail,
  type JournalOption,
  type SubmissionDraft,
} from './types'
import { JournalPickerModal } from '../../components/JournalPickerModal'
import type { JournalOption as PickerJournalOption } from '../../components/JournalPickerModal'
import { UploadDropzone } from './UploadDropzone'

interface StepSubmissionDetailsProps {
  draft: SubmissionDraft
  update: <K extends keyof SubmissionDraft>(key: K, value: SubmissionDraft[K]) => void
  showErrors: boolean
  onSave: () => void
  onSaveContinue: () => void
  articleTypeNames: string[]
  selectedArticleType: ArticleTypeDetail | undefined
  journalOptions: JournalOption[]
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function StepSubmissionDetails({
  draft,
  update,
  showErrors,
  onSave,
  onSaveContinue,
  articleTypeNames,
  selectedArticleType,
  journalOptions,
}: StepSubmissionDetailsProps) {
  const [journalPickerOpen, setJournalPickerOpen] = useState(false)

  const pickerJournals = useMemo<PickerJournalOption[]>(
    () =>
      journalOptions.map((j) => ({
        name: j.name,
        abbr: j.abbr,
        color: j.color,
        domain: j.category,
        description: j.description,
        about: j.description,
        editorialBoard: [],
        specialties: j.section ? [j.section] : [],
      })),
    [journalOptions],
  )

  const selectedJournal = useMemo<JournalOption | undefined>(() => {
    if (!draft.journal) return undefined
    return journalOptions.find((j) => draft.journal.startsWith(j.name))
  }, [draft.journal, journalOptions])

  const scopeWords = wordCount(draft.scopeStatement)
  const scopeWordsLeft = Math.max(0, SCOPE_WORD_LIMIT - scopeWords)
  const scopeTooLong = scopeWords > SCOPE_WORD_LIMIT

  const hasEditable = draft.uploads.manuscript.some((f) => /\.(docx?|tex)$/i.test(f))
  const hasPdf = draft.uploads.manuscript.some((f) => /\.pdf$/i.test(f))
  const manuscriptValid = hasEditable && hasPdf

  const handleJournalSelect = (journal: PickerJournalOption, specialty: string) => {
    update('journal', `${journal.name} - ${specialty}`)
    setJournalPickerOpen(false)
  }

  return (
    <div className="space-y-8">
      {/* 1. Target Journal Selection */}
      <div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink">
            <span>Target Journal &amp; Section</span>
            <span className="text-danger">*</span>
          </label>

          {selectedJournal && (
            <button
              type="button"
              onClick={() => setJournalPickerOpen(true)}
              className="text-xs font-semibold text-primary hover:text-primary-hover hover:underline"
            >
              Change journal
            </button>
          )}
        </div>

        {selectedJournal ? (
          <div className="mt-2.5 rounded-2xl border border-primary/20 bg-primary-tint/30 p-5 transition-all">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-base font-black shadow-2xs ${selectedJournal.color}`}
                >
                  {selectedJournal.abbr}
                </span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted border border-border">
                      {selectedJournal.category}
                    </span>
                    {selectedJournal.impactFactor && (
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        IF {selectedJournal.impactFactor}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 text-base font-bold text-ink sm:text-lg">
                    {selectedJournal.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary">
                    Section: <span className="font-semibold">{selectedJournal.section}</span>
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
                    {selectedJournal.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => update('journal', '')}
                aria-label="Remove journal"
                className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-white hover:text-danger"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setJournalPickerOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setJournalPickerOpen(true)
              }
            }}
            className="mt-2.5 flex w-full cursor-pointer items-center justify-between rounded-2xl border-2 border-dashed border-border bg-body/50 px-5 py-4 text-center transition-all hover:border-primary hover:bg-white"
          >
            <div className="flex items-center gap-3 text-ink-secondary">
              <BookOpen className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-semibold text-ink">Select a journal and section</p>
                <p className="text-xs text-ink-muted">Choose from our peer-reviewed open access portfolio</p>
              </div>
            </div>
            <span className="rounded-full bg-primary px-4 py-1.5 text-[11px] font-bold text-white shadow-2xs">
              Browse Journals
            </span>
          </div>
        )}

        {showErrors && !draft.journal && (
          <p className="mt-2 text-xs font-semibold text-danger flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Please select a target journal for your submission
          </p>
        )}
      </div>

      {/* Journal Picker Modal (uses our existing modal, untouched UI) */}
      <JournalPickerModal
        open={journalPickerOpen}
        fallbackJournals={pickerJournals}
        onClose={() => setJournalPickerOpen(false)}
        onSelect={handleJournalSelect}
      />

      {/* 2. Article Type */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink">
          <span>Article Type</span>
          <span className="text-danger">*</span>
        </label>

        <div className="mt-2.5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {articleTypeNames.map((type) => {
            const isSelected = draft.articleType === type
            const detail = selectedArticleType
              ? type === selectedArticleType.name
                ? selectedArticleType
                : null
              : null
            return (
              <button
                key={type}
                type="button"
                onClick={() => update('articleType', type)}
                className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary-tint/40 shadow-xs ring-2 ring-primary/20'
                    : 'border-border bg-white hover:border-ink-muted/30 hover:bg-body/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-ink">{type}</span>
                    {isSelected ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <span className="h-4 w-4 rounded-full border border-border" />
                    )}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-ink-secondary line-clamp-3">
                    {detail?.description || 'Select this article type to configure'}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-2.5 text-[11px] text-ink-muted">
                  <span className="font-semibold text-ink">
                    Max {detail?.wordLimit?.toLocaleString() ?? '—'} words
                  </span>
                  <span>•</span>
                  <span>Max {detail?.figuresLimit ?? '—'} figures</span>
                </div>
              </button>
            )
          })}
        </div>

        {selectedArticleType && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary-tint/30 px-4 py-2.5 text-xs">
            <span className="font-semibold text-primary">
              Selected: <span className="font-bold text-ink">{selectedArticleType.name}</span>
            </span>
            <span className="text-ink-secondary">
              Review model:{' '}
              <span className="font-medium text-ink">{selectedArticleType.peerReviewType || 'Standard peer review'}</span>
            </span>
          </div>
        )}

        {showErrors && !draft.articleType && (
          <p className="mt-2 text-xs font-semibold text-danger flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Please select an article type
          </p>
        )}
      </div>

      {/* 3. Scope Justification Statement */}
      <div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink">
            <span>Scope Statement</span>
            <span className="text-danger">*</span>
          </label>

          <span
            className={`text-xs font-semibold ${
              scopeTooLong ? 'text-danger' : scopeWordsLeft <= 30 ? 'text-warning' : 'text-ink-muted'
            }`}
          >
            {scopeWordsLeft} words remaining
          </span>
        </div>

        <p className="mt-1 text-xs text-ink-muted">
          Briefly explain how this manuscript aligns with the aim and scope of the journal and section selected.
        </p>

        <textarea
          value={draft.scopeStatement}
          onChange={(e) => update('scopeStatement', e.target.value)}
          placeholder="Our study contributes to the Acoustic Materials section by demonstrating..."
          rows={3}
          className={`mt-2.5 w-full rounded-2xl border bg-white px-4 py-3.5 text-sm leading-relaxed outline-none transition-colors placeholder:text-ink-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/10 ${
            showErrors && (!draft.scopeStatement.trim() || scopeTooLong)
              ? 'border-danger'
              : 'border-border'
          }`}
        />

        {showErrors && !draft.scopeStatement.trim() && (
          <p className="mt-1.5 text-xs font-semibold text-danger flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Please provide a scope justification statement
          </p>
        )}
        {scopeTooLong && (
          <p className="mt-1.5 text-xs font-semibold text-danger flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Scope statement exceeds the limit of {SCOPE_WORD_LIMIT} words
          </p>
        )}
      </div>

      {/* 4. File Upload Section */}
      <div className="border-t border-border pt-6">
        <div className="mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
            Manuscript Files &amp; Uploads
          </h3>
          <p className="text-xs text-ink-muted">
            Emergent Science requires both an editable source version (Microsoft Word or LaTeX) and a generated PDF for peer review.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Main Manuscript (Word / LaTeX + PDF) */}
          <UploadDropzone
            title="Manuscript Source & PDF"
            hint="Upload both editable (DOC, DOCX, TeX) AND PDF versions"
            badgeText="Required"
            required
            acceptTypes=".doc,.docx,.tex,.pdf,.zip"
            files={draft.uploads.manuscript}
            onAdd={(names) =>
              update('uploads', { ...draft.uploads, manuscript: [...draft.uploads.manuscript, ...names] })
            }
            onRemove={(name) =>
              update('uploads', {
                ...draft.uploads,
                manuscript: draft.uploads.manuscript.filter((f) => f !== name),
              })
            }
            error={
              showErrors && !manuscriptValid
                ? 'Both an editable version (DOC/DOCX/TeX) and a PDF version are required.'
                : undefined
            }
            iconType="document"
          />

          {/* Figures */}
          <UploadDropzone
            title="High-Resolution Figures"
            hint="TIFF, PNG, JPEG or vector EPS; 300+ DPI recommended"
            badgeText="Optional"
            acceptTypes=".tif,.tiff,.jpg,.jpeg,.png,.eps,.pdf"
            files={draft.uploads.figures}
            onAdd={(names) =>
              update('uploads', { ...draft.uploads, figures: [...draft.uploads.figures, ...names] })
            }
            onRemove={(name) =>
              update('uploads', {
                ...draft.uploads,
                figures: draft.uploads.figures.filter((f) => f !== name),
              })
            }
            iconType="image"
          />

          {/* Supplementary Materials */}
          <UploadDropzone
            title="Supplementary Files"
            hint="Data sheets, code repositories, supplementary tables or audio/video"
            badgeText="Optional"
            files={draft.uploads.supplementary}
            onAdd={(names) =>
              update('uploads', {
                ...draft.uploads,
                supplementary: [...draft.uploads.supplementary, ...names],
              })
            }
            onRemove={(name) =>
              update('uploads', {
                ...draft.uploads,
                supplementary: draft.uploads.supplementary.filter((f) => f !== name),
              })
            }
            iconType="supplementary"
          />

          {/* Review-only Materials */}
          <UploadDropzone
            title="Confidential Reviewer Materials"
            hint="Non-public reviewer response letters or prior peer evaluations"
            badgeText="Optional"
            files={draft.uploads.reviewOnly}
            onAdd={(names) =>
              update('uploads', {
                ...draft.uploads,
                reviewOnly: [...draft.uploads.reviewOnly, ...names],
              })
            }
            onRemove={(name) =>
              update('uploads', {
                ...draft.uploads,
                reviewOnly: draft.uploads.reviewOnly.filter((f) => f !== name),
              })
            }
            iconType="document"
          />
        </div>
      </div>

      {/* Step Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <FileCheck className="h-4 w-4 text-primary" />
          <span>Files are virus-checked and encrypted in transit</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-tint px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            <Save className="h-3.5 w-3.5" />
            Save Draft
          </button>

          <button
            type="button"
            onClick={onSaveContinue}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-hover shadow-2xs"
          >
            Save &amp; Continue
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
