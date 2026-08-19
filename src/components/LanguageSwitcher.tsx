import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { defaultLocale, supportedLocales, type SupportedLocale } from '../i18n'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const current = (i18n.resolvedLanguage ?? defaultLocale) as SupportedLocale

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 font-semibold text-slate-700 hover:text-red-600"
        aria-label="Change language"
      >
        <GlobeIcon />
        {current.toUpperCase()}
        <ChevronIcon />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          {supportedLocales.map((locale) => (
            <button
              key={locale}
              onClick={() => {
                void i18n.changeLanguage(locale)
                setOpen(false)
              }}
              className={`block w-full px-4 py-2 text-left text-xs font-semibold transition-colors hover:bg-slate-50 hover:text-red-600 ${
                locale === current ? 'text-red-600' : 'text-slate-700'
              }`}
            >
              {locale === 'en' ? 'English' : String(locale).toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
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

function ChevronIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}