import { CREATURE_ICONS } from '../constants'
import { getCost } from '../useMageGameState'
import type { Creature } from '../useMageGameState'

type T = (key: string) => string

interface CreatureShopSectionProps {
  t: T
  creatures: Creature[]
  mana: number
  discount: number
  creatureMult: number
  onBuy: (id: string) => void
}

export function CreatureShopSection({
  t,
  creatures,
  mana,
  discount,
  creatureMult,
  onBuy
}: CreatureShopSectionProps) {
  return (
    <section className="w-full max-w-3xl space-y-3">
      <h2 className="font-gothic text-sm tracking-[0.3em] text-parchment uppercase text-shadow-glow-green">
        🏪 {t('ui.summonCreatures')}
      </h2>
      <div className="space-y-2">
        {creatures.map((c) => {
          const cost = getCost(c.baseCost, c.count, discount)
          const canAfford = mana >= cost
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onBuy(c.id)}
              disabled={!canAfford}
              className={`w-full rounded-2xl border px-4 py-3 flex items-center justify-between text-left transition ${
                canAfford
                  ? 'bg-slate-900/80 border-emerald-500/70 shadow-glow-green'
                  : 'bg-slate-900/60 border-slate-700/70 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-600/80 text-lg">
                  {CREATURE_ICONS[c.id] ?? '❓'}
                </div>
                <div>
                  <div className="font-medium text-slate-100">
                    {t(`creature.${c.id}`)}{' '}
                    <span className="text-xs text-slate-400 align-middle">×{c.count}</span>
                  </div>
                  <div className="text-xs text-emerald-200">
                    +{(c.manaPerSec * creatureMult).toFixed(1)} {t('ui.manaUnit')}/s
                  </div>
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="text-parchment">
                  {Math.floor(cost)} {t('ui.manaUnit')}
                </div>
                {!canAfford && (
                  <div className="text-[11px] text-muted-foreground">{t('ui.notEnoughMana')}</div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
