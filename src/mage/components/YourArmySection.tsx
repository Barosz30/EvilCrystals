import { CREATURE_IMAGES } from '../constants'
import type { Creature } from '../useMageGameState'

type T = (key: string) => string

interface YourArmySectionProps {
  t: T
  creatures: Creature[]
  creatureMult: number
}

export function YourArmySection({ t, creatures, creatureMult }: YourArmySectionProps) {
  const withCount = creatures.filter((c) => c.count > 0)
  const empty = withCount.length === 0

  return (
    <section className="w-full max-w-3xl">
      <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 px-4 py-4 pt-12">
        <h2 className="font-gothic text-xs tracking-[0.3em] text-parchment uppercase mb-3">
          {t('ui.yourArmy')}
        </h2>
        {empty ? (
          <p className="text-[12px] text-muted-foreground italic">{t('ui.summonFirst')}</p>
        ) : (
          <div className="flex flex-wrap gap-3 justify-start">
            {withCount.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2 min-w-[130px]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-slate-600/80 to-slate-700/90 border border-slate-500/70 overflow-hidden">
                  <img
                    src={CREATURE_IMAGES[c.id] ?? CREATURE_IMAGES.imp}
                    alt={c.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="text-[11px] leading-tight">
                  <div className="font-semibold text-parchment">
                    {t(`creature.${c.id}`)}{' '}
                    <span className="text-xs text-slate-400 align-middle">×{c.count}</span>
                  </div>
                  <div className="text-[10px] text-emerald-200">
                    +{(c.manaPerSec * creatureMult).toFixed(1)} {t('ui.manaUnit')}/s
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
