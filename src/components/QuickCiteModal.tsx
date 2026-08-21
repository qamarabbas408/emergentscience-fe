import { useState } from 'react'
import {
  X,
  Copy,
  Check,
  Quote,
  Download,
} from 'lucide-react'
import type { Article } from '../data/articlesData'

interface QuickCiteModalProps {
  article: Article | null
  isOpen: boolean
  onClose: () => void
}

type CitationStyle = 'apa' | 'bibtex' | 'chicago' | 'harvard' | 'mla' | 'ris'

export function QuickCiteModal({ article, isOpen, onClose }: QuickCiteModalProps) {
  const [style, setStyle] = useState<CitationStyle>('apa')
  const [copied, setCopied] = useState(false)

  if (!isOpen || !article) return null

  const getCitation = (st: CitationStyle) => {
    const authorsFormatted = article.authors.join(', ')
    const year = article.published.split(' ').pop() || '2026'

    switch (st) {
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
      case 'ris':
        return `TY  - JOUR\nTI  - ${article.title}\nAU  - ${article.authors.join('\nAU  - ')}\nJO  - ${article.journal}\nPY  - ${year}\nDO  - ${article.doi}\nUR  - https://doi.org/${article.doi}\nER  - `
      default:
        return ''
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getCitation(style)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleDownloadFile = () => {
    const content = getCitation(style)
    const ext = style === 'bibtex' ? 'bib' : style === 'ris' ? 'ris' : 'txt'
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `citation-${article.id}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-3xl border border-border bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-tint text-primary">
              <Quote className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Cite this Publication</h3>
              <p className="text-xs text-ink-muted truncate max-w-sm">{article.title}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cite modal"
            className="rounded-full p-2 text-ink-muted hover:bg-body hover:text-ink transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['apa', 'bibtex', 'chicago', 'harvard', 'mla', 'ris'] as CitationStyle[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStyle(st)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  style === st
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-body text-ink-secondary hover:bg-white hover:text-primary border border-border'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative rounded-2xl border border-border bg-slate-950 p-4 text-slate-200">
            <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
              {getCitation(style)}
            </pre>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadFile}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-ink-secondary hover:border-primary hover:text-primary transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download .{style === 'bibtex' ? 'bib' : style === 'ris' ? 'ris' : 'txt'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-primary-hover transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Citation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
