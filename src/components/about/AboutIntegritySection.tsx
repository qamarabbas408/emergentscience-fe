import { ShieldCheck, Eye, Search, AlertCircle, UserCheck, Lock } from 'lucide-react'

const INTEGRITY_CHECKS = [
  {
    title: 'Image Manipulation Forensics',
    desc: 'Automated pixel-level inspection detects image duplication, Western blot band splicing, selective brightness adjustments, and AI-generated image artifacts.',
    icon: Eye,
    tag: 'Computer Vision',
  },
  {
    title: 'Plagiarism & Text Overlap',
    desc: 'Deep linguistic scanning across 90+ million academic articles, preprints, and theses via Crossref Similarity Check and iThenticate integrations.',
    icon: Search,
    tag: 'NLP Scanning',
  },
  {
    title: 'Reviewer Conflict Mapping',
    desc: 'Graph-based relationship mapping instantly identifies co-authorship history, institutional affiliations, and anomalous review patterns to avoid bias.',
    icon: UserCheck,
    tag: 'Network Forensics',
  },
  {
    title: 'Paper Mill & Cartel Detection',
    desc: 'Identifies coordinated submission rings, hijacked author identities, suspicious email domains, and manufactured citations before review begins.',
    icon: AlertCircle,
    tag: 'Pattern Recognition',
  },
]

export function AboutIntegritySection() {
  return (
    <section id="research-integrity" className="border-b border-border bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Scientific Ethics & Trust
            </span>
            <h2 className="mt-2 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Research Integrity Augmented by AI
            </h2>
            <p className="mt-4 text-base font-light leading-relaxed text-ink-secondary">
              At Emergent Science, upholding the fidelity of the scientific record is our highest duty. 
              We developed <strong>AIRA (Artificial Intelligence Review Assistant)</strong> to serve as a 
              powerful diagnostic shield, protecting journals from fraudulent submissions while keeping human 
              academics firmly in command of all editorial decisions.
            </p>

            <div className="mt-8 rounded-card border border-primary/20 bg-primary-tint/50 p-5">
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">The Human Editorial Guarantee</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
                    AIRA serves exclusively as an early-warning advisory tool. 
                    <strong> No manuscript is ever accepted or rejected automatically by an algorithm.</strong> 
                    Every flag is manually reviewed by our professional Research Integrity Managers and handling Academic Editors.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs font-semibold text-ink-muted">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                COPE Member
              </span>
              <span>•</span>
              <span>WAME Compliant</span>
              <span>•</span>
              <span>DORA Signatory</span>
              <span>•</span>
              <span>ICMJE Guidelines</span>
            </div>
          </div>

          {/* Forensic Check Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
            {INTEGRITY_CHECKS.map((check) => {
              const Icon = check.icon
              return (
                <div
                  key={check.title}
                  className="rounded-card border border-border bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                      {check.tag}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-ink">{check.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{check.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
