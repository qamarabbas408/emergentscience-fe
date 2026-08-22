import { useState, useMemo } from 'react'
import { LEADERSHIP_MEMBERS, type LeadershipMember } from '../../data/aboutData'
import { Search, ExternalLink, MapPin, BookOpen, User, X } from 'lucide-react'

type CategoryFilter = 'all' | 'executive' | 'scientific' | 'integrity' | 'regional'

const CATEGORY_TABS: { label: string; value: CategoryFilter }[] = [
  { label: 'All Leadership & Advisory', value: 'all' },
  { label: 'Executive Team', value: 'executive' },
  { label: 'Scientific Advisory Board', value: 'scientific' },
  { label: 'Research Integrity Council', value: 'integrity' },
  { label: 'Regional Directors', value: 'regional' },
]

export function AboutLeadership() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMember, setSelectedMember] = useState<LeadershipMember | null>(null)

  const filteredMembers = useMemo(() => {
    return LEADERSHIP_MEMBERS.filter((member) => {
      const matchesCategory = activeCategory === 'all' || member.category === activeCategory
      const matchesSearch =
        searchQuery.trim() === '' ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.affiliation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.location.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <section id="leadership" className="border-b border-border bg-body py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Governance & Stewardship
            </span>
            <h2 className="mt-2 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Leadership & Scientific Advisory Board
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-ink-secondary">
              Guided by leading active researchers, neuroscientists, ethicists, and open-access advocates 
              committed to rigorous peer review and democratic scholarship.
            </p>
          </div>

          {/* Member Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, role, or institution..."
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

        {/* Category Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-4">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = activeCategory === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveCategory(tab.value)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-border hover:border-slate-300 hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Member Grid */}
        {filteredMembers.length === 0 ? (
          <div className="mt-12 rounded-card border border-border bg-white p-12 text-center">
            <User className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-3 text-sm font-semibold text-ink">No members found</p>
            <p className="mt-1 text-xs text-ink-muted">
              Try adjusting your search keywords or switching category filters.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="group flex flex-col justify-between rounded-card border border-border bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-card"
              >
                <div>
                  {/* Photo & Badge */}
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      {member.location}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-ink group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-primary">{member.role}</p>
                  <p className="mt-2 text-xs font-medium text-ink-secondary leading-snug">
                    {member.affiliation}
                  </p>

                  <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-ink-muted">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-5 border-t border-border pt-3 flex items-center justify-between text-xs">
                  {member.orcid ? (
                    <a
                      href={`https://orcid.org/${member.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:underline"
                    >
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 text-[8px] font-bold text-white">
                        iD
                      </span>
                      {member.orcid}
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">Board Member</span>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedMember(member)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View Bio →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Member Bio Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedMember(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-card border border-border bg-white p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="absolute right-4 top-4 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-ink"
              aria-label="Close bio modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <img
                src={selectedMember.image}
                alt={selectedMember.name}
                referrerPolicy="no-referrer"
                className="h-28 w-28 rounded-lg object-cover shadow-md"
              />
              <div className="text-center sm:text-left">
                <span className="inline-block rounded bg-primary-tint px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                  {selectedMember.category.toUpperCase()}
                </span>
                <h3 className="mt-1 text-xl font-bold text-ink">{selectedMember.name}</h3>
                <p className="text-xs font-semibold text-primary">{selectedMember.role}</p>
                <p className="mt-1 text-xs text-ink-secondary">{selectedMember.affiliation}</p>
                
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-ink-muted">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {selectedMember.location}
                  </span>
                  {selectedMember.publicationsCount && (
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                      {selectedMember.publicationsCount}+ publications
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Executive & Scientific Biography
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                {selectedMember.bio}
              </p>
            </div>

            {selectedMember.orcid && (
              <div className="mt-6 rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                    iD
                  </span>
                  <div>
                    <p className="text-xs font-bold text-ink">Verified ORCID Profile</p>
                    <p className="text-[11px] text-ink-muted">{selectedMember.orcid}</p>
                  </div>
                </div>
                <a
                  href={`https://orcid.org/${selectedMember.orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded bg-white px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                >
                  View Record ↗
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
