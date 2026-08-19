import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'

export const supportedLocales = ['en'] as const
export type SupportedLocale = (typeof supportedLocales)[number]

export const defaultLocale: SupportedLocale = 'en'

export function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale)
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
  },
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  supportedLngs: [...supportedLocales],
  interpolation: { escapeValue: false },
  returnNull: false,
})

export default i18n