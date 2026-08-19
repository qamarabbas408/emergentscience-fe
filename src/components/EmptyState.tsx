import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-12 text-center shadow-xs">
      {icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint text-primary">
          {icon}
        </div>
      )}
      <h3 className="mt-3 text-base font-bold text-ink">{title}</h3>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-xs text-ink-muted">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}