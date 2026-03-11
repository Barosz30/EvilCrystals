import type { CrystalUpgrade } from '../useMageGameState'

type T = (key: string) => string

interface ApocalypsePanelProps {
  t: T
  resets: number
  apocalypses: number
  crystalsOnApocalypse: number
  darkCrystals: number
  gold: number
  crystalUpgrades: CrystalUpgrade[]
  onApocalypse: () => void
  onBuyCrystalUpgrade: (id: string) => void
}

export function ApocalypsePanel({
  t,
  resets,
  apocalypses,
  crystalsOnApocalypse,
  darkCrystals,
  gold,
  crystalUpgrades,
  onApocalypse,
  onBuyCrystalUpgrade
}: ApocalypsePanelProps) {
  const canApocalypse = gold >= 10 || resets >= 3

  return (
    <div className="rounded-2xl bg-slate-950/70 border border-purple-500/50 p-4 space-y-3">
      <h3 className="font-gothic text-xs tracking-[0.3em] text-purple-200 uppercase">
        💀 {t('ui.apocalypse')}
      </h3>
      <p className="text-[11px] text-muted-foreground">{t('ui.apocalypseDesc')}</p>
      <div className="flex items-center justify-between text-xs text-parchment">
        <div className="space-x-2">
          <span>
            {t('ui.resetsLabel')}: <span className="font-semibold">{resets}</span>
          </span>
          <span>
            {t('ui.apocalypsesLabel')}: <span className="font-semibold">{apocalypses}</span>
          </span>
        </div>
        <div className="text-purple-300">
          {t('ui.reward')}: <span className="font-semibold">{crystalsOnApocalypse}</span>{' '}
          {t('ui.crystalsUnit')}
        </div>
      </div>
      <button
        type="button"
        onClick={onApocalypse}
        disabled={!canApocalypse}
        className="mt-1 w-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-600 py-2 text-xs font-semibold text-slate-50 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t('ui.apocalypseButton')}
      </button>

      {crystalUpgrades.length > 0 && (
        <div className="mt-3 space-y-2">
          {crystalUpgrades.map((u) => {
            const canAfford = darkCrystals >= u.cost
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => canAfford && onBuyCrystalUpgrade(u.id)}
                disabled={!canAfford}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-[11px] transition ${
                  canAfford
                    ? 'bg-slate-900/80 border-purple-400/70 shadow-glow-purple'
                    : 'bg-slate-900/50 border-slate-700/70 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{u.icon}</span>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-parchment">
                        {t(`crystalUpgrade.${u.id}.name`)}
                      </span>
                      {u.owned > 0 && (
                        <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] text-purple-200">
                          ×{u.owned}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {t(`crystalUpgrade.${u.id}.desc`)}
                    </div>
                  </div>
                </div>
                <div className="text-right text-[11px]">
                  <div className="text-purple-200 flex items-center gap-1 justify-end">
                    <span>🔮</span>
                    <span>{u.cost}</span>
                  </div>
                  {!canAfford && (
                    <div className="text-[10px] text-muted-foreground">
                      {t('ui.notEnoughCrystals')}
                    </div>
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
