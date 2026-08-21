import { useState } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  Send,
  Save,
  ChevronUp,
  X,
  ArrowUpRight,
} from 'lucide-react'
import type { MissingItem, StepKey } from './types'

interface QualityBarProps {
  percent: number
  items: MissingItem[]
  onSubmit: () => void
  onSaveDraft: () => void
  onJumpToSection: (stepKey: StepKey) => void
}

export function QualityBar({
  percent,
  items,
  onSubmit,
  onSaveDraft,
  onJumpToSection,
}: QualityBarProps) {
  const [checklistOpen, setChecklistOpen] = useState(false)

  const remainingItems = items.filter((i) => !i.isComplete)
  const isReady = remainingItems.length === 0

  const barColor =
    percent >= 100
      ? 'bg-success'
      : percent >= 75
      ? 'bg-primary'
      : percent >= 40
      ? 'bg-warning'
      : 'bg-danger'

  return (
    <>
      {/* Missing Items Popover / Drawer */}
      {checklistOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs"
          onClick={() => setChecklistOpen(false)}
        >
          <div
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-tint text-primary font-bold text-xs">
                  {percent}%
                </div>
                <h4 className="text-sm font-bold text-ink">Submission Checklist</h4>
              </div>

              <button
                type="button"
                onClick={() => setChecklistOpen(false)}
                className="rounded-full p-1.5 text-ink-muted hover:bg-body hover:text-ink transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onJumpToSection(item.stepKey)
                    setChecklistOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                    item.isComplete
                      ? 'border-border/60 bg-body/40 text-ink-muted'
                      : 'border-amber-200 bg-amber-50/50 text-ink hover:border-primary hover:bg-primary-tint/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.isComplete ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                    )}
                    <span
                      className={`truncate text-xs font-medium ${
                        item.isComplete ? 'line-through text-ink-muted' : 'text-ink font-semibold'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {!item.isComplete && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-primary shrink-0 ml-2">
                      Fix <ArrowUpRight className="h-3 w-3" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Bottom Bar */}
      <div className="sticky bottom-0 z-40 border-t border-border bg-white/95 shadow-card backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          {/* Readiness Meter */}
          <div className="flex min-w-[260px] flex-1 items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  Submission Readiness
                </span>
                <span className="font-bold text-ink">{percent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-body border border-border/80">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {/* Checklist Toggle Trigger */}
            <button
              type="button"
              onClick={() => setChecklistOpen((o) => !o)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                isReady
                  ? 'bg-success/10 text-success border border-success/20'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              {isReady ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Ready to submit</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{remainingItems.length} required action{remainingItems.length === 1 ? '' : 's'}</span>
                  <ChevronUp className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onSaveDraft}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
            >
              <Save className="h-3.5 w-3.5" />
              Save Draft
            </button>

            <button
              type="button"
              onClick={onSubmit}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-2 text-xs font-bold text-white shadow-2xs transition-all ${
                isReady
                  ? 'bg-primary hover:bg-primary-hover ring-2 ring-primary/20'
                  : 'bg-ink hover:bg-ink-secondary'
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              Submit Manuscript
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
