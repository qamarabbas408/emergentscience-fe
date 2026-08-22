import { useState } from 'react'
import { BookOpen, Users, Cpu, HeartHandshake, CheckCircle2, ChevronRight } from 'lucide-react'

interface Pillar {
  id: string
  title: string
  subtitle: string
  icon: typeof BookOpen
  color: string
  summary: string
  points: string[]
  quote: string
  quoteAuthor: string
}

const PILLARS: Pillar[] = [
  {
    id: 'open-access',
    title: '100% Unrestricted Open Access',
    subtitle: 'Free global knowledge dissemination under CC-BY 4.0',
    icon: BookOpen,
    color: 'border-blue-500 text-blue-600 bg-blue-50',
    summary:
      'We believe scientific research is a fundamental public good. When findings are locked behind subscription paywalls, progress slows. All Emergent Science articles are immediately available without fee to students, doctors, policymakers, and citizen scientists worldwide.',
    points: [
      'Authors retain full copyright under Creative Commons Attribution License (CC-BY 4.0).',
      'Immediate deposit into PubMed Central, DOAJ, Scopus, and international repositories.',
      'Full open machine-readable XML/JSON metadata and Crossref DOI minting.',
      'Zero embargo periods for self-archiving in institutional repositories.',
    ],
    quote: 'Knowledge must flow freely across borders if we are to solve planetary-scale challenges.',
    quoteAuthor: 'Executive Mission Charter',
  },
  {
    id: 'peer-review',
    title: 'Collaborative, Constructive Peer Review',
    subtitle: 'Transparent real-time dialogue and public attribution',
    icon: Users,
    color: 'border-emerald-500 text-emerald-600 bg-emerald-50',
    summary:
      'We replace outdated, combative peer review with a collaborative online discussion forum. Authors, reviewers, and editors collaborate in a structured online environment to improve manuscripts constructively before publication.',
    points: [
      'Interactive online forum facilitates threaded, polite reviewer-author debate.',
      'Reviewers are named on the published paper, receiving public recognition for their scholarship.',
      'Average review turnaround of 77 days without sacrificing methodological rigor.',
      'Clear, objective review guidelines focused on validity, reproducibility, and sound methods.',
    ],
    quote: 'Peer review should strengthen scientific discovery, not create bureaucratic bottlenecks.',
    quoteAuthor: 'Editorial Board Consensus',
  },
  {
    id: 'ai-integrity',
    title: 'Pioneering AI & Research Integrity',
    subtitle: 'AIRA forensic suite combined with human academic governance',
    icon: Cpu,
    color: 'border-purple-500 text-purple-600 bg-purple-50',
    summary:
      'We deploy custom artificial intelligence models to safeguard the scientific record. AIRA analyzes submissions for duplicate images, plagiarized text, paper-mill signatures, and reviewer conflicts of interest, empowering our human editors with real-time audit tools.',
    points: [
      'Automated image manipulation and band-splicing forensic analysis.',
      'Comprehensive similarity checking against 90M+ published papers.',
      'Detection of automated text generation and deceptive peer review networks.',
      '100% human editorial authority: AI assists with screening, but editors decide.',
    ],
    quote: 'Technology protects the scientific record, while human editors uphold intellectual leadership.',
    quoteAuthor: 'Research Integrity Office',
  },
  {
    id: 'equity-diversity',
    title: 'Global Equity & Institutional Sustainability',
    subtitle: 'Zero barriers for authors through transparent agreements and waivers',
    icon: HeartHandshake,
    color: 'border-amber-500 text-amber-600 bg-amber-50',
    summary:
      'No sound research should go unpublished due to lack of funding. Through 850+ institutional agreements and automatic waiver mechanisms for low-income economies, we ensure global researchers have equal publishing opportunities.',
    points: [
      'Automatic 100% fee waivers for authors based in Research4Life Group A & B countries.',
      'Direct billing agreements with university libraries that cover author APCs completely.',
      'Case-by-case financial support and discretionary hardship discounts.',
      'Gender and geographic parity mandates across all journal editorial boards.',
    ],
    quote: 'Equitable science requires intentional institutional frameworks that leave no researcher behind.',
    quoteAuthor: 'Global Equity Directorate',
  },
]

export function AboutMissionPillars() {
  const [activePillarId, setActivePillarId] = useState<string>(PILLARS[0].id)
  const activePillar = PILLARS.find((p) => p.id === activePillarId) || PILLARS[0]

  return (
    <section id="mission-pillars" className="border-b border-border bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Our Guiding Philosophy
          </span>
          <h2 className="mt-2 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Four Core Pillars of Emergent Science
          </h2>
          <p className="mt-4 text-base font-light leading-relaxed text-ink-secondary">
            Since our founding in 2007, we have stood for a fundamentally modern, researcher-centric
            model of scholarly communication built on transparency, integrity, and shared discovery.
          </p>
        </div>

        {/* Interactive Pillar Selector Tabs */}
        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-5">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon
              const isSelected = pillar.id === activePillarId
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => setActivePillarId(pillar.id)}
                  className={`w-full rounded-card p-5 text-left transition-all ${
                    isSelected
                      ? 'border-2 border-primary bg-white shadow-card'
                      : 'border border-border bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${pillar.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-ink'}`}>
                          {pillar.title}
                        </h3>
                        <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? 'text-primary' : 'text-slate-400'}`} />
                      </div>
                      <p className="mt-1 text-xs text-ink-muted">
                        {pillar.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Detailed Active Pillar Panel */}
          <div className="lg:col-span-7">
            <div className="h-full rounded-card border border-border bg-white p-8 shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg border ${activePillar.color}`}>
                    <activePillar.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-ink">{activePillar.title}</h3>
                    <p className="text-xs text-ink-muted">{activePillar.subtitle}</p>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-relaxed text-ink-secondary">
                  {activePillar.summary}
                </p>

                <div className="mt-6 border-t border-border pt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
                    Operational Standards & Safeguards
                  </h4>
                  <ul className="mt-4 space-y-3">
                    {activePillar.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-xs text-ink leading-relaxed">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 rounded-lg bg-primary-tint/60 p-4 border border-primary/10">
                <p className="text-xs italic text-primary-deep">
                  &ldquo;{activePillar.quote}&rdquo;
                </p>
                <p className="mt-1 text-[11px] font-bold text-primary">
                  — {activePillar.quoteAuthor}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
