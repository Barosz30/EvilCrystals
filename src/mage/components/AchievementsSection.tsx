import type { Achievement } from '../useMageGameState'

type T = (key: string) => string

interface AchievementsSectionProps {
  t: T
  achievements: Achievement[]
}

export function AchievementsSection({ t, achievements }: AchievementsSectionProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <section className="w-full max-w-3xl space-y-3 pb-8">
      <div className="flex items-baseline justify-end">
        <span className="text-[11px] text-muted-foreground">
          {unlockedCount}/{achievements.length} {t('ui.unlocked')}
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-3 text-[11px]">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`rounded-xl border px-3 py-2 space-y-1 ${
              a.unlocked
                ? 'bg-slate-900/80 border-emerald-400/70 shadow-glow-green'
                : 'bg-slate-900/40 border-slate-700/80 opacity-70'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{a.icon}</span>
              <span className="font-semibold text-parchment text-[11px]">
                {t(`achievement.${a.id}.name`)}
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              {t(`achievement.${a.id}.desc`)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
