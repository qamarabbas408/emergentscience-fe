import { useState } from 'react'
import type { ResearchTopic } from '../../data/topicsData'
import { appRoutes } from '../../appRoutes'

interface TopicDetailModalProps {
  topic: ResearchTopic
  onClose: () => void
  onBookmarkToggle?: (topicId: string) => void
  isBookmarked?: boolean
}

export function TopicDetailModal({
  topic,
  onClose,
  onBookmarkToggle,
  isBookmarked = false,
}: TopicDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'articles' | 'editors' | 'journals'>('about')
  const [copied, setCopied] = useState(false)

  const copyShareLink = () => {
    navigator.clipboard?.writeText(window.location.origin + appRoutes.topics + '#' + topic.slug)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative my-8 w-full max-w-4xl rounded-2xl border border-border bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with gradient accent */}
        <div className={`relative px-6 pt-7 pb-6 bg-gradient-to-r ${topic.bannerGradient} text-white`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-black/20 p-2 text-white/80 hover:bg-black/40 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>

          <div className="space-y-3 pr-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold text-white backdrop-blur-md">
                {topic.discipline}
              </span>
              {topic.isSubmissionOpen ? (
                <span className="rounded-full bg-emerald-500/90 px-3 py-0.5 text-xs font-bold text-white shadow-xs">
                  ● Submissions Open
                </span>
              ) : (
                <span className="rounded-full bg-slate-600 px-3 py-0.5 text-xs font-bold text-white">
                  Submissions Closed
                </span>
              )}
              {topic.isAwardNominee && (
                <span className="rounded-full bg-amber-400 text-slate-950 px-3 py-0.5 text-xs font-black flex items-center gap-1 shadow-xs">
                  ★ 2026 Topics Award Nominee
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight text-white">
              {topic.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/90 pt-1">
              {topic.submissionDeadline && (
                <div className="flex items-center gap-1.5 font-medium">
                  <CalendarIcon />
                  <span>Deadline: {topic.submissionDeadline}</span>
                </div>
              )}
              {topic.articlesCount > 0 && (
                <div className="flex items-center gap-1.5 font-medium">
                  <DocumentIcon />
                  <span>{topic.articlesCount} Articles Published</span>
                </div>
              )}
              {topic.viewsCount > 0 && (
                <div className="flex items-center gap-1.5 font-medium">
                  <EyeIcon />
                  <span>{topic.viewsCount.toLocaleString()} Views</span>
                </div>
              )}
              {topic.citationsCount > 0 && (
                <div className="flex items-center gap-1.5 font-medium">
                  <QuoteIcon />
                  <span>{topic.citationsCount.toLocaleString()} Citations</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-border bg-slate-50 px-6">
          <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto">
            <TabButton
              active={activeTab === 'about'}
              onClick={() => setActiveTab('about')}
              label="Overview & Scope"
            />
            <TabButton
              active={activeTab === 'articles'}
              onClick={() => setActiveTab('articles')}
              label={`Articles (${topic.articlesCount})`}
            />
            <TabButton
              active={activeTab === 'editors'}
              onClick={() => setActiveTab('editors')}
              label={`Editorial Team (${topic.editors.length})`}
            />
            <TabButton
              active={activeTab === 'journals'}
              onClick={() => setActiveTab('journals')}
              label={`Participating Journals (${topic.participatingJournals.length})`}
            />
          </div>

          <div className="hidden sm:flex items-center gap-2 py-2">
            <button
              onClick={copyShareLink}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:border-primary hover:text-primary transition-colors"
            >
              <ShareIcon />
              <span>{copied ? 'Link Copied!' : 'Share Topic'}</span>
            </button>
            {onBookmarkToggle && (
              <button
                onClick={() => onBookmarkToggle(topic.id)}
                className={`p-2 rounded-lg border transition-colors ${
                  isBookmarked
                    ? 'border-primary bg-primary-tint text-primary'
                    : 'border-border bg-white text-ink-muted hover:text-primary'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark topic'}
              >
                <BookmarkIcon filled={isBookmarked} />
              </button>
            )}
          </div>
        </div>

        {/* Modal Tab Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* Abstract */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  About This Research Topic
                </h3>
                <p className="text-sm text-ink leading-relaxed font-normal">{topic.abstract}</p>
              </div>

              {/* Keywords */}
              {topic.keywords.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Focus Areas &amp; Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-lg border border-border bg-body px-2.5 py-1 text-xs font-semibold text-ink-secondary"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Milestone Schedule */}
              {topic.submissionDeadline && (
                <div className="rounded-xl border border-border bg-slate-50 p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                    Important Dates &amp; Milestone Schedule
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-border">
                      <span className="block text-ink-muted text-[11px] font-medium">Abstract Submission</span>
                      <span className="font-bold text-ink">Rolling Review</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-red-200">
                      <span className="block text-red-600 text-[11px] font-bold">Manuscript Deadline</span>
                      <span className="font-bold text-red-700">{topic.submissionDeadline}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-border">
                      <span className="block text-ink-muted text-[11px] font-medium">Final Volume Reprint</span>
                      <span className="font-bold text-ink">December 2026</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'articles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-ink">
                  Published Articles in this Collection ({topic.articlesCount})
                </h3>
                <span className="text-xs text-ink-muted">All Open Access (CC-BY 4.0)</span>
              </div>

              {topic.sampleArticles && topic.sampleArticles.length > 0 ? (
                <div className="space-y-3">
                  {topic.sampleArticles.map((art) => (
                    <div
                      key={art.id}
                      className="rounded-xl border border-border bg-white p-4 transition-all hover:border-primary/40 hover:shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-primary">{art.journal}</span>
                        <span className="text-ink-muted">{art.published}</span>
                      </div>
                      <h4 className="text-sm font-bold text-ink hover:text-primary transition-colors cursor-pointer">
                        {art.title}
                      </h4>
                      <p className="text-xs text-ink-muted">{art.authors}</p>
                      <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                        <span className="font-mono text-[11px] text-ink-muted">DOI: {art.doi}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-ink-secondary">👁 {art.views} views</span>
                          <span className="text-ink-secondary">❝ {art.citations} citations</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-2">
                  <DocumentIcon />
                  <p className="text-sm font-bold text-ink">Articles undergoing collaborative peer review</p>
                  <p className="text-xs text-ink-muted max-w-md mx-auto">
                    New manuscripts submitted to this topic are reviewed interactively and published continuously as accepted.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'editors' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-ink">Topic Editorial Board</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {topic.editors.map((editor) => (
                  <div
                    key={editor.name}
                    className="flex items-start gap-3 rounded-xl border border-border bg-white p-4"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-xs ${
                        editor.avatarColor || 'bg-primary text-white'
                      }`}
                    >
                      {editor.name
                        .split(' ')
                        .filter((w) => !w.startsWith('Dr') && !w.startsWith('Prof'))
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-ink truncate">{editor.name}</h4>
                        {editor.role && (
                          <span className="rounded bg-primary-tint text-primary px-1.5 py-0.5 text-[10px] font-bold">
                            {editor.role}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-muted leading-tight">{editor.affiliation}</p>
                      {editor.orcid && (
                        <p className="text-[11px] text-emerald-700 font-medium pt-1 flex items-center gap-1">
                          <span className="inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#A6CE39] text-[7px] font-black text-white">
                            iD
                          </span>
                          {editor.orcid}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'journals' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-ink">Participating Journals</h3>
              <p className="text-xs text-ink-muted">
                Authors submitting to this topic can choose their primary journal of publication during the submission step.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {topic.participatingJournals.map((j) => (
                  <div
                    key={j}
                    className="flex items-center gap-3 rounded-xl border border-border bg-white p-3 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary text-xs font-black">
                      ES
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-ink truncate">{j}</h4>
                      <span className="text-[10px] text-emerald-600 font-medium">● Open Access</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border bg-slate-50 px-6 py-4">
          <div className="text-xs text-ink-muted">
            {topic.submissionDeadline ? (
              <>
                <span className="font-bold text-ink">Manuscript Deadline:</span> {topic.submissionDeadline}
              </>
            ) : (
              <span className="font-bold text-ink">{topic.discipline}</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none rounded-full px-5 py-2 text-xs font-bold text-ink-secondary hover:bg-slate-200/60 transition-colors"
            >
              Close
            </button>
            <a
              href={`${appRoutes.submit}?topic=${topic.slug}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors"
            >
              <FileIcon />
              <span>Submit to this Topic</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
        active ? 'border-primary text-primary' : 'border-transparent text-ink-muted hover:text-ink'
      }`}
    >
      {label}
    </button>
  )
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function QuoteIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function BookmarkIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  )
}
