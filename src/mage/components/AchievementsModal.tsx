import type { Achievement } from '../useMageGameState'
import { AchievementsSection } from './AchievementsSection'

type T = (key: string) => string

interface AchievementsModalProps {
  t: T
  achievements: Achievement[]
  onClose: () => void
}

export function AchievementsModal({ t, achievements, onClose }: AchievementsModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950/95 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="font-gothic text-sm tracking-[0.3em] text-parchment uppercase">
              🏆 {t('ui.achievements')}
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

        <AchievementsSection t={t} achievements={achievements} />
      </div>
    </div>
  )
}
