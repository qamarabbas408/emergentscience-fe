import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-body p-4 text-ink font-sans">
          <div className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <TriangleAlertIcon />
            </div>

            <div className="space-y-2">
              <h1 className="text-lg font-bold text-ink">Something went wrong</h1>
              <p className="text-sm leading-relaxed text-ink-muted">
                An unexpected error occurred while rendering this page. Reload to try again.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700"
              >
                Reload Page
              </button>
              <a
                href="/"
                className="rounded-xl border border-border bg-white px-5 py-2.5 text-sm font-bold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function TriangleAlertIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  )
}