import { ArrowLeft, Save, Check, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { SubmissionDraft } from './types'

interface StepStatementsProps {
  draft: SubmissionDraft
  update: <K extends keyof SubmissionDraft>(key: K, value: SubmissionDraft[K]) => void
  showErrors: boolean
  onPrevious: () => void
  onSave: () => void
  onSaveContinue: () => void
}

const STATEMENTS_CONFIG: {
  key: keyof SubmissionDraft['statements']
  title: string
  label: string
}[] = [
  {
    key: 'notUnderConsideration',
    title: 'Originality & Exclusivity',
    label:
      'This manuscript is an original work, has not been published previously, and is not currently under consideration for publication elsewhere.',
  },
  {
    key: 'adheresPolicies',
    title: 'Data Sharing & Research Integrity',
    label:
      'The manuscript adheres strictly to Emergent Science open data, code availability, and research ethics policies, including protocol preregistration where applicable.',
  },
  {
    key: 'consents',
    title: 'Author & Participant Consents',
    label:
      'All co-authors have reviewed and approved the manuscript. Required institutional review board (IRB) approvals and informed consent were obtained for human and animal subjects.',
  },
  {
    key: 'acceptsTerms',
    title: 'Open Access Licensing & Publication Terms',
    label:
      'I agree to publish under the Creative Commons CC-BY 4.0 Open Access license and accept the Emergent Science Terms & Conditions upon editorial acceptance.',
  },
]

export function StepStatements({
  draft,
  update,
  showErrors,
  onPrevious,
  onSave,
  onSaveContinue,
}: StepStatementsProps) {
  const allChecked = Object.values(draft.statements).every(Boolean)

  const toggleAll = () => {
    const nextState = !allChecked
    update('statements', {
      notUnderConsideration: nextState,
      adheresPolicies: nextState,
      consents: nextState,
      acceptsTerms: nextState,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
            Declarations, Ethics &amp; Legal Terms
          </h3>
          <p className="text-xs text-ink-muted">
            Please review and certify the following statements on behalf of all contributing authors.
          </p>
        </div>

        <button
          type="button"
          onClick={toggleAll}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold text-ink-secondary hover:border-primary hover:text-primary transition-colors self-start sm:self-auto"
        >
          <Check className="h-3.5 w-3.5" />
          {allChecked ? 'Uncheck All' : 'Agree & Check All'}
        </button>
      </div>

      {/* Checkbox Cards */}
      <div className="space-y-3">
        {STATEMENTS_CONFIG.map((item) => {
          const isChecked = draft.statements[item.key]

          return (
            <label
              key={item.key}
              className={`flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 transition-all ${
                isChecked
                  ? 'border-primary/40 bg-primary-tint/30 shadow-2xs'
                  : 'border-border bg-body/40 hover:border-ink-muted/30 hover:bg-body/80'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) =>
                  update('statements', {
                    ...draft.statements,
                    [item.key]: e.target.checked,
                  })
                }
                className="mt-1 h-4 w-4 shrink-0 rounded accent-primary"
              />

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-ink">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
                  {item.label}
                </p>
              </div>
            </label>
          )
        })}
      </div>

      {showErrors && !allChecked && (
        <div className="rounded-xl border border-danger/20 bg-red-50/50 p-3.5 text-xs text-danger flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>All declaration statements must be accepted before your manuscript can be submitted.</span>
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
            Review &amp; Submit
            <CheckCircle2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
