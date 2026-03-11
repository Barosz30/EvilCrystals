import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode
} from 'react'
import {
  type LangCode,
  TRANSLATIONS,
  LANG_NAMES,
  getStoredLang,
  setStoredLang
} from './translations'

type LangContextValue = {
  lang: LangCode
  setLang: (lang: LangCode) => void
  t: (key: string) => string
  langNames: typeof LANG_NAMES
}

const LangContext = createContext<LangContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(getStoredLang)

  const setLang = useCallback((newLang: LangCode) => {
    setLangState(newLang)
    setStoredLang(newLang)
  }, [])

  const t = useCallback(
    (key: string): string => {
      const map = TRANSLATIONS[lang]
      const value = map[key]
      if (value !== undefined) return value
      const fallback = TRANSLATIONS.pl as Record<string, string>
      return fallback[key] ?? key
    },
    [lang]
  )

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, t, langNames: LANG_NAMES }),
    [lang, setLang, t]
  )

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  )
}

export function useLanguage(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
