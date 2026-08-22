import { ACCREDITATIONS } from '../../data/aboutData'
import { Award, ShieldCheck, CheckCircle2 } from 'lucide-react'

export function AboutAccreditations() {
  return (
    <section id="accreditations" className="border-b border-border bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Standards & Certifications
          </span>
          <h2 className="mt-2 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Accreditations, Governance & Memberships
          </h2>
          <p className="mt-4 text-base font-light leading-relaxed text-ink-secondary">
            Emergent Science operates in full compliance with international scholarly publishing standards, 
            ethical codes, and open access quality benchmarks.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ACCREDITATIONS.map((item) => (
            <div
              key={item.shortName}
              className="flex flex-col justify-between rounded-card border border-border bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-card"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${item.badgeColor}`}>
                    {item.shortName}
                  </span>
                  <ShieldCheck className="h-4 w-4 text-slate-400" />
                </div>

                <h3 className="mt-4 text-base font-bold text-ink">{item.name}</h3>
                <p className="mt-1 text-xs font-semibold text-primary">{item.role}</p>

                <p className="mt-3 text-xs leading-relaxed text-ink-secondary">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 border-t border-border pt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Audited & Certified Signatory</span>
              </div>
            </div>
          ))}
        </div>

        {/* Indexing Badges Bar */}
        <div className="mt-12 rounded-card border border-border bg-slate-50 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <h4 className="text-sm font-bold text-ink">Comprehensive Global Indexing</h4>
                <p className="text-xs text-ink-muted">All published articles are permanently preserved and indexed across primary bibliographic databases.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-700">
              <span className="rounded bg-white px-3 py-1.5 border border-border shadow-xs">Web of Science</span>
              <span className="rounded bg-white px-3 py-1.5 border border-border shadow-xs">PubMed Central (PMC)</span>
              <span className="rounded bg-white px-3 py-1.5 border border-border shadow-xs">Scopus</span>
              <span className="rounded bg-white px-3 py-1.5 border border-border shadow-xs">DOAJ Seal</span>
              <span className="rounded bg-white px-3 py-1.5 border border-border shadow-xs">CLOCKSS / Portico</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
