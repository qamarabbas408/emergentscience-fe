import { ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import type { StepKey } from './types'

interface WizardStepSectionProps {
  stepNumber: number
  title: string
  subtitle?: string
  complete: boolean
  open: boolean
  onToggle: () => void
  children: ReactNode
  sectionKey: StepKey
  onRegisterRef?: (el: HTMLDivElement | null) => void
}

export function WizardStepSection({
  stepNumber,
  title,
  subtitle,
  complete,
  open,
  onToggle,
  children,
  onRegisterRef,
}: WizardStepSectionProps) {
  return (
    <div
      ref={onRegisterRef}
      className={`scroll-mt-20 overflow-hidden rounded-2xl border bg-white transition-shadow duration-200 ${
        open ? 'border-primary/40 shadow-card' : 'border-border shadow-2xs hover:border-border/80'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-body/60 sm:px-6 sm:py-5"
      >
        {/* Step Badge */}
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
            complete
              ? 'bg-success text-white shadow-2xs'
              : open
              ? 'bg-primary text-white shadow-2xs'
              : 'bg-primary-tint text-primary'
          }`}
        >
          {complete ? <CheckCircle2 className="h-5 w-5" /> : stepNumber}
        </div>

        {/* Title & Subtitle */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-ink sm:text-lg">{title}</h2>
          </div>
          {subtitle && (
            <p className="mt-0.5 hidden text-xs text-ink-muted sm:block">{subtitle}</p>
          )}
        </div>

        {/* Status Chip */}
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              complete
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {complete ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3" />
                Action Required
              </>
            )}
          </span>

          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-transform duration-200 ${
              open ? 'rotate-180 bg-body text-ink' : ''
            }`}
          >
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </button>

      {/* Accordion Content */}
      {open && (
        <div className="border-t border-border px-5 py-6 sm:px-8 sm:py-7">
          {children}
        </div>
      )}
    </div>
  )
}
