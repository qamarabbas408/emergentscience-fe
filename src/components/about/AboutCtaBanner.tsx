import { Link } from 'react-router-dom'
import { appRoutes } from '../../appRoutes'
import { ArrowRight, BookOpen, Sparkles, Send, Library } from 'lucide-react'

export function AboutCtaBanner() {
  return (
    <section className="bg-primary-deep text-white py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="rounded-card border border-white/15 bg-white/5 p-8 sm:p-12 backdrop-blur-sm">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-200">
                <Sparkles className="h-3.5 w-3.5" />
                Join the Global Open Science Movement
              </span>
              <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
                Ready to publish your research with Emergent Science?
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-white/80">
                Experience fast, transparent peer review with named reviewer attribution, immediate global 
                open-access dissemination under CC-BY 4.0, and automated institutional funding coverage.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to={appRoutes.submit}
                  className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-primary transition-all hover:bg-slate-100 hover:shadow"
                >
                  <Send className="h-4 w-4" />
                  Submit Your Manuscript
                </Link>
                <Link
                  to={appRoutes.journals}
                  className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20"
                >
                  <BookOpen className="h-4 w-4" />
                  Explore 120+ Journals
                </Link>
                <Link
                  to={appRoutes.topics}
                  className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20"
                >
                  <Library className="h-4 w-4" />
                  Research Topics
                </Link>
              </div>
            </div>

            <div className="border-t border-white/15 pt-8 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <h3 className="text-base font-bold text-white">Join as an Editor or Reviewer</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/70">
                We are continually expanding our academic editorial boards. Lead a specialized Research Topic or join our reviewer community.
              </p>

              <div className="mt-5 space-y-2">
                <Link
                  to={appRoutes.topics}
                  className="flex items-center justify-between rounded-lg bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                >
                  <span>Propose a Research Topic</span>
                  <ArrowRight className="h-3.5 w-3.5 text-sky-200" />
                </Link>
                <Link
                  to={appRoutes.fees}
                  className="flex items-center justify-between rounded-lg bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                >
                  <span>Fees & Institutional Policies</span>
                  <ArrowRight className="h-3.5 w-3.5 text-sky-200" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
