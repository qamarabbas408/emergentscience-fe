import { useState } from 'react'
import type { TopicReprintBook } from '../../data/topicsData'

interface TopicReprintModalProps {
  book: TopicReprintBook
  onClose: () => void
}

export function TopicReprintModal({ book, onClose }: TopicReprintModalProps) {
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 4000)
    }, 800)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative my-8 w-full max-w-2xl rounded-2xl border border-border bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs font-bold border border-emerald-200">
              Open Access Monograph
            </span>
            <span className="text-xs text-ink-muted">CC-BY 4.0</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-ink-muted hover:bg-slate-200/60 hover:text-ink transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Book Cover simulation */}
            <div
              className={`w-32 h-44 shrink-0 rounded-lg p-3 shadow-md flex flex-col justify-between ${book.coverColor} border`}
            >
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider opacity-70 block">
                  Emergent Books
                </span>
                <span className="text-[11px] font-bold line-clamp-3 leading-tight mt-1">
                  {book.title}
                </span>
              </div>
              <div>
                <span className="text-[9px] opacity-80 block truncate">{book.editors}</span>
                <span className="text-[8px] opacity-60 font-mono block mt-0.5">OPEN ACCESS</span>
              </div>
            </div>

            {/* Book details */}
            <div className="space-y-2 min-w-0 flex-1">
              <span className="text-xs font-bold text-primary">{book.category}</span>
              <h3 className="text-base font-bold text-ink leading-snug">{book.title}</h3>
              <p className="text-xs text-ink-muted">
                <strong className="text-ink-secondary">Editors:</strong> {book.editors}
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-ink-secondary border-t border-border pt-2">
                <div>
                  <strong>ISBN:</strong> {book.isbn}
                </div>
                <div>
                  <strong>Pages:</strong> {book.pages}
                </div>
                <div>
                  <strong>DOI:</strong> {book.doi}
                </div>
                <div>
                  <strong>Downloads:</strong> {book.downloads.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-border pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">Monograph Summary</h4>
            <p className="text-xs text-ink-secondary leading-relaxed">{book.abstract}</p>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="text-xs text-emerald-600 font-medium">
              {downloaded ? '✓ eBook PDF successfully generated & downloaded!' : 'Free full-text download'}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="rounded-full px-4 py-2 text-xs font-bold text-ink-secondary hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary-hover transition-colors shadow-xs"
              >
                {downloading ? 'Preparing PDF...' : 'Download PDF (Free)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
