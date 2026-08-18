import { useState } from 'react'

const PRIMARY_LINKS = [
  { label: 'All Journals', href: '#' },
  { label: 'Articles', href: '#' },
  {
    label: 'Research Topics',
    href: '#',
    tag: 'Explore',
  },
  { label: 'Fees & Policies', href: '#' },
  { label: 'About', href: '#' },
]

const AUTHOR_MENU = [
  { label: 'Submit a Manuscript', href: '#' },
  { label: 'Publishing Fees & APC', href: '#' },
  { label: 'Collaborative Peer Review', href: '#' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authorOpen, setAuthorOpen] = useState(false)

  return (
    <>
      {/* TIER 1: Utility micro-bar (scrolls away) */}
      <div className="relative z-40 border-b border-slate-100 bg-slate-50">
        <div className="mx-auto flex h-7 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
              EmergentSci. Open Access
            </span>
            <span className="hidden text-xs text-slate-500 md:inline">Basel, Switzerland</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a href="#" className="hidden text-slate-500 hover:text-slate-900 sm:inline">
              Institutional Partnerships
            </a>
            <a href="#" className="hidden text-slate-500 hover:text-slate-900 md:inline">
              Publishing Integrity & COPE
            </a>
            <button className="flex items-center gap-1 font-semibold text-slate-700 hover:text-red-600">
              <GlobeIcon />
              English
              <ChevronDownIcon />
            </button>
          </div>
        </div>
      </div>

      {/* TIER 2: Main navigation bar (freezes on scroll) */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-3 px-4 sm:h-18 sm:px-6 sm:gap-6 lg:px-8">
          {/* Brand */}
          <a href="/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
              EmergentSci<span className="text-red-600">.</span>
            </span>
            <span className="hidden border-l border-slate-300 pl-2 text-[10px] font-bold uppercase tracking-wide text-slate-500 xl:inline">
              Open Access
            </span>
          </a>

          {/* Primary hub links */}
          <nav className="ml-6 hidden flex-1 items-center gap-5 lg:flex">
            {PRIMARY_LINKS.slice(0, 2).map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="border-b-2 border-transparent text-xs font-bold text-slate-800 transition-colors hover:border-red-600 hover:text-red-600"
              >
                {link.label}
              </a>
            ))}

            {PRIMARY_LINKS.slice(2, 3).map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 border-b-2 border-transparent text-xs font-bold text-slate-800 transition-colors hover:border-red-600 hover:text-red-600"
              >
                {link.label}
                <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-700">
                  {link.tag}
                </span>
              </a>
            ))}

            {/* For Authors dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAuthorOpen(true)}
              onMouseLeave={() => setAuthorOpen(false)}
            >
              <button
                onClick={() => setAuthorOpen((o) => !o)}
                className="flex items-center gap-1 border-b-2 border-transparent text-xs font-bold text-slate-800 transition-colors hover:border-red-600 hover:text-red-600"
              >
                For Authors
                <ChevronDownIcon />
              </button>
              {authorOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg">
                  {AUTHOR_MENU.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block px-4 py-3 text-xs font-medium text-slate-700 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-slate-50 hover:text-red-600"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {PRIMARY_LINKS.slice(4).map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="border-b-2 border-transparent text-xs font-bold text-slate-800 transition-colors hover:border-red-600 hover:text-red-600"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right action zone */}
          <div className="ml-auto flex items-center gap-3">
            <label className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700 xl:flex">
              Journal
              <select className="cursor-pointer bg-transparent text-xs font-semibold text-slate-700 outline-none">
                <option>All Journals</option>
                <option>Life Sciences</option>
                <option>Digital Medicine</option>
                <option>Physics & Chemistry</option>
              </select>
            </label>

            <a
              href="#"
              className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
            >
              <FileTextIcon />
              Submit
            </a>

            <a
              href="#"
              className="hidden rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-700 sm:block"
            >
              Sign In
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="border-t border-slate-100 bg-white lg:hidden">
            {[...PRIMARY_LINKS, ...AUTHOR_MENU].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 hover:text-red-600"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#"
              className="block border-t border-slate-100 px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 hover:text-red-600"
            >
              Sign In
            </a>
          </nav>
        )}
      </header>
    </>
  )
}

function GlobeIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function FileTextIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}