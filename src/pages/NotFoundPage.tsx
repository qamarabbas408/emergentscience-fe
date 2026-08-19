import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { appRoutes } from '../appRoutes'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-body text-ink font-sans">
      <Header />

      <main className="flex items-center justify-center px-4 py-24 sm:py-32">
        <div className="max-w-lg text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Error 404</p>

          <div className="mt-4 flex items-end justify-center gap-2 text-[120px] font-black leading-none tracking-tight text-ink sm:text-[160px]">
            <span className="text-primary">4</span>
            <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary-tint text-ink sm:h-28 sm:w-28">
              <SearchXIcon />
            </span>
            <span className="text-primary">4</span>
          </div>

          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Page not found
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-secondary">
            The page you are looking for does not exist, may have been moved, or the address is
            incorrect.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={appRoutes.home}
              className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700"
            >
              Back to Home
            </a>
            <a
              href={appRoutes.journals}
              className="rounded-xl border border-border bg-white px-6 py-2.5 text-sm font-bold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
            >
              Browse Journals
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function SearchXIcon() {
  return (
    <svg className="h-12 w-12 sm:h-14 sm:w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3M8.5 8.5l5 5M13.5 8.5l-5 5" />
    </svg>
  )
}