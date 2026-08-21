import {
  Plus,
  ArrowLeft,
  ArrowRight,
  Save,
  AlertCircle,
} from 'lucide-react'
import { AuthorCard } from './AuthorCard'
import type { Author, SubmissionDraft } from './types'

interface StepAuthorsProps {
  draft: SubmissionDraft
  updateAuthor: (id: number, patch: Partial<Author>) => void
  addAuthor: () => void
  removeAuthor: (id: number) => void
  moveAuthor: (id: number, dir: -1 | 1) => void
  showErrors: boolean
  onPrevious: () => void
  onSave: () => void
  onSaveContinue: () => void
}

function isAuthorComplete(author: Author): boolean {
  return (
    author.email.trim() !== '' &&
    author.firstName.trim() !== '' &&
    author.lastName.trim() !== '' &&
    author.affiliations.length > 0
  )
}

export function StepAuthors({
  draft,
  updateAuthor,
  addAuthor,
  removeAuthor,
  moveAuthor,
  showErrors,
  onPrevious,
  onSave,
  onSaveContinue,
}: StepAuthorsProps) {
  const completeAuthorsCount = draft.authors.filter(isAuthorComplete).length
  const allComplete = draft.authors.length > 0 && draft.authors.every(isAuthorComplete)

  return (
    <div className="space-y-6">
      {/* Header Guidance */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
            Authors and Contributors
          </h3>
          <p className="text-xs text-ink-muted">
            All authors who contributed substantially to conception, acquisition of data, or drafting must be listed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-body px-3 py-1 text-xs font-semibold text-ink-secondary border border-border">
            {completeAuthorsCount} of {draft.authors.length} complete
          </span>
        </div>
      </div>

      {/* Author Cards List */}
      <div className="space-y-4">
        {draft.authors.map((author, index) => (
          <AuthorCard
            key={author.id}
            author={author}
            index={index}
            total={draft.authors.length}
            onChange={(patch) => updateAuthor(author.id, patch)}
            onRemove={() => removeAuthor(author.id)}
            onMove={(dir) => moveAuthor(author.id, dir)}
            showErrors={showErrors}
          />
        ))}
      </div>

      {/* Add Author Button */}
      <button
        type="button"
        onClick={addAuthor}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-white py-4 text-xs font-bold text-primary transition-all hover:border-primary hover:bg-primary-tint/30 shadow-2xs"
      >
        <Plus className="h-4 w-4" />
        Add Co-Author
      </button>

      {showErrors && !allComplete && (
        <div className="rounded-xl border border-danger/20 bg-red-50/50 p-3.5 text-xs text-danger flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Please complete all author details (name, email, and at least one affiliation).</span>
        </div>
      )}

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
