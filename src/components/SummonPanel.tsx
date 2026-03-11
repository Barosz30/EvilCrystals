import type { GameState } from '../game/types'
import type { CreatureDefinition } from '../game/types'
import type Decimal from 'break_eternity.js'
import { CREATURES } from '../game/types'
import { parseDecimal } from '../game/decimal'

interface SummonPanelProps {
  state: GameState
  getCreatureCount: (state: GameState, creatureId: string) => number
  onSummon: (creatureId: string) => void
  canSummon: (state: GameState, def: CreatureDefinition) => boolean
  isCreatureUnlocked: (state: GameState, def: CreatureDefinition) => boolean
  costForNextCreature: (def: CreatureDefinition, count: number) => Decimal
  formatShort: (d: Decimal) => string
}

export function SummonPanel({
  state,
  getCreatureCount,
  onSummon,
  canSummon,
  isCreatureUnlocked,
  costForNextCreature,
  formatShort
}: SummonPanelProps) {
  return (
    <section
      className="card-fantasy bg-void-800/95 border-earth-700/50 p-4"
      aria-label="Przywołania"
    >
      <h2 className="font-display text-forest-400 font-semibold mb-3 text-lg">
        Przywołaj stwory
      </h2>
      <ul className="space-y-2">
        {CREATURES.map((def) => {
          const count = getCreatureCount(state, def.id)
          const unlocked = isCreatureUnlocked(state, def)
          const canBuy = canSummon(state, def)
          const cost = costForNextCreature(def, count)
          return (
            <li
              key={def.id}
              className={`rounded-lg p-3 border transition ${
                unlocked
                  ? 'bg-void-700/90 border-earth-600/50'
                  : 'bg-void-800/80 border-earth-800/40 opacity-70'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-medium text-amber-50">{def.name}</span>
                  <span className="text-amber-100/60 text-sm ml-2">×{count}</span>
                </div>
                <div className="text-xs text-amber-100/60">
                  {formatShort(cost)} energii · +{formatShort(parseDecimal(def.baseProduction))}/s · siła {def.basePower}
                </div>
              </div>
              {unlocked ? (
                <>
                  <button
                    type="button"
                    onClick={() => onSummon(def.id)}
                    disabled={!canBuy}
                    className="mt-2 w-full py-2 rounded-lg font-display text-sm transition bg-forest-600 hover:bg-forest-500 disabled:bg-void-600 disabled:text-amber-100/50 disabled:cursor-not-allowed text-white border border-forest-500/20"
                  >
                    {`Przywołaj (${formatShort(cost)})`}
                  </button>
                  {!canBuy && (
                    <p className="mt-1 text-xs text-forest-300/90">
                      Twoje rytuały są zbyt słabe – zgromadź więcej złej energii.
                    </p>
                  )}
                </>
              ) : (
                <p className="mt-2 text-xs text-amber-100/50">
                  Odblokuj: {formatShort(parseDecimal(def.unlockAtGold))} złota
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
