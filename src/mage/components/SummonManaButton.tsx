type T = (key: string) => string

interface SummonManaButtonProps {
  t: T
  clickPower: number
  onSummon: () => void
}

export function SummonManaButton({ t, clickPower, onSummon }: SummonManaButtonProps) {
  return (
    <section className="w-full max-w-md">
      <button
        type="button"
        onClick={onSummon}
        className="relative w-full overflow-hidden rounded-full border border-emerald-400/60 bg-gradient-to-b from-emerald-500/90 to-emerald-600/90 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow-green transition active:scale-[0.98]"
      >
        <span className="relative z-10 flex flex-col items-center">
          <span className="uppercase tracking-[0.25em] text-[11px]">{t('ui.summonMana')}</span>
          <span className="text-[11px] text-emerald-100/90 mt-0.5">
            +{clickPower.toFixed(0)} {t('ui.manaPerClick')}
          </span>
        </span>
        <span className="pointer-events-none absolute inset-0 rounded-full bg-emerald-400/20 blur-xl" />
      </button>
    </section>
  )
}
