import { useState, useMemo } from 'react'
import { ABOUT_FAQS, type AboutFaqItem } from '../../data/aboutData'
import { ChevronDown, HelpCircle, Search, Mail, X } from 'lucide-react'

type FaqCategory = 'all' | 'open-access' | 'peer-review' | 'fees' | 'integrity'

export function AboutFaq() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1])

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    )
  }

  const filteredFaqs = useMemo(() => {
    return ABOUT_FAQS.filter((faq: AboutFaqItem) => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
      const matchesSearch =
        searchQuery.trim() === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <section id="faq" className="border-b border-border bg-body py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Common Questions
            </span>
            <h2 className="mt-2 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-ink-secondary">
              Find answers regarding open access licensing, collaborative peer review, fee structures, 
              and manuscript preservation.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-border bg-white py-2 pl-9 pr-3 text-xs text-ink placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-4">
          {[
            { label: 'All Topics', val: 'all' },
            { label: 'Open Access & CC-BY', val: 'open-access' },
            { label: 'Peer Review Forum', val: 'peer-review' },
            { label: 'Publishing Fees & Waivers', val: 'fees' },
            { label: 'Ethics & Integrity', val: 'integrity' },
          ].map((cat) => (
            <button
              key={cat.val}
              type="button"
              onClick={() => setActiveCategory(cat.val as FaqCategory)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeCategory === cat.val
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-border hover:border-slate-300 hover:text-ink'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQs List */}
        {filteredFaqs.length === 0 ? (
          <div className="mt-8 rounded-card border border-border bg-white p-12 text-center">
            <HelpCircle className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-3 text-sm font-semibold text-ink">No matching questions found</p>
            <p className="mt-1 text-xs text-ink-muted">
              Have a specific question? Contact our editorial help desk at support@emergentsci.org
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndices.includes(idx)
              return (
                <div
                  key={faq.question}
                  className="rounded-card border border-border bg-white transition-all hover:border-slate-300 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleIndex(idx)}
                    className="flex w-full items-center justify-between p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-bold text-ink pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 px-5 pb-5 pt-3">
                      <p className="text-xs leading-relaxed text-ink-secondary">{faq.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Need more help banner */}
        <div className="mt-10 rounded-card border border-border bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-ink">
            <Mail className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="font-bold">Need customized editorial guidance or institutional support?</p>
              <p className="text-ink-muted">Our international editorial and help desk teams respond within 24 hours.</p>
            </div>
          </div>

          <a
            href="mailto:support@emergentsci.org"
            className="shrink-0 rounded-md bg-primary px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-hover shadow-xs"
          >
            Contact Help Desk
          </a>
        </div>
      </div>
    </section>
  )
}
