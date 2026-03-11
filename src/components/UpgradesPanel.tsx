import type { GameState } from '../game/types'
import type { UpgradeDefinition } from '../game/types'
import type Decimal from 'break_eternity.js'
import { UPGRADES } from '../game/types'

interface UpgradesPanelProps {
  state: GameState
  getUpgradeLevel: (state: GameState, upgradeId: string) => number
  canBuyUpgrade: (state: GameState, def: UpgradeDefinition) => boolean
  upgradeCost: (def: UpgradeDefinition, level: number) => Decimal
  onBuyUpgrade: (upgradeId: string) => void
  formatShort: (d: Decimal) => string
}

export function UpgradesPanel({
  state,
  getUpgradeLevel,
  canBuyUpgrade,
  upgradeCost,
  onBuyUpgrade,
  formatShort
}: UpgradesPanelProps) {
  return (
    <section
      className="card-fantasy bg-void-800/95 border-earth-700/50 p-4"
      aria-label="Ulepszenia"
    >
      <h2 className="font-display text-forest-400 font-semibold mb-3 text-lg">
        Ulepszenia
      </h2>
      <ul className="space-y-2">
        {UPGRADES.map((def) => {
          const level = getUpgradeLevel(state, def.id)
          const maxed = level >= def.maxLevel
          const canBuy = canBuyUpgrade(state, def)
          const cost = upgradeCost(def, level)
          return (
            <li
              key={def.id}
              className="rounded-lg p-3 border border-earth-600/40 bg-void-700/90"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <span className="font-medium text-amber-50">{def.name}</span>
                  <span className="text-amber-100/60 text-sm ml-2">
                    {level}/{def.maxLevel}
                  </span>
                </div>
                <p className="text-xs text-amber-100/70 w-full">{def.description}</p>
              </div>
              {maxed ? (
                <p className="mt-2 text-xs text-forest-400">Maks. poziom</p>
              ) : (
                <button
                  type="button"
                  onClick={() => onBuyUpgrade(def.id)}
                  disabled={!canBuy}
                  className="mt-2 w-full py-2 rounded-lg font-display text-sm bg-gold-600 hover:bg-gold-500 disabled:bg-void-600 disabled:text-amber-100/50 disabled:cursor-not-allowed text-void-900 transition border border-gold-500/30"
                >
                  {formatShort(cost)} złota
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
