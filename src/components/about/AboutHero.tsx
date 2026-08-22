import { Link } from 'react-router-dom'
import { appRoutes } from '../../appRoutes'
import { ABOUT_STATS } from '../../data/aboutData'
import { ShieldCheck, Users, Globe2, BookOpen, ArrowRight, Award } from 'lucide-react'

interface AboutHeroProps {
  onScrollToSection: (sectionId: string) => void
}

export function AboutHero({ onScrollToSection }: AboutHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary-deep via-primary to-primary-hover text-white">
      {/* Background Subtle Grid Texture */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6 pb-16 pt-12 sm:pt-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-white/70">
          <Link to={appRoutes.home} className="transition-colors hover:text-white">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-white">About Emergent Science</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
              <Award className="h-3.5 w-3.5 text-amber-300" />
              <span>Leading 100% Gold Open Access Publisher</span>
            </div>

            <h1 className="mt-5 text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
              Where scientists <br className="hidden sm:inline" />
              <span className="font-bold text-sky-200">empower society</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/90 sm:text-xl">
              Emergent Science is an open-access academic publisher and research technology platform 
              founded by scientists at the EPFL Innovation Park. We are dedicated to accelerating scientific 
              breakthroughs through radical transparency, collaborative peer review, and cutting-edge artificial 
              intelligence integrity tools.
            </p>

            {/* Quick Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={appRoutes.submit}
                className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-sm transition-all hover:bg-slate-100 hover:shadow"
              >
                Submit Manuscript
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => onScrollToSection('review-model')}
                className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Explore Review Model
              </button>
              <button
                type="button"
                onClick={() => onScrollToSection('leadership')}
                className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Scientific Board
              </button>
            </div>
          </div>

          {/* Quick Highlight Card */}
          <div className="lg:col-span-4">
            <div className="rounded-card border border-white/20 bg-white/10 p-6 text-white backdrop-blur-md">
              <h3 className="text-base font-bold tracking-tight">Our Core Commitment</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/80">
                All research published by Emergent Science is immediately, permanently free to read, download, 
                and share under CC-BY 4.0, funded via transparent institutional partnerships and equitable waiver programs.
              </p>

              <div className="mt-5 space-y-3 border-t border-white/20 pt-4 text-xs font-medium text-white/90">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  <span>AIRA Research Integrity Suite</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-sky-200" />
                  <span>Interactive Real-Time Review Forum</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Globe2 className="h-4 w-4 text-amber-200" />
                  <span>Global Headquarters in Basel, Switzerland</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-4 w-4 text-purple-200" />
                  <span>Over 120 Fully Indexed Journals</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Stats Grid */}
        <div className="mt-14 grid grid-cols-2 gap-4 border-t border-white/20 pt-10 sm:grid-cols-3 lg:grid-cols-6">
          {ABOUT_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {stat.value}
              </span>
              <span className="mt-1 text-xs font-semibold text-sky-100">
                {stat.label}
              </span>
              <span className="mt-0.5 text-[11px] font-light text-white/70">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
