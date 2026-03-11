import type { GameStats } from '../useMageGameState'

type T = (key: string) => string

interface StatsSectionProps {
  t: T
  stats: GameStats
}

export function StatsSection({ t, stats }: StatsSectionProps) {
  return (
    <section className="w-full max-w-3xl space-y-3">
      <div className="grid gap-3 sm:grid-cols-3 text-[11px]">
        <div className="rounded-xl bg-slate-950/70 border border-slate-700/70 p-3 space-y-1">
          <div className="text-muted-foreground">{t('ui.totalMana')}</div>
          <div className="text-parchment text-sm">{stats.totalManaEarned.toFixed(1)}</div>
        </div>
        <div className="rounded-xl bg-slate-950/70 border border-slate-700/70 p-3 space-y-1">
          <div className="text-muted-foreground">{t('ui.totalClicks')}</div>
          <div className="text-parchment text-sm">{stats.totalClicks}</div>
        </div>
        <div className="rounded-xl bg-slate-950/70 border border-slate-700/70 p-3 space-y-1">
          <div className="text-muted-foreground">{t('ui.peakManaPerSec')}</div>
          <div className="text-parchment text-sm">{stats.peakManaPerSec.toFixed(1)}</div>
        </div>
        <div className="rounded-xl bg-slate-950/70 border border-slate-700/70 p-3 space-y-1">
          <div className="text-muted-foreground">{t('ui.creaturesBought')}</div>
          <div className="text-parchment text-sm">{stats.totalCreaturesBought}</div>
        </div>
        <div className="rounded-xl bg-slate-950/70 border border-slate-700/70 p-3 space-y-1">
          <div className="text-muted-foreground">{t('ui.totalGold')}</div>
          <div className="text-parchment text-sm">{stats.totalGoldEarned}</div>
        </div>
        <div className="rounded-xl bg-slate-950/70 border border-slate-700/70 p-3 space-y-1">
          <div className="text-muted-foreground">{t('ui.totalCrystals')}</div>
          <div className="text-parchment text-sm">{stats.totalCrystalsEarned}</div>
        </div>
      </div>
    </section>
  )
}
