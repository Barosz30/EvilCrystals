import { CREATURE_IMAGES } from '../constants'
import type { Creature } from '../useMageGameState'

type T = (key: string) => string

interface MageSceneProps {
  t: T
  creatures: Creature[]
  creatureMult: number
}

export function MageScene({ t, creatures, creatureMult }: MageSceneProps) {
  const withCount = creatures.filter((c) => c.count > 0)

  return (
    <section className="w-full max-w-3xl rounded-3xl bg-slate-950/40 border border-slate-700/70 scene-vignette relative overflow-visible px-6 py-6 mt-2 min-h-[200px]">
      <div className="flex flex-col items-center gap-6">
        <div className="mage-sprite h-44 w-40 shrink-0 rounded-3xl bg-gradient-to-b from-slate-900 to-black border border-emerald-500/60 shadow-glow-green flex items-end justify-center px-3 pb-3 overflow-hidden">
          <img
            src="/assets/evil-mage.png"
            alt={t('ui.altMage')}
            className="h-full w-auto object-contain drop-shadow-[0_0_25px_rgba(34,197,94,0.55)]"
          />
        </div>

        {withCount.length > 0 && (
          <div className="imp-floating flex flex-wrap items-stretch justify-center gap-4 w-full">
            {withCount.map((c) => (
              <div
                key={c.id}
                className="rounded-3xl border border-purple-500/80 bg-gradient-to-b from-slate-800/95 to-slate-900 px-5 py-4 shadow-glow-purple flex flex-col items-center gap-3 min-w-[150px]"
              >
                <div className="h-20 w-16 rounded-2xl bg-gradient-to-b from-slate-600/80 to-slate-700/90 border border-purple-500/60 flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.9)] overflow-hidden">
                  <img
                    src={CREATURE_IMAGES[c.id] ?? CREATURE_IMAGES.imp}
                    alt={c.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="text-[11px] text-parchment text-center leading-tight">
                  <div className="font-gothic tracking-[0.25em] uppercase text-[10px] text-emerald-200">
                    {t(`creature.${c.id}`)}
                  </div>
                  <div className="mt-1 text-emerald-300">
                    ×{c.count} · +{(c.manaPerSec * creatureMult).toFixed(1)} {t('ui.manaUnit')}/s
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
