import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthModal } from './AuthModal'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useLogout, useMe } from '../api/hooks'
import type { UserResource } from '../lib/apiClient'
import {
  appName,
  authorMenu,
  journalQuickSelect,
  navLinks,
  profileMenu,
  siteMeta,
  utilityLinks,
} from '../appConstants'
import { appRoutes } from '../appRoutes'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authorOpen, setAuthorOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const { data: user } = useMe()
  const logout = useLogout()
  const { t } = useTranslation()

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const onAuthenticated = (authUser: UserResource) => {
    setToast(`Welcome back, ${authUser.name}!`)
  }

  const signOut = () => {
    logout.mutate()
    setProfileOpen(false)
  }

  const brand = (
    <Link
      to={appRoutes.home}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="flex items-center gap-2"
    >
      <span className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
        {appName}<span className="text-red-600">.</span>
      </span>
      <span className="hidden border-l border-slate-300 pl-2 text-[10px] font-bold uppercase tracking-wide text-slate-500 xl:inline">
        {t('app.openAccess')}
      </span>
    </Link>
  )

  const { pathname } = useLocation()
  const navHrefs = new Set<string>(navLinks.map((link) => link.href))
  const isAuthorSection = authorMenu.some(
    (item) => item.href === pathname && !navHrefs.has(item.href),
  )

  const hubLinkClass = ({ isActive }: { isActive: boolean }) =>
    `border-b-2 text-xs font-bold transition-colors ${
      isActive
        ? 'border-red-600 text-red-600'
        : 'border-transparent text-slate-800 hover:border-red-600 hover:text-red-600'
    }`

  return (
    <>
      {/* TIER 1: Utility micro-bar (scrolls away) */}
      <div className="relative z-40 border-b border-slate-100 bg-slate-50">
        <div className="mx-auto flex h-7 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
              {appName}. {t('app.openAccess')}
            </span>
            <span className="hidden text-xs text-slate-500 md:inline">{siteMeta.publisherLocation}</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            {utilityLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="hidden text-slate-500 hover:text-slate-900 md:inline"
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* TIER 2: Main navigation bar (freezes on scroll) */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full items-center gap-3 px-4 sm:h-18 sm:px-6 sm:gap-6 lg:px-8">
          {brand}

          {/* Primary hub links */}
          <nav className="ml-6 hidden flex-1 items-center gap-5 lg:flex">
            {navLinks.slice(0, 2).map((link) => (
              <NavLink key={link.label} to={link.href} className={hubLinkClass}>
                {link.label}
              </NavLink>
            ))}

            {navLinks.slice(2, 3).map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) => `${hubLinkClass({ isActive })} flex items-center gap-1.5`}
              >
                {link.label}
                <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-700">
                  {link.tag}
                </span>
              </NavLink>
            ))}

            {/* For Authors dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAuthorOpen(true)}
              onMouseLeave={() => setAuthorOpen(false)}
            >
              <button
                onClick={() => setAuthorOpen((o) => !o)}
                className={`${hubLinkClass({ isActive: isAuthorSection })} flex items-center gap-1`}
              >
                For Authors
                <ChevronDownIcon />
              </button>
              {authorOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg">
                  {authorMenu.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="block px-4 py-3 text-xs font-medium text-slate-700 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-slate-50 hover:text-red-600"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(4).map((link) => (
              <NavLink key={link.label} to={link.href} className={hubLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right action zone */}
          <div className="ml-auto flex items-center gap-3">
            <label className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700 xl:flex">
              Journal
              <select className="cursor-pointer bg-transparent text-xs font-semibold text-slate-700 outline-none">
                {journalQuickSelect.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <Link
              to={appRoutes.submit}
              className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
            >
              <FileTextIcon />
              {t('nav.submit')}
            </Link>

            {user ? (
              <div className="relative" onMouseEnter={() => setProfileOpen(true)} onMouseLeave={() => setProfileOpen(false)}>
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 transition-colors hover:border-slate-300"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                    {user.name.charAt(0)}
                  </span>
                  <span className="hidden text-left leading-tight sm:block">
                    <span className="block text-xs font-bold text-slate-900">
                      {user.name}
                      <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-[#A6CE39]" title="Verified account" />
                    </span>
                    <span className="block text-[10px] font-medium text-slate-500">{user.email}</span>
                  </span>
                  <ChevronDownIcon />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#A6CE39] text-[8px] font-black text-white">iD</span>
                        {user.email}
                      </p>
                    </div>
                    {profileMenu.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-red-600"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={signOut}
                      className="block w-full px-4 py-2.5 text-left text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                    >
                      {t('nav.signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="hidden rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-700 sm:block"
              >
                {t('nav.signIn')}
              </button>
            )}

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
            {[...navLinks, ...authorMenu].map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-slate-800 hover:bg-slate-50 hover:text-red-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false)
                setAuthOpen(true)
              }}
              className="block w-full border-t border-slate-100 px-6 py-3 text-left text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 hover:text-red-600"
            >
              {t('nav.signIn')}
            </button>
          </nav>
        )}
      </header>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onAuthenticated={onAuthenticated} />}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-2xl">
          {toast}
        </div>
      )}
    </>
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