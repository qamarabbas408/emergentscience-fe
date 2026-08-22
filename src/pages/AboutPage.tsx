import { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { AboutHero } from '../components/about/AboutHero'
import { AboutMissionPillars } from '../components/about/AboutMissionPillars'
import { AboutPeerReviewWorkflow } from '../components/about/AboutPeerReviewWorkflow'
import { AboutIntegritySection } from '../components/about/AboutIntegritySection'
import { AboutLeadership } from '../components/about/AboutLeadership'
import { AboutGlobalOffices } from '../components/about/AboutGlobalOffices'
import { AboutTimeline } from '../components/about/AboutTimeline'
import { AboutAccreditations } from '../components/about/AboutAccreditations'
import { AboutFaq } from '../components/about/AboutFaq'
import { AboutCtaBanner } from '../components/about/AboutCtaBanner'
import { ChevronUp } from 'lucide-react'

const NAV_SECTIONS = [
  { id: 'mission-pillars', label: 'Four Pillars' },
  { id: 'review-model', label: 'Peer Review' },
  { id: 'research-integrity', label: 'AIRA & Integrity' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'global-offices', label: 'Global Hubs' },
  { id: 'our-history', label: 'Our Journey' },
  { id: 'accreditations', label: 'Standards' },
  { id: 'faq', label: 'FAQ' },
]

export function AboutPage() {
  const [activeSection, setActiveSection] = useState<string>('mission-pillars')
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)

      // Active section detection
      const scrollPosition = window.scrollY + 180
      for (const section of NAV_SECTIONS) {
        const el = document.getElementById(section.id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) {
      const yOffset = -90
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-body flex flex-col justify-between">
      <div>
        <Header />

        {/* Hero Section */}
        <AboutHero onScrollToSection={scrollToSection} />

        {/* Sticky Sub-Navigation Bar for Section Jumping */}
        <div className="sticky top-16 sm:top-18 z-40 border-b border-border bg-white/95 backdrop-blur-md shadow-xs">
          <div className="mx-auto flex max-w-[1280px] items-center gap-1 overflow-x-auto px-6 py-2.5 text-xs font-semibold no-scrollbar">
            <span className="mr-2 hidden text-[11px] uppercase tracking-wider text-ink-muted lg:inline">
              Jump to:
            </span>
            {NAV_SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className={`shrink-0 rounded-full px-3.5 py-1 transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
                  }`}
                >
                  {sec.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Core Content Sections */}
        <main>
          <AboutMissionPillars />
          <AboutPeerReviewWorkflow />
          <AboutIntegritySection />
          <AboutLeadership />
          <AboutGlobalOffices />
          <AboutTimeline />
          <AboutAccreditations />
          <AboutFaq />
          <AboutCtaBanner />
        </main>
      </div>

      <Footer />

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:bg-primary-hover hover:scale-105"
          aria-label="Back to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
