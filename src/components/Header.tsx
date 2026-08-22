import { useEffect, useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'motion/react'
import {
  ChevronDown,
  FileText,
  Menu,
  X,
  Sparkles,
  BookOpen,
  DollarSign,
  Users,
  CheckCircle2,
  LogOut,
  Send,
  ShieldCheck,
  Compass,
  ArrowRight,
} from 'lucide-react'
import { AuthModal } from './AuthModal'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useLogout, useMe } from '../api/hooks'
import type { UserResource } from '../lib/apiClient'
import {
  appName,
  journalQuickSelect,
  profileMenu,
  siteMeta,
  utilityLinks,
} from '../appConstants'
import { appRoutes } from '../appRoutes'

interface NavItem {
  label: string
  href: string
  tag?: string
  badgeColor?: string
}

const mainNavItems: NavItem[] = [
  { label: 'All Journals', href: appRoutes.journals },
  { label: 'Articles', href: appRoutes.articles },
  { label: 'Topics', href: appRoutes.topics, tag: 'Explore', badgeColor: 'bg-primary-tint text-primary' },
  { label: 'Fees & Policies', href: appRoutes.fees },
  { label: 'About', href: appRoutes.about },
]

const authorDropdownItems = [
  {
    title: 'Submit a Manuscript',
    desc: 'Guided submission wizard with rapid peer review timeline',
    href: appRoutes.submit,
    icon: Send,
    tag: 'Fast Track',
  },
  {
    title: 'Publishing Fees & APCs',
    desc: 'Transparent article processing charges & institutional waivers',
    href: appRoutes.fees,
    icon: DollarSign,
  },
  {
    title: 'Research Topics Proposal',
    desc: 'Lead a cross-disciplinary collection as Guest Editor',
    href: appRoutes.topics,
    icon: Sparkles,
  },
  {
    title: 'Collaborative Peer Review',
    desc: 'Transparent, constructive forum with named reviewers',
    href: appRoutes.articles,
    icon: Users,
  },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authorOpen, setAuthorOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [journalSelectOpen, setJournalSelectOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const authorDropdownRef = useRef<HTMLDivElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const journalSelectRef = useRef<HTMLDivElement>(null)

  const location = useLocation()
  const navigate = useNavigate()
  const { data: user } = useMe()
  const logout = useLogout()
  const { t } = useTranslation()

  // Track scroll position for header elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  // Handle outside clicks for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (authorDropdownRef.current && !authorDropdownRef.current.contains(target)) {
        setAuthorOpen(false)
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(target)) {
        setProfileOpen(false)
      }
      if (journalSelectRef.current && !journalSelectRef.current.contains(target)) {
        setJournalSelectOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const onAuthenticated = (authUser: UserResource) => {
    setToast(`Welcome back, ${authUser.name}!`)
  }

  const signOut = () => {
    logout.mutate()
    setProfileOpen(false)
  }

  // Active navigation helper
  const mainNavHrefs = new Set(mainNavItems.map((item) => item.href))
  const isNavActive = (href: string) => {
    if (href === appRoutes.home) {
      return location.pathname === appRoutes.home
    }
    return location.pathname.startsWith(href)
  }

  const isAuthorActive = authorDropdownItems.some(
    (item) => !mainNavHrefs.has(item.href) && isNavActive(item.href)
  )

  const handleJournalSelect = (journalName: string) => {
    setJournalSelectOpen(false)
    if (journalName === 'All Journals') {
      navigate(appRoutes.journals)
    } else {
      navigate(`${appRoutes.journals}?discipline=${encodeURIComponent(journalName)}`)
    }
  }

  return (
    <>
      {/* TIER 1: Utility micro-bar */}
      <div className="relative z-40 border-b border-border/70 bg-slate-50/90 text-slate-600 transition-colors">
        <div className="mx-auto flex h-8 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-800">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="font-bold text-slate-900">{appName}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">{t('app.openAccess')}</span>
            </span>
            <span className="hidden text-[11px] text-slate-400 sm:inline">|</span>
            <span className="hidden items-center gap-1 text-[11px] font-medium text-slate-500 md:inline-flex">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              {siteMeta.publisherLocation}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            {utilityLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="hidden font-medium text-slate-600 transition-colors hover:text-primary md:inline"
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* TIER 2: Main sticky navigation bar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'border-b border-border bg-white/95 shadow-sm backdrop-blur-md'
            : 'border-b border-slate-200/80 bg-white/90 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto flex h-16 w-full items-center justify-between gap-4 px-4 sm:h-18 sm:px-6 lg:px-8">
          {/* Brand Identity */}
          <div className="flex items-center gap-6">
            <Link
              to={appRoutes.home}
              className="group flex items-center gap-2.5 outline-none"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:bg-primary">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-ink sm:text-2xl">
                  {appName}
                  <span className="text-primary">.</span>
                </span>
                <span className="hidden -mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:inline">
                  Open Science Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links with animated active indicator */}
            <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
              {/* Primary links */}
              {mainNavItems.slice(0, 3).map((link) => {
                const active = isNavActive(link.href)
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors duration-150 ${
                      active
                        ? 'font-bold text-primary'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-ink'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.tag && (
                      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold ${link.badgeColor}`}>
                        {link.tag}
                      </span>
                    )}

                    {/* Animated active underline pill */}
                    {active && (
                      <motion.div
                        layoutId="navActiveIndicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                  </Link>
                )
              })}

              {/* Mega / Animated "For Authors" Dropdown */}
              <div
                ref={authorDropdownRef}
                className="relative"
                onMouseEnter={() => setAuthorOpen(true)}
                onMouseLeave={() => setAuthorOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setAuthorOpen((o) => !o)}
                  className={`relative flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors duration-150 ${
                    authorOpen || isAuthorActive
                      ? 'font-bold text-primary'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-ink'
                  }`}
                  aria-expanded={authorOpen}
                >
                  <span>For Authors</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      authorOpen ? 'rotate-180 text-primary' : 'text-slate-400'
                    }`}
                  />
                  {isAuthorActive && !authorOpen && (
                    <motion.div
                      layoutId="navActiveIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {authorOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute left-0 top-full z-50 mt-1 w-80 rounded-2xl border border-border bg-white p-2 shadow-dropdown"
                    >
                      <div className="mb-1 border-b border-slate-100 px-3 py-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Author Resources & Services
                        </p>
                      </div>

                      <div className="space-y-1">
                        {authorDropdownItems.map((item) => {
                          const ItemIcon = item.icon
                          const isItemActive = isNavActive(item.href)
                          return (
                            <Link
                              key={item.title}
                              to={item.href}
                              onClick={() => setAuthorOpen(false)}
                              className={`group flex items-start gap-3 rounded-xl p-2.5 transition-all ${
                                isItemActive
                                  ? 'bg-primary-tint/60 text-primary'
                                  : 'text-slate-700 hover:bg-slate-50 hover:text-ink'
                              }`}
                            >
                              <div
                                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                  isItemActive
                                    ? 'bg-primary text-white'
                                    : 'bg-slate-100 text-slate-600 group-hover:bg-primary-tint group-hover:text-primary'
                                }`}
                              >
                                <ItemIcon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-primary">
                                    {item.title}
                                  </span>
                                  {item.tag && (
                                    <span className="rounded-full bg-emerald-50 px-1.5 py-0.2 text-[9px] font-extrabold text-emerald-700">
                                      {item.tag}
                                    </span>
                                  )}
                                </div>
                                <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">
                                  {item.desc}
                                </p>
                              </div>
                            </Link>
                          )
                        })}
                      </div>

                      <div className="mt-2 rounded-xl bg-slate-50 p-2.5 text-center">
                        <Link
                          to={appRoutes.submit}
                          onClick={() => setAuthorOpen(false)}
                          className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:underline"
                        >
                          <span>Start your manuscript submission</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Remaining links */}
              {mainNavItems.slice(3).map((link) => {
                const active = isNavActive(link.href)
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors duration-150 ${
                      active
                        ? 'font-bold text-primary'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-ink'
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && (
                      <motion.div
                        layoutId="navActiveIndicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right Action Zone */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Journal Selector Dropdown */}
            <div ref={journalSelectRef} className="relative hidden xl:block">
              <button
                type="button"
                onClick={() => setJournalSelectOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-border bg-slate-50/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-white"
                aria-expanded={journalSelectOpen}
              >
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                <span>Explore Journals</span>
                <ChevronDown
                  className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
                    journalSelectOpen ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {journalSelectOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full z-50 mt-1.5 w-56 rounded-xl border border-border bg-white p-1 shadow-dropdown"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Discipline Filter
                    </div>
                    {journalQuickSelect.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleJournalSelect(option)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary"
                      >
                        <span>{option}</span>
                        <ArrowRight className="h-3 w-3 text-slate-400" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Primary CTA */}
            <Link
              to={appRoutes.submit}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-primary-hover hover:shadow-md sm:px-5 sm:py-2.5 sm:text-sm active:scale-95"
            >
              <FileText className="h-4 w-4 transition-transform duration-200 group-hover:rotate-6" />
              <span>{t('nav.submit')}</span>
            </Link>

            {/* User Profile or Sign In */}
            {user ? (
              <div
                ref={profileDropdownRef}
                className="relative"
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full border border-border bg-white py-1 pl-1 pr-2.5 transition-all hover:border-slate-300 hover:bg-slate-50"
                  aria-expanded={profileOpen}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden text-left leading-tight sm:block">
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-900">
                      {user.name}
                      <span title="Verified ORCID account" className="inline-flex">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#A6CE39]" />
                      </span>
                    </span>
                    <span className="block text-[10px] font-medium text-slate-400">{user.email}</span>
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                      profileOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full z-50 mt-1.5 w-64 rounded-2xl border border-border bg-white p-1.5 shadow-dropdown"
                    >
                      <div className="border-b border-slate-100 px-3.5 py-3">
                        <p className="text-xs font-bold text-slate-900">{user.name}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                          <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#A6CE39] text-[8px] font-black text-white">
                            iD
                          </span>
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1">
                        {profileMenu.map((item) => (
                          <Link
                            key={item.label}
                            to={item.href}
                            onClick={() => setProfileOpen(false)}
                            className="block rounded-lg px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          type="button"
                          onClick={signOut}
                          className="flex w-full items-center gap-2 rounded-lg px-3.5 py-2 text-left text-xs font-bold text-primary transition-colors hover:bg-primary-tint"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>{t('nav.signOut')}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="hidden rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-all duration-150 hover:bg-slate-800 hover:shadow-xs active:scale-95 sm:block"
              >
                {t('nav.signIn')}
              </button>
            )}

            {/* Mobile menu toggle button */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-border bg-white lg:hidden"
            >
              <div className="max-h-[80vh] overflow-y-auto px-4 py-5 space-y-5">
                {/* Main Navigation Links */}
                <div>
                  <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Main Navigation
                  </div>
                  <div className="mt-2 space-y-1">
                    {mainNavItems.map((item) => {
                      const active = isNavActive(item.href)
                      return (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                            active
                              ? 'bg-primary-tint text-primary font-bold'
                              : 'text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {item.label}
                            {item.tag && (
                              <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${item.badgeColor}`}>
                                {item.tag}
                              </span>
                            )}
                          </span>
                          {active && <CheckCircle2 className="h-4 w-4 text-primary" />}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Author Services Section */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Author Services
                  </div>
                  <div className="mt-2 space-y-1">
                    {authorDropdownItems.map((item) => {
                      const ItemIcon = item.icon
                      const active = isNavActive(item.href)
                      return (
                        <Link
                          key={item.title}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                            active
                              ? 'bg-primary-tint text-primary font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <ItemIcon className="h-4 w-4 text-slate-500" />
                          <span>{item.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Mobile Actions: Sign in or Profile */}
                <div className="border-t border-slate-100 pt-4">
                  {user ? (
                    <div className="space-y-2">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                            {user.name.charAt(0)}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{user.name}</p>
                            <p className="text-[10px] text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileOpen(false)
                          signOut()
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-bold text-primary hover:bg-primary-tint"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t('nav.signOut')}</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false)
                        setAuthOpen(true)
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800"
                    >
                      {t('nav.signIn')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Authentication Modal */}
      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onAuthenticated={onAuthenticated}
        />
      )}

      {/* Floating Animated Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-2xl border border-slate-700 bg-slate-900/95 px-5 py-3 text-sm font-medium text-white shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{toast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}