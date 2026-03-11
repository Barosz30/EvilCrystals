type T = (key: string) => string

interface AchievementToastProps {
  t: T
  achievementId: string
}

export function AchievementToast({ t, achievementId }: AchievementToastProps) {
  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-emerald-400/60 bg-slate-950/90 px-6 py-3 shadow-glow-green backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🏆</span>
        <div className="leading-tight">
          <div className="font-gothic text-[11px] uppercase tracking-[0.25em] text-emerald-200">
            {t('ui.achievementUnlocked')}
          </div>
          <div className="font-gothic text-sm font-semibold text-parchment">
            {t(`achievement.${achievementId}.name`)}
          </div>
        </div>
      </div>
    </div>
  )
}
