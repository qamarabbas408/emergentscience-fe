import { useState } from 'react'
import {
  FileText,
  Download,
  Copy,
  Check,
  Bookmark,
  X,
  ExternalLink,
  Eye,
  Quote,
  Clock,
  Sparkles,
  Layers,
  Database,
  BookOpen,
} from 'lucide-react'
import type { Article } from '../data/articlesData'

interface ArticleDetailModalProps {
  article: Article | null
  isOpen: boolean
  onClose: () => void
  onBookmarkToggle?: (articleId: number) => void
  isBookmarked?: boolean
}

type CitationStyle = 'apa' | 'bibtex' | 'chicago' | 'harvard' | 'mla'

export function ArticleDetailModal({
  article,
  isOpen,
  onClose,
  onBookmarkToggle,
  isBookmarked = false,
}: ArticleDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'citations' | 'metrics' | 'data'>('overview')
  const [citationStyle, setCitationStyle] = useState<CitationStyle>('apa')
  const [copied, setCopied] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  if (!isOpen || !article) return null

  const generateCitationText = (style: CitationStyle): string => {
    const authorsFormatted = article.authors.join(', ')
    const year = article.published.split(' ').pop() || '2026'

    switch (style) {
      case 'apa':
        return `${authorsFormatted} (${year}). ${article.title}. ${article.journal}, ${article.doi}. https://doi.org/${article.doi}`
      case 'bibtex':
        return `@article{emergent_${article.id}_${year},\n  author = {${article.authors.join(' and ')}},\n  title = {${article.title}},\n  journal = {${article.journal}},\n  year = {${year}},\n  doi = {${article.doi}},\n  url = {https://doi.org/${article.doi}}\n}`
      case 'chicago':
        return `${authorsFormatted}. "${article.title}." ${article.journal} (${year}). https://doi.org/${article.doi}.`
      case 'harvard':
        return `${authorsFormatted}, ${year}. ${article.title}. ${article.journal}. Available at: <https://doi.org/${article.doi}>.`
      case 'mla':
        return `${article.authors[0]}, et al. "${article.title}." ${article.journal}, ${year}, doi:${article.doi}.`
      default:
        return ''
    }
  }

  const handleCopyCitation = () => {
    const text = generateCitationText(citationStyle)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleDownloadPdf = () => {
    setPdfGenerating(true)
    setTimeout(() => {
      setPdfGenerating(false)
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3000)
    }, 1200)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl border border-border bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Gradient Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-sky to-emerald-500" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-4 bg-white">
          <div className="min-w-0 flex-1 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                {article.openAccessType || 'CC-BY 4.0'} Open Access
              </span>
              <span className="rounded-md bg-red-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700 border border-red-200">
                {article.type}
              </span>
              {article.isEditorPick && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                  <Sparkles className="h-3 w-3 text-amber-600" />
                  Editor's Choice
                </span>
              )}
            </div>

            <h2 className="mt-2 text-lg sm:text-xl font-extrabold text-ink leading-snug">
              {article.title}
            </h2>

            <p className="mt-1 text-xs text-ink-muted">
              Published in <span className="font-bold text-primary">{article.journal}</span>
              {article.section && (
                <span className="text-ink-secondary"> › {article.section}</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onBookmarkToggle && (
              <button
                type="button"
                onClick={() => onBookmarkToggle(article.id)}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
                className={`rounded-full p-2 transition-colors ${
                  isBookmarked
                    ? 'bg-primary-tint text-primary'
                    : 'text-ink-muted hover:bg-body hover:text-ink'
                }`}
              >
                <Bookmark className="h-5 w-5" fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="rounded-full p-2 text-ink-muted hover:bg-body hover:text-ink transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-border bg-body/60 px-6 py-2">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-ink-secondary hover:bg-white hover:text-primary'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Abstract &amp; Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('citations')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'citations'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-ink-secondary hover:bg-white hover:text-primary'
            }`}
          >
            <Quote className="h-3.5 w-3.5" />
            <span>Cite Article</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('metrics')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'metrics'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-ink-secondary hover:bg-white hover:text-primary'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Impact &amp; Metrics</span>
          </button>

          {article.isOpenData && (
            <button
              type="button"
              onClick={() => setActiveTab('data')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'data'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-ink-secondary hover:bg-white hover:text-primary'
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>Open Data Repository</span>
            </button>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Authors & Institutional Affiliations */}
              <div className="rounded-2xl border border-border/80 bg-body/40 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  Authors &amp; Contributions
                </p>
                <p className="mt-1.5 text-sm font-bold text-ink">
                  {article.authors.join(' • ')}
                </p>
                {article.affiliations && (
                  <div className="mt-2 space-y-1">
                    {article.affiliations.map((aff, i) => (
                      <p key={i} className="text-xs text-ink-secondary">
                        <sup className="font-bold text-primary mr-1">{i + 1}</sup>
                        {aff}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Structured Abstract */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Structured Scientific Abstract
                </h4>
                <div className="mt-2.5 rounded-2xl border border-border bg-white p-4.5 text-xs sm:text-sm leading-relaxed text-ink shadow-2xs">
                  {article.abstract}
                </div>
              </div>

              {/* Keywords */}
              {article.keywords && article.keywords.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                    Indexed Keywords
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {article.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full bg-primary-tint px-3 py-1 text-xs font-medium text-primary border border-primary/20"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border bg-white p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                    Publication Date
                  </span>
                  <span className="text-xs font-bold text-ink mt-0.5 block">{article.published}</span>
                </div>

                <div className="rounded-xl border border-border bg-white p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                    Digital Object Identifier
                  </span>
                  <span className="text-xs font-bold text-primary mt-0.5 block truncate">
                    {article.doi}
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-white p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                    Estimated Reading
                  </span>
                  <span className="text-xs font-bold text-ink mt-0.5 block flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-ink-muted" />
                    {article.readingTimeMinutes || 12} min read
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-white p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                    License
                  </span>
                  <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                    {article.openAccessType || 'CC-BY 4.0'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'citations' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-ink">
                  Select Citation Format
                </p>
                <div className="flex items-center gap-1.5">
                  {(['apa', 'bibtex', 'chicago', 'harvard', 'mla'] as CitationStyle[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setCitationStyle(st)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                        citationStyle === st
                          ? 'bg-primary text-white'
                          : 'bg-body text-ink-secondary hover:text-primary border border-border'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative rounded-2xl border border-border bg-slate-950 p-4 text-slate-200">
                <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap">
                  {generateCitationText(citationStyle)}
                </pre>
                <button
                  type="button"
                  onClick={handleCopyCitation}
                  className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition-colors backdrop-blur-xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Format</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-ink-muted">
                Tip: You can export directly into citation managers (Zotero, Mendeley, EndNote) using the DOI: <strong className="text-primary">{article.doi}</strong>.
              </p>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-border bg-white p-5 shadow-2xs text-center">
                  <Eye className="mx-auto h-6 w-6 text-primary mb-2" />
                  <div className="text-2xl font-black text-ink">{article.views.toLocaleString()}</div>
                  <div className="text-xs font-semibold text-ink-muted">Article Views &amp; Reads</div>
                </div>

                <div className="rounded-2xl border border-border bg-white p-5 shadow-2xs text-center">
                  <Download className="mx-auto h-6 w-6 text-emerald-600 mb-2" />
                  <div className="text-2xl font-black text-ink">{(article.downloads || 840).toLocaleString()}</div>
                  <div className="text-xs font-semibold text-ink-muted">PDF Downloads</div>
                </div>

                <div className="rounded-2xl border border-border bg-white p-5 shadow-2xs text-center">
                  <Quote className="mx-auto h-6 w-6 text-sky mb-2" />
                  <div className="text-2xl font-black text-ink">{article.citations.toLocaleString()}</div>
                  <div className="text-xs font-semibold text-ink-muted">Crossref &amp; Scopus Citations</div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-body/40 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Impact Trajectory
                </h4>
                <p className="mt-2 text-xs text-ink-secondary leading-relaxed">
                  This publication is ranked in the top <strong>5%</strong> of peer-reviewed articles published in {article.journal} this year, achieving indexation across PubMed Central, Scopus, Web of Science, and Google Scholar.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <Database className="h-4 w-4" />
                  <span>Open Science Framework &amp; Supplementary Data Available</span>
                </div>
                <p className="mt-1 text-xs text-emerald-700 leading-relaxed">
                  The raw datasets, Jupyter computational notebooks, and experimental protocols supporting the findings of this paper are permanently archived on Zenodo &amp; Figshare.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-border bg-white p-3 text-xs">
                  <span className="font-semibold text-ink">Source Data Table (CSV, 4.2 MB)</span>
                  <button type="button" className="text-primary font-bold hover:underline flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border bg-white p-3 text-xs">
                  <span className="font-semibold text-ink">Reproducibility Code &amp; Models (ZIP, 18.5 MB)</span>
                  <button type="button" className="text-primary font-bold hover:underline flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border bg-white px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Permanent URL: https://doi.org/{article.doi}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-ink-secondary hover:border-primary hover:text-primary transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={pdfGenerating}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {pdfGenerating ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Preparing Full PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Full-Text PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
