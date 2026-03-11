import type { GoldUpgrade } from '../useMageGameState'

type T = (key: string) => string

interface ResetRaidPanelProps {
  t: T
  totalCreatures: number
  goldOnReset: number
  gold: number
  goldUpgrades: GoldUpgrade[]
  onReset: () => void
  onBuyGoldUpgrade: (id: string) => void
}

export function ResetRaidPanel({
  t,
  totalCreatures,
  goldOnReset,
  gold,
  goldUpgrades,
  onReset,
  onBuyGoldUpgrade
}: ResetRaidPanelProps) {
  return (
    <div className="rounded-2xl bg-slate-950/70 border border-amber-500/50 p-4 space-y-3">
      <h3 className="font-gothic text-xs tracking-[0.3em] text-amber-200 uppercase">
        🔄 {t('ui.resetRaid')}
      </h3>
      <p className="text-[11px] text-muted-foreground">{t('ui.resetDesc')}</p>
      <div className="flex items-center justify-between text-xs">
        <div className="text-parchment">
          {t('ui.creaturesLabel')}:{' '}
          <span className="font-semibold text-emerald-200">{totalCreatures}</span>
        </div>
        <div className="text-amber-300">
          {t('ui.reward')}: <span className="font-semibold">{goldOnReset}</span> {t('ui.goldUnit')}
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        disabled={totalCreatures < 5}
        className="mt-1 w-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 py-2 text-xs font-semibold text-slate-950 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t('ui.resetButton')}
      </button>

      {goldUpgrades.length > 0 && (
        <div className="mt-3 space-y-2">
          {goldUpgrades.map((u) => {
            const canAfford = gold >= u.cost
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => canAfford && onBuyGoldUpgrade(u.id)}
                disabled={!canAfford}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-[11px] transition ${
                  canAfford
                    ? 'bg-slate-900/80 border-amber-400/70 shadow-glow-green'
                    : 'bg-slate-900/50 border-slate-700/70 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{u.icon}</span>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-parchment">{t(`goldUpgrade.${u.id}.name`)}</span>
                      {u.owned > 0 && (
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-200">
                          ×{u.owned}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {t(`goldUpgrade.${u.id}.desc`)}
                    </div>
                  </div>
                </div>
                <div className="text-right text-[11px]">
                  <div className="text-parchment flex items-center gap-1 justify-end">
                    <span>🪙</span>
                    <span>{u.cost}</span>
                  </div>
                  {!canAfford && (
                    <div className="text-[10px] text-muted-foreground">{t('ui.notEnoughGold')}</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
