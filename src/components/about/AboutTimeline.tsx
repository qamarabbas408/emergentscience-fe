import { MILESTONES } from '../../data/aboutData'
import { Flag, Sparkles } from 'lucide-react'

export function AboutTimeline() {
  return (
    <section id="our-history" className="border-b border-border bg-body py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Our Journey & Impact
          </span>
          <h2 className="mt-2 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Nearly Two Decades of Open Science
          </h2>
          <p className="mt-4 text-base font-light leading-relaxed text-ink-secondary">
            From our early roots at the EPFL Innovation Park to becoming one of the most cited open-access
            publishers in the world, discover the milestones that shaped our path.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="mt-14 relative">
          {/* Vertical Line for Desktop */}
          <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-border" />

          <div className="space-y-8 lg:space-y-12">
            {MILESTONES.map((item, idx) => {
              const isEven = idx % 2 === 0
              return (
                <div
                  key={item.year}
                  className={`relative flex flex-col lg:flex-row items-center ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Badge in Center */}
                  <div className="hidden lg:flex absolute left-1/2 top-6 -translate-x-1/2 z-10 h-10 w-10 items-center justify-center rounded-full border-4 border-body bg-primary text-white shadow-md">
                    <Sparkles className="h-4 w-4" />
                  </div>

                  {/* Empty Spacer */}
                  <div className="hidden lg:block w-1/2" />

                  {/* Content Box */}
                  <div className={`w-full lg:w-1/2 ${isEven ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <div className="rounded-card border border-border bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-card">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black tracking-tight text-primary">
                          {item.year}
                        </span>
                        {item.badge && (
                          <span className="rounded-full bg-primary-tint px-2.5 py-0.5 text-[11px] font-bold text-primary">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 text-lg font-bold text-ink">{item.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 rounded-card border border-primary/20 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <Flag className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-base font-bold text-ink">The Next Era of Emergent Science</h3>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-ink-secondary">
            We are investing heavily in automated reproducibility validation, FAIR research dataset verification, 
            and global diamond open-access consortia to empower the next generation of researchers.
          </p>
        </div>
      </div>
    </section>
  )
}
