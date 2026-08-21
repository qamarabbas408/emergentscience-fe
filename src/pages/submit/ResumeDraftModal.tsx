import { useEffect } from 'react'
import { X, ArrowRight, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react'

interface ResumeDraftModalProps {
  onContinue: () => void
  onStartNew: () => void
  percent: number
  completedCount: number
  totalSections: number
  journalName?: string
  manuscriptTitle?: string
}

export function ResumeDraftModal({
  onContinue,
  onStartNew,
  percent,
  completedCount,
  totalSections,
  journalName,
  manuscriptTitle,
}: ResumeDraftModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onContinue()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onContinue])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      onClick={onContinue}
    >
      <div
        className="grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-3xl border border-border bg-white shadow-2xl md:grid-cols-12 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Brand Panel */}
        <div className="bg-gradient-to-br from-primary-deep via-primary-deep/95 to-primary p-8 text-white md:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight">Emergent Science</span>
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-white">
              <Sparkles className="h-3 w-3 text-sky" />
              Saved Submission Draft
            </div>

            <h3 className="mt-6 text-xl font-bold leading-snug">
              Welcome back to your submission
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-white/80">
              We recovered an active draft from your previous author session with auto-saved sections.
            </p>
          </div>

          <div className="mt-8 border-t border-white/15 pt-4 text-[11px] text-white/70 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Peer-Reviewed Open Access</span>
          </div>
        </div>

        {/* Right Action Panel */}
        <div className="relative flex flex-col justify-between p-6 sm:p-8 md:col-span-7">
          <button
            type="button"
            onClick={onContinue}
            className="absolute right-5 top-5 rounded-full p-2 text-ink-muted hover:bg-body hover:text-ink transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Draft Snapshot
            </span>

            {/* Snapshot Card */}
            <div className="mt-3 rounded-2xl border border-border bg-body/60 p-4 space-y-2.5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Journal</p>
                <p className="text-xs font-bold text-ink truncate">
                  {journalName || 'Frontiers in Artificial Intelligence'}
                </p>
              </div>

              {manuscriptTitle && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Title</p>
                  <p className="text-xs text-ink-secondary truncate">{manuscriptTitle}</p>
                </div>
              )}

              {/* Progress Gauge */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-ink">
                  <span>Sections Completed</span>
                  <span className="text-primary font-bold">{completedCount} of {totalSections} ({percent}%)</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-border/80">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-ink-secondary leading-relaxed">
              Would you like to resume editing this manuscript draft, or start a clean submission?
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-primary-hover transition-colors flex-1 justify-center"
            >
              <span>Resume Draft</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={onStartNew}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-bold text-ink-secondary hover:border-danger hover:text-danger transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Start New</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
