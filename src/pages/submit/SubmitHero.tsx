import { CheckCircle2, FileCheck, ShieldCheck, Sparkles } from 'lucide-react'
import { STEP_ORDER, STEP_TITLES, type StepKey } from './types'

interface SubmitHeroProps {
  completedSteps: Record<StepKey, boolean>
  openSteps: Record<StepKey, boolean>
  activeStepKey?: StepKey
  onSelectStep: (key: StepKey) => void
  overallPercent: number
}

export function SubmitHero({
  completedSteps,
  activeStepKey,
  onSelectStep,
  overallPercent,
}: SubmitHeroProps) {
  const completedCount = STEP_ORDER.filter((key) => completedSteps[key]).length

  return (
    <div className="border-b border-border bg-surface shadow-xs">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Top Badges & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-tint px-3 py-1 text-xs font-semibold text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Emergent Science Author Portal
          </div>

          <div className="flex items-center gap-4 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5 font-medium text-ink-secondary">
              <ShieldCheck className="h-4 w-4 text-success" />
              COPE &amp; DOAJ Compliant
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 font-medium text-ink-secondary">
              <Sparkles className="h-4 w-4 text-primary" />
              Automated Pre-flight Checks
            </span>
          </div>
        </div>

        {/* Header Title & Subtitle */}
        <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
              Submit Your Manuscript
            </h1>
            <p className="text-sm leading-relaxed text-ink-secondary">
              Complete the structured sections below. Your draft is automatically saved to your browser
              session and validated in real time against journal publication standards.
            </p>
          </div>

          {/* Quick Readiness Card */}
          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-border bg-body px-4 py-3 sm:px-5">
            <div className="space-y-1 text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Submission Readiness
              </span>
              <div className="flex items-baseline justify-end gap-1.5">
                <span className="text-2xl font-black text-ink">{overallPercent}%</span>
                <span className="text-xs font-medium text-ink-secondary">
                  ({completedCount}/{STEP_ORDER.length} sections)
                </span>
              </div>
            </div>
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-xs">
              <svg className="h-10 w-10 -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-border"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    overallPercent >= 80
                      ? 'text-success'
                      : overallPercent >= 40
                      ? 'text-warning'
                      : 'text-primary'
                  }
                  strokeDasharray={`${overallPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <FileCheck className="absolute h-4 w-4 text-ink-secondary" />
            </div>
          </div>
        </div>

        {/* Step Navigation Bar */}
        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {STEP_ORDER.map((key, index) => {
            const isDone = completedSteps[key]
            const isActive = activeStepKey === key

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectStep(key)}
                className={`group flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all sm:p-3 ${
                  isActive
                    ? 'border-primary bg-primary-tint/50 shadow-2xs'
                    : isDone
                    ? 'border-success/30 bg-emerald-50/40 hover:border-success/60'
                    : 'border-border bg-white hover:border-ink-muted/30'
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                    isDone
                      ? 'bg-success text-white shadow-2xs'
                      : isActive
                      ? 'bg-primary text-white shadow-2xs'
                      : 'bg-body text-ink-muted group-hover:bg-primary-tint group-hover:text-primary'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                    Step {index + 1}
                  </span>
                  <span className="block truncate text-xs font-bold text-ink group-hover:text-primary">
                    {STEP_TITLES[key].split(' ')[0]} {STEP_TITLES[key].split(' ')[1] || ''}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
