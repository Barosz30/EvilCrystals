import type { GameState } from '../game/types'
import type Decimal from 'break_eternity.js'
import { fromState } from '../game/decimal'

interface RaidPanelProps {
  state: GameState
  armyPower: number
  canStartRaid: (state: GameState) => boolean
  onStartRaid: () => void
  formatShort: (d: Decimal) => string
}

const RAID_DURATION_SEC = 30

export function RaidPanel({
  state,
  armyPower,
  canStartRaid,
  onStartRaid,
  formatShort
}: RaidPanelProps) {
  const inProgress = state.raidInProgress
  const remaining =
    inProgress && state.raidEndsAt
      ? Math.max(0, Math.ceil((state.raidEndsAt - Date.now()) / 1000))
      : 0

  return (
    <section
      className="card-fantasy bg-void-800/95 border-earth-700/50 p-4"
      aria-label="Raid"
    >
      <h2 className="font-display text-forest-400 font-semibold mb-3 text-lg">
        Raid na ludzkość
      </h2>
      <p className="text-amber-100/80 text-sm mb-3">
        Siła armii: <strong className="text-gold-400">{armyPower}</strong>. Raid
        trwa {RAID_DURATION_SEC}s – dostaniesz złoto, ale stracisz część armii.
      </p>
      {inProgress ? (
        <div className="py-3 text-center">
          <p className="text-forest-400 font-medium">Raid w toku...</p>
          <p className="text-2xl font-display tabular-nums text-gold-400 mt-1">
            {remaining}s
          </p>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={onStartRaid}
            disabled={!canStartRaid(state)}
            className="w-full py-3 rounded-lg font-display font-semibold bg-gold-600 hover:bg-gold-500 disabled:bg-void-600 disabled:text-amber-100/50 disabled:cursor-not-allowed text-void-900 transition border border-gold-500/30"
          >
            Rozpocznij raid
          </button>
          {!canStartRaid(state) && (
            <p className="mt-1 text-xs text-forest-300/90">
              Twoja armia jest zbyt żałosna, by splądrować ludzkość.
            </p>
          )}
        </>
      )}
      {state.totalRaids > 0 && (
        <p className="mt-2 text-xs text-amber-100/50">
          Łącznie rajdów: {state.totalRaids} · Zebrane złoto: {formatShort(fromState(state.totalGoldEarned))}
        </p>
      )}
    </section>
  )
}
