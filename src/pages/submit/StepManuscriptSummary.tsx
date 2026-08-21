import { useState, type KeyboardEvent } from 'react'
import { Tag, X, ArrowLeft, ArrowRight, Save, AlertCircle } from 'lucide-react'
import {
  TITLE_CHAR_LIMIT,
  type ArticleTypeDetail,
  type SubmissionDraft,
} from './types'

interface StepManuscriptSummaryProps {
  draft: SubmissionDraft
  update: <K extends keyof SubmissionDraft>(key: K, value: SubmissionDraft[K]) => void
  showErrors: boolean
  onPrevious: () => void
  onSave: () => void
  onSaveContinue: () => void
  summaryWordLimit: number
  selectedArticleType?: ArticleTypeDetail
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function StepManuscriptSummary({
  draft,
  update,
  showErrors,
  onPrevious,
  onSave,
  onSaveContinue,
  summaryWordLimit,
}: StepManuscriptSummaryProps) {
  const [keywordInput, setKeywordInput] = useState('')

  const charsCount = draft.title.length
  const charsLeft = Math.max(0, TITLE_CHAR_LIMIT - charsCount)
  const titleTooLong = charsCount > TITLE_CHAR_LIMIT

  const words = wordCount(draft.summary)
  const wordsLeft = Math.max(0, summaryWordLimit - words)
  const summaryTooLong = words > summaryWordLimit

  const addKeyword = (tag: string) => {
    const clean = tag.trim().replace(/^,+|,+$/g, '')
    if (!clean) return
    const current = draft.keywords || []
    if (!current.includes(clean) && current.length < 8) {
      update('keywords', [...current, clean])
    }
    setKeywordInput('')
  }

  const removeKeyword = (tag: string) => {
    update('keywords', (draft.keywords || []).filter((k) => k !== tag))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addKeyword(keywordInput)
    }
  }

  return (
    <div className="space-y-8">
      {/* Manuscript Title */}
      <div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink">
            <span>Manuscript Title</span>
            <span className="text-danger">*</span>
          </label>

          <span
            className={`text-xs font-semibold ${
              titleTooLong ? 'text-danger' : charsLeft <= 50 ? 'text-warning' : 'text-ink-muted'
            }`}
          >
            {charsLeft} characters remaining
          </span>
        </div>

        <p className="mt-1 text-xs text-ink-muted">
          Title should be concise, informative, and reflect the core contribution of the study. Avoid non-standard acronyms.
        </p>

        <input
          type="text"
          value={draft.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="e.g. Deep Learning Approaches for Real-Time Acoustic Noise Cancellation in Urban Environments"
          className={`mt-2.5 w-full rounded-2xl border bg-white px-4 py-3.5 text-sm font-medium text-ink outline-none transition-colors placeholder:text-ink-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/10 ${
            showErrors && (!draft.title.trim() || titleTooLong) ? 'border-danger' : 'border-border'
          }`}
        />

        {showErrors && !draft.title.trim() && (
          <p className="mt-1.5 text-xs font-semibold text-danger flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Please provide a manuscript title
          </p>
        )}
        {titleTooLong && (
          <p className="mt-1.5 text-xs font-semibold text-danger flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Title cannot exceed {TITLE_CHAR_LIMIT} characters
          </p>
        )}
      </div>

      {/* Manuscript Summary / Abstract */}
      <div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink">
            <span>Abstract / Manuscript Summary</span>
            <span className="text-danger">*</span>
          </label>

          <span
            className={`text-xs font-semibold ${
              summaryTooLong ? 'text-danger' : wordsLeft <= 100 ? 'text-warning' : 'text-ink-muted'
            }`}
          >
            {wordsLeft} words remaining
          </span>
        </div>

        <p className="mt-1 text-xs text-ink-muted">
          A self-contained summary of the background, methodology, primary findings, and scientific significance of the work.
        </p>

        <textarea
          value={draft.summary}
          onChange={(e) => update('summary', e.target.value)}
          placeholder="Background: ...&#10;Methods: ...&#10;Results: ...&#10;Conclusion: ..."
          rows={7}
          className={`mt-2.5 w-full rounded-2xl border bg-white p-4 text-sm leading-relaxed outline-none transition-colors placeholder:text-ink-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/10 ${
            showErrors && (!draft.summary.trim() || summaryTooLong)
              ? 'border-danger'
              : 'border-border'
          }`}
        />

        {showErrors && !draft.summary.trim() && (
          <p className="mt-1.5 text-xs font-semibold text-danger flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Please provide a manuscript summary/abstract
          </p>
        )}
        {summaryTooLong && (
          <p className="mt-1.5 text-xs font-semibold text-danger flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Abstract exceeds maximum limit of {summaryWordLimit} words
          </p>
        )}
      </div>

      {/* Keywords Tagging */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink">
            <span>Keywords &amp; Scientific Indexing</span>
            <span className="text-xs font-normal text-ink-muted">(Up to 8 keywords)</span>
          </label>

          <span className="text-xs text-ink-muted font-medium">
            {(draft.keywords || []).length}/8 added
          </span>
        </div>

        <p className="mt-1 text-xs text-ink-muted">
          Add relevant disciplinary terms and keywords to optimize discoverability and reviewer matching.
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-white p-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
          {(draft.keywords || []).map((keyword) => (
            <span
              key={keyword}
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary-tint px-3 py-1 text-xs font-semibold text-primary shadow-2xs"
            >
              <Tag className="h-3 w-3" />
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                aria-label={`Remove keyword ${keyword}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {(draft.keywords || []).length < 8 && (
            <div className="flex flex-1 items-center gap-1 min-w-[200px]">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (keywordInput.trim()) addKeyword(keywordInput)
                }}
                placeholder="Type keyword and press Enter..."
                className="flex-1 bg-transparent px-2 py-1 text-xs outline-none placeholder:text-ink-muted/60"
              />
              {keywordInput.trim() && (
                <button
                  type="button"
                  onClick={() => addKeyword(keywordInput)}
                  className="rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-white shadow-2xs"
                >
                  Add
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Step Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-5 py-2 text-xs font-bold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Previous Step
        </button>

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
