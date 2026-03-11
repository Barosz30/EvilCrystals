type T = (key: string) => string

interface MageHeaderProps {
  t: T
  mana: number
  totalManaPerSec: number
  playerName: string
}

export function MageHeader({ t, mana, totalManaPerSec, playerName }: MageHeaderProps) {
  return (
    <header className="text-center space-y-2">
      <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-4 py-1 border border-slate-700/70">
        <span className="text-lg">🧙‍♂️</span>
        <span className="font-gothic text-xs tracking-[0.25em] text-parchment uppercase">
          {t('ui.title')}
        </span>
      </div>
      <div className="mt-3 flex flex-col items-center gap-1">
        <div className="font-gothic text-4xl sm:text-5xl font-black text-emerald-300 text-shadow-glow-green tabular-nums">
          {Math.floor(mana)}
        </div>
        <span className="font-gothic text-xs tracking-[0.35em] text-parchment uppercase">
          {t('ui.mana')}
        </span>
        <span className="text-[11px] text-muted-foreground">
          +{totalManaPerSec.toFixed(1)} {t('ui.perSecond')}
        </span>
        <span className="mt-1 text-[11px] text-slate-300">
          {t('ui.playerName')}: <span className="font-semibold">{playerName}</span>
        </span>
      </div>
    </header>
  )
}
