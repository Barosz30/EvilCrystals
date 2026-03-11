import type { LangCode } from '../../i18n/translations'

type T = (key: string) => string

interface SettingsModalProps {
  t: T
  langNames: Record<LangCode, string>
  lang: LangCode
  langCodes: LangCode[]
  playerName: string
  onPlayerNameChange: (name: string) => void
  onClose: () => void
  onSave: () => void
  onLoad: () => void
  langDropdownOpen: boolean
  onLangDropdownToggle: () => void
  onLangSelect: (code: LangCode) => void
  langDropdownRef: React.RefObject<HTMLDivElement>
}

export function SettingsModal({
  t,
  langNames,
  lang,
  langCodes,
  playerName,
  onPlayerNameChange,
  onClose,
  onSave,
  onLoad,
  langDropdownOpen,
  onLangDropdownToggle,
  onLangSelect,
  langDropdownRef
}: SettingsModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950/95 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="font-gothic text-sm tracking-[0.3em] text-parchment uppercase">
              {t('ui.settings')}
            </h2>
            <p className="mt-1 text-[11px] text-muted-foreground">{t('ui.settingsDesc')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-7 w-7 rounded-full border border-slate-600/80 bg-slate-900/80 text-xs hover:border-emerald-500/60"
            aria-label={t('ui.close')}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-[12px]">
          <div className="space-y-1">
            <label className="block text-xs text-parchment mb-1">{t('ui.playerName')}</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => onPlayerNameChange(e.target.value)}
              className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-1.5 text-sm text-parchment outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
              placeholder="Mroczny Władca"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-parchment">{t('ui.saveGame')}</div>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={onSave}
                className="flex items-center justify-center gap-2 rounded-md border border-emerald-500/70 bg-slate-900/80 px-3 py-2 text-xs text-parchment hover:bg-slate-800/90"
              >
                <span>💾</span>
                <span>{t('ui.saveGame')}</span>
              </button>
              <button
                type="button"
                onClick={onLoad}
                className="flex items-center justify-center gap-2 rounded-md border border-slate-600/80 bg-slate-900/80 px-3 py-2 text-xs text-parchment hover:bg-slate-800/90"
              >
                <span>📂</span>
                <span>{t('ui.loadGame')}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-parchment">{t('ui.googleLogin')}</div>
            <button
              type="button"
              disabled
              className="flex w-full items-center gap-2 rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-muted-foreground opacity-70 cursor-not-allowed"
            >
              <span className="text-lg">🟦</span>
              <span>{t('ui.googleLoginSoon')}</span>
            </button>
          </div>

          <div className="space-y-2" ref={langDropdownRef}>
            <div className="text-xs font-semibold text-parchment">{t('ui.language')}</div>
            <div className="relative">
              <button
                type="button"
                onClick={onLangDropdownToggle}
                className="flex w-full items-center justify-between rounded-md border border-slate-600 bg-slate-900 px-3 py-1.5 text-left text-sm text-parchment outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                aria-label={t('ui.language')}
                aria-expanded={langDropdownOpen}
                aria-haspopup="listbox"
              >
                <span>{langNames[lang]}</span>
                <span className="text-muted-foreground text-xs" aria-hidden>
                  {langDropdownOpen ? '▴' : '▾'}
                </span>
              </button>
              {langDropdownOpen && (
                <ul
                  role="listbox"
                  className="absolute left-0 right-0 bottom-full z-10 mb-1 flex max-h-48 flex-col-reverse overflow-y-auto rounded-md border border-slate-600 bg-slate-900 py-1 shadow-lg"
                  aria-label={t('ui.language')}
                >
                  {langCodes.map((code) => (
                    <li
                      key={code}
                      role="option"
                      aria-selected={code === lang}
                      onClick={() => {
                        onLangSelect(code)
                      }}
                      className={`cursor-pointer px-3 py-2 text-sm ${
                        code === lang
                          ? 'bg-emerald-500/20 text-emerald-200'
                          : 'text-parchment hover:bg-slate-800 hover:text-parchment'
                      }`}
                    >
                      {langNames[code]}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
