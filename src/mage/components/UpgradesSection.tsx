import type { Upgrade } from '../useMageGameState'

type T = (key: string) => string

interface UpgradesSectionProps {
  t: T
  upgrades: Upgrade[]
  mana: number
  onBuy: (id: string) => void
}

export function UpgradesSection({ t, upgrades, mana, onBuy }: UpgradesSectionProps) {
  return (
    <section className="w-full max-w-3xl space-y-3">
      <div className="space-y-2">
        {upgrades.map((u) => {
          const canAfford = mana >= u.cost
          return (
            <button
              key={u.id}
              type="button"
              onClick={() => onBuy(u.id)}
              disabled={!canAfford}
              className={`w-full rounded-2xl border px-4 py-3 flex items-center justify-between text-left transition ${
                canAfford
                  ? 'bg-slate-900/80 border-purple-500/70 shadow-glow-purple'
                  : 'bg-slate-900/60 border-slate-700/70 opacity-70'
              }`}
            >
              <div>
                <div className="font-medium text-slate-100 flex items-center gap-2">
                  <span>{u.icon}</span>
                  <span>{t(`upgrade.${u.id}.name`)}</span>
                  <span className="text-xs text-slate-400">×{u.owned}</span>
                </div>
                <div className="text-xs text-muted-foreground">{t(`upgrade.${u.id}.desc`)}</div>
              </div>
              <div className="text-right text-xs">
                <div className="text-parchment">
                  {u.cost} {t('ui.manaUnit')}
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
