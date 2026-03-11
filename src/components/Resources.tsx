import type Decimal from 'break_eternity.js'
import { fromState, formatShort } from '../game/decimal'

interface ResourcesProps {
  energy: string
  gold: string
  productionPerSecond: Decimal
  onTapEnergy?: () => void
}

export function Resources({ energy, gold, productionPerSecond, onTapEnergy }: ResourcesProps) {
  const energyDec = fromState(energy)
  const goldDec = fromState(gold)
  return (
    <section
      className="card-fantasy bg-void-800/95 border-earth-700/50 p-4"
      aria-label="Zasoby"
    >
      <h3 className="font-display text-forest-400 font-semibold mb-3 text-base">
        Zasoby
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-void-700/80 border border-earth-800/40 p-3 shadow-inner">
          <div className="text-amber-100/70 text-xs uppercase tracking-wider font-display">
            Zła energia
          </div>
          <div className="text-forest-400 font-semibold text-lg tabular-nums">
            {formatShort(energyDec)}
          </div>
          <div className="text-amber-100/50 text-sm">
            +{formatShort(productionPerSecond)}/s
          </div>
        </div>
        <div className="rounded-lg bg-void-700/80 border border-earth-800/40 p-3 shadow-inner">
          <div className="text-amber-100/70 text-xs uppercase tracking-wider font-display">
            Złoto
          </div>
          <div className="text-gold-400 font-semibold text-lg tabular-nums">
            {formatShort(goldDec)}
          </div>
        </div>
      </div>
      {onTapEnergy && (
        <button
          type="button"
          onClick={onTapEnergy}
          className="mt-4 w-full py-3 rounded-lg font-display font-semibold text-sm sm:text-base bg-forest-600 hover:bg-forest-500 text-white shadow-lg transition active:scale-[0.98] btn-glow border border-forest-500/30"
        >
          Zbierz złą energię
          <span className="block text-[11px] sm:text-xs font-normal text-forest-100/90 mt-0.5">
            Kliknij, by przyspieszyć mroczne rytuały
          </span>
        </button>
      )}
    </section>
  )
}
