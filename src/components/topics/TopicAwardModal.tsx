interface TopicAwardModalProps {
  onClose: () => void
  onNominateClick: () => void
}

export function TopicAwardModal({ onClose, onNominateClick }: TopicAwardModalProps) {
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
        {/* Header with award styling */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-black/20 p-2 text-white/80 hover:bg-black/40 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
          <div className="space-y-2">
            <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-black uppercase tracking-wider backdrop-blur-md">
              Annual Scientific Recognition
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight">2026 Emergent Science Topics Award</h2>
            <p className="text-xs text-white/90">
              Honoring outstanding interdisciplinary research collections and their editorial leadership.
            </p>
          </div>
        </div>

        {/* Modal content */}
        <div className="p-6 space-y-5 text-ink">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                1st Prize Winner
              </span>
              <p className="text-2xl font-black text-amber-900">$10,000 USD</p>
              <p className="text-xs text-amber-800">
                Research grant + 5 full APC waivers for the editorial team’s laboratory.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-slate-50 p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Runner-Up (2 Teams)
              </span>
              <p className="text-2xl font-black text-ink">$5,000 USD</p>
              <p className="text-xs text-ink-secondary">
                Research grant + complimentary printed hardbound topic monograph.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink">Evaluation Criteria</h3>
            <ul className="space-y-2 text-xs text-ink-secondary list-disc pl-4">
              <li>
                <strong className="text-ink">Scientific Impact &amp; Quality:</strong> Rigorous peer-review standards and high citation density across top indexed journals.
              </li>
              <li>
                <strong className="text-ink">Interdisciplinary Breadth:</strong> Meaningful collaboration across 2 or more distinct scientific domains.
              </li>
              <li>
                <strong className="text-ink">Global Reach:</strong> Diverse geographic and demographic representation among contributing author cohorts.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-slate-50 p-4 space-y-1 text-xs">
            <p className="font-bold text-ink">Nomination Deadline: 15 October 2026</p>
            <p className="text-ink-muted">
              Winners will be announced at the Emergent Science Global Open Science Summit in Geneva.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              onClick={onClose}
              className="rounded-full px-5 py-2 text-xs font-bold text-ink-secondary hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose()
                onNominateClick()
              }}
              className="rounded-full bg-amber-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition-colors"
            >
              Propose or Nominate a Topic
            </button>
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
