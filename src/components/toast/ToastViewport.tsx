import { createPortal } from 'react-dom'
import { dismissToast, pauseTimer, resumeTimer, useToasts, type Toast } from './toast-store'

const VARIANT_STYLES: Record<Toast['type'], { icon: string; bar: string; label: string }> = {
  success: { icon: 'text-success', bar: 'bg-success', label: 'CheckIcon' },
  error: { icon: 'text-danger', bar: 'bg-danger', label: 'XIcon' },
  warning: { icon: 'text-warning', bar: 'bg-warning', label: 'WarningIcon' },
  info: { icon: 'text-primary', bar: 'bg-primary', label: 'InfoIcon' },
}

export function ToastViewport() {
  const toasts = useToasts()

  return createPortal(
    <div
      className="fixed bottom-6 right-6 z-60 flex w-full max-w-sm flex-col gap-3"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body,
  )
}

function ToastCard({ toast }: { toast: Toast }) {
  const variant = VARIANT_STYLES[toast.type]
  const Icon = ICONS[variant.label]

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => pauseTimer(toast.id)}
      onMouseLeave={() => resumeTimer(toast.id, toast.duration)}
      className="toast-enter pointer-events-auto relative flex items-center gap-3 overflow-hidden rounded-card border border-border bg-white p-4 shadow-card"
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${variant.bar}`} />
      <span className={`shrink-0 ${variant.icon}`}>
        <Icon />
      </span>
      <p className="flex-1 text-sm font-medium text-ink">{toast.message}</p>
      {toast.action && (
        <button
          onClick={() => {
            dismissToast(toast.id)
            toast.action?.onClick()
          }}
          className="shrink-0 text-xs font-bold text-primary hover:text-primary-hover"
        >
          {toast.action.label}
        </button>
      )}
      <button
        onClick={() => dismissToast(toast.id)}
        className="shrink-0 rounded-md p-1 text-ink-muted transition-colors hover:bg-surface hover:text-ink"
        aria-label="Dismiss notification"
      >
        <CloseIcon />
      </button>
    </div>
  )
}

const ICONS: Record<string, () => React.JSX.Element> = {
  CheckIcon: CheckIcon,
  XIcon: ErrorIcon,
  WarningIcon: WarningIcon,
  InfoIcon: InfoIcon,
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12 2.5 2.5L16 9.5" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="m8.5 8.5 7 7m0-7-7 7" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 4 2 20h20L12 4Z" />
      <path d="M12 10v4m0 3h.01" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-5m0-3h.01" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}