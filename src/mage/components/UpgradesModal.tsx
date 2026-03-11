import type { Upgrade } from '../useMageGameState'
import type { LangCode } from '../../i18n/translations'
import { UpgradesSection } from './UpgradesSection'

type T = (key: string) => string

interface UpgradesModalProps {
  t: T
  upgrades: Upgrade[]
  mana: number
  onBuy: (id: string) => void
  onClose: () => void
  lang: LangCode
}

export function UpgradesModal({ t, upgrades, mana, onBuy, onClose }: UpgradesModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950/95 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="font-gothic text-sm tracking-[0.3em] text-parchment uppercase text-shadow-glow-purple">
              ✨ {t('ui.upgrades')}
            </h2>
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

        <UpgradesSection t={t} upgrades={upgrades} mana={mana} onBuy={onBuy} />
      </div>
    </div>
  )
}

