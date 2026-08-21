import { useState } from 'react'
import {
  FileText,
  Download,
  Quote,
  Eye,
  Bookmark,
  Share2,
  Check,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Database,
} from 'lucide-react'
import type { Article } from '../data/articlesData'

interface ArticleCardProps {
  article: Article
  grid?: boolean
  isBookmarked?: boolean
  onBookmarkToggle?: (id: number) => void
  onOpenDetails: (article: Article) => void
  onQuickCite: (article: Article) => void
}

export function ArticleCard({
  article,
  grid = false,
  isBookmarked = false,
  onBookmarkToggle,
  onOpenDetails,
  onQuickCite,
}: ArticleCardProps) {
  const [showAbstract, setShowAbstract] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `${window.location.origin}/articles?doi=${encodeURIComponent(article.doi)}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    })
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
    }, 1200)
  }

  return (
    <article
      onClick={() => onOpenDetails(article)}
      className="group relative flex flex-col rounded-3xl border border-border bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-primary/50 hover:shadow-card cursor-pointer"
    >
      {/* Top Badges and DOI */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
            {article.openAccessType || 'Open Access'}
          </span>
          <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700 border border-red-200">
            {article.type}
          </span>
          {article.isEditorPick && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
              <Sparkles className="h-3 w-3 text-amber-600" />
              Editor's Choice
            </span>
          )}
          {article.topic && (
            <span className="rounded-full bg-primary-tint px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
              Topic: {article.topic}
            </span>
          )}
          {article.isOpenData && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sky/10 px-2.5 py-0.5 text-[10px] font-bold text-sky border border-sky/20">
              <Database className="h-2.5 w-2.5" />
              Open Data
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onBookmarkToggle && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onBookmarkToggle(article.id)
              }}
              title={isBookmarked ? 'Remove saved bookmark' : 'Bookmark this publication'}
              className={`rounded-full p-1.5 transition-colors ${
                isBookmarked
                  ? 'bg-primary-tint text-primary'
                  : 'text-ink-muted hover:bg-body hover:text-ink'
              }`}
            >
              <Bookmark className="h-4 w-4" fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            title="Share & copy DOI link"
            className="rounded-full p-1.5 text-ink-muted hover:bg-body hover:text-ink transition-colors"
          >
            {copiedLink ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Article Title */}
      <h3
        className={`mt-3 font-extrabold leading-snug text-ink transition-colors group-hover:text-primary ${
          grid ? 'text-base' : 'text-lg sm:text-xl'
        }`}
      >
        {article.title}
      </h3>

      {/* Authors and Section Hierarchy */}
      <div className="mt-2 space-y-1">
        <p className="text-xs text-ink-muted">
          <span className="font-semibold text-ink-secondary">Authors:</span>{' '}
          <span className="text-ink">{article.authors.join(', ')}</span>
        </p>

        <p className="text-xs text-ink-muted">
          <span className="font-semibold text-ink-secondary">Journal:</span>{' '}
          <span className="font-bold text-primary">{article.journal}</span>
          {article.section && (
            <span className="text-ink-secondary"> › {article.section}</span>
          )}
        </p>
      </div>

      {/* Metadata Metrics Pill Bar */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
        <span className="flex items-center gap-1">
          <span className="font-semibold text-ink-secondary">Published:</span> {article.published}
        </span>
        <span className="flex items-center gap-1">
          <Quote className="h-3 w-3 text-sky" />
          <span className="font-bold text-ink">{article.citations}</span> citations
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-primary" />
          <span className="font-bold text-ink">{article.views.toLocaleString()}</span> views
        </span>
        {article.downloads && (
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3 text-emerald-600" />
            <span className="font-bold text-ink">{article.downloads.toLocaleString()}</span> downloads
          </span>
        )}
        {article.readingTimeMinutes && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-ink-muted" />
            <span>{article.readingTimeMinutes} min</span>
          </span>
        )}
      </div>

      {/* Abstract Preview */}
      {showAbstract ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-3.5 rounded-2xl bg-body p-3.5 text-xs leading-relaxed text-ink-secondary border border-border/80 animate-in fade-in duration-200"
        >
          <div className="font-bold text-ink mb-1 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-primary" />
            Abstract:
          </div>
          {article.abstract}
        </div>
      ) : (
        <p className="mt-2.5 text-xs leading-relaxed text-ink-muted line-clamp-2">
          {article.abstract}
        </p>
      )}

      {/* Keywords Chips */}
      {article.keywords && article.keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {article.keywords.slice(0, 4).map((kw) => (
            <span
              key={kw}
              className="rounded-md bg-body px-2 py-0.5 text-[10px] font-medium text-ink-secondary border border-border/60"
            >
              {kw}
            </span>
          ))}
          {article.keywords.length > 4 && (
            <span className="rounded-md bg-body px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
              +{article.keywords.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Action Footer Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowAbstract((s) => !s)}
            }
            className="inline-flex items-center gap-1 text-xs font-bold text-ink-secondary hover:text-primary transition-colors"
          >
            {showAbstract ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 text-primary" />
                <span>Hide Abstract</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 text-primary" />
                <span>Read Abstract</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onQuickCite(article)
            }}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-ink-secondary hover:bg-body hover:text-primary transition-colors"
          >
            <Quote className="h-3 w-3 text-sky" />
            <span>Cite</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {downloading ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="h-3 w-3" />
                <span>PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
