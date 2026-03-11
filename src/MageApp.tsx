import { useState, useRef, useEffect } from 'react'
import { useMageGameState, getCost } from './mage/useMageGameState'
import { useLanguage } from './i18n/LanguageContext'
import type { LangCode } from './i18n/translations'

const CREATURE_ICONS: Record<string, string> = {
  imp: '👿',
  skeleton: '💀',
  wraith: '👻',
  golem: '🪨',
  dragon: '🐉',
  lich: '🧙'
}

const CREATURE_IMAGES: Record<string, string> = {
  imp: '/assets/creature-imp.png',
  skeleton: '/assets/creature-skeleton.png',
  wraith: '/assets/creature-wraith.png',
  golem: '/assets/creature-golem.png',
  dragon: '/assets/creature-dragon.png',
  lich: '/assets/creature-lich.png'
}

export default function MageApp() {
  const game = useMageGameState()
  const { t, lang, setLang, langNames } = useLanguage()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [playerName, setPlayerName] = useState('Mroczny Władca')
  const langMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const storedName = localStorage.getItem('mage-player-name')
      if (storedName) setPlayerName(storedName)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('mage-player-name', playerName)
    } catch {}
  }, [playerName])

  const unlockedCount = game.achievements.filter((a) => a.unlocked).length

  const langCodes: LangCode[] = ['pl', 'en', 'es', 'de', 'fr', 'it', 'pt', 'ru', 'zh', 'ja']

  return (
    <div className="min-h-screen bg-dark-gradient text-foreground font-body relative">
      {/* Settings button - top right */}
      <div className="fixed top-4 right-4 z-50" ref={langMenuRef}>
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/80 bg-slate-900/90 text-lg shadow-lg backdrop-blur-sm hover:border-emerald-500/60 hover:bg-slate-800/90"
          aria-label={t('ui.settings')}
        >
          ⚙️
        </button>
      </div>

      {game.newAchievement && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-emerald-400/60 bg-slate-950/90 px-6 py-3 shadow-glow-green backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div className="leading-tight">
              <div className="font-gothic text-[11px] uppercase tracking-[0.25em] text-emerald-200">
                {t('ui.achievementUnlocked')}
              </div>
              <div className="font-gothic text-sm font-semibold text-parchment">
                {t(`achievement.${game.newAchievement}.name`)}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="ambient-dust" aria-hidden="true">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <span key={i} />
        ))}
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center px-4 py-8 space-y-8">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-4 py-1 border border-slate-700/70">
            <span className="text-lg">🧙‍♂️</span>
            <span className="font-gothic text-xs tracking-[0.25em] text-parchment uppercase">
              {t('ui.title')}
            </span>
          </div>
          <div className="mt-3 flex flex-col items-center gap-1">
            <div className="font-gothic text-4xl sm:text-5xl font-black text-emerald-300 text-shadow-glow-green tabular-nums">
              {Math.floor(game.mana)}
            </div>
            <span className="font-gothic text-xs tracking-[0.35em] text-parchment uppercase">
              {t('ui.mana')}
            </span>
            <span className="text-[11px] text-muted-foreground">
              +{game.totalManaPerSec.toFixed(1)} {t('ui.perSecond')}
            </span>
            <span className="mt-1 text-[11px] text-slate-300">
              {t('ui.playerName')}: <span className="font-semibold">{playerName}</span>
            </span>
          </div>
        </header>

        <section className="w-full max-w-md">
          <button
            type="button"
            onClick={game.handleClick}
            className="relative w-full overflow-hidden rounded-full border border-emerald-400/60 bg-gradient-to-b from-emerald-500/90 to-emerald-600/90 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow-green transition active:scale-[0.98]"
          >
            <span className="relative z-10 flex flex-col items-center">
              <span className="uppercase tracking-[0.25em] text-[11px]">{t('ui.summonMana')}</span>
              <span className="text-[11px] text-emerald-100/90 mt-0.5">
                +{game.clickPower.toFixed(0)} {t('ui.manaPerClick')}
              </span>
            </span>
            <span className="pointer-events-none absolute inset-0 rounded-full bg-emerald-400/20 blur-xl" />
          </button>
        </section>

        <section className="w-full max-w-3xl rounded-3xl bg-slate-950/40 border border-slate-700/70 scene-vignette relative overflow-visible px-6 py-6 mt-2 min-h-[200px]">
          <div className="flex flex-col items-center gap-6">
            <div className="mage-sprite h-44 w-40 shrink-0 rounded-3xl bg-gradient-to-b from-slate-900 to-black border border-emerald-500/60 shadow-glow-green flex items-end justify-center px-3 pb-3 overflow-hidden">
              <img
                src="/assets/evil-mage.png"
                alt={t('ui.altMage')}
                className="h-full w-auto object-contain drop-shadow-[0_0_25px_rgba(34,197,94,0.55)]"
              />
            </div>

            {game.creatures.some((c) => c.count > 0) && (
              <div className="imp-floating flex flex-wrap items-stretch justify-center gap-4 w-full">
                {game.creatures
                  .filter((c) => c.count > 0)
                  .map((c) => (
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
                          ×{c.count} · +
                          {(c.manaPerSec * game.creatureMult).toFixed(1)} {t('ui.manaUnit')}/s
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </section>

        <section className="w-full max-w-3xl">
          <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 px-4 py-4">
            <h2 className="font-gothic text-xs tracking-[0.3em] text-parchment uppercase mb-3">
              {t('ui.yourArmy')}
            </h2>
            {game.creatures.every((c) => c.count === 0) ? (
              <p className="text-[12px] text-muted-foreground italic">
                {t('ui.summonFirst')}
              </p>
            ) : (
              <div className="flex flex-wrap gap-3 justify-start">
                {game.creatures
                  .filter((c) => c.count > 0)
                  .map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2 min-w-[130px]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-slate-600/80 to-slate-700/90 border border-slate-500/70 overflow-hidden">
                        <img
                          src={CREATURE_IMAGES[c.id] ?? CREATURE_IMAGES.imp}
                          alt={c.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="text-[11px] leading-tight">
                        <div className="font-semibold text-parchment">
                          {t(`creature.${c.id}`)}{' '}
                          <span className="text-xs text-slate-400 align-middle">
                            ×{c.count}
                          </span>
                        </div>
                        <div className="text-[10px] text-emerald-200">
                          +{(c.manaPerSec * game.creatureMult).toFixed(1)} {t('ui.manaUnit')}/s
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </section>

        <section className="w-full max-w-3xl space-y-3">
          <h2 className="font-gothic text-sm tracking-[0.3em] text-parchment uppercase text-shadow-glow-green">
            🏪 {t('ui.summonCreatures')}
          </h2>
          <div className="space-y-2">
            {game.creatures.map((c) => {
              const cost = getCost(c.baseCost, c.count, game.discount)
              const canAfford = game.mana >= cost
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => game.buyCreature(c.id)}
                  disabled={!canAfford}
                  className={`w-full rounded-2xl border px-4 py-3 flex items-center justify-between text-left transition ${
                    canAfford
                      ? 'bg-slate-900/80 border-emerald-500/70 shadow-glow-green'
                      : 'bg-slate-900/60 border-slate-700/70 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-600/80 text-lg">
                      {CREATURE_ICONS[c.id] ?? '❓'}
                    </div>
                    <div>
                      <div className="font-medium text-slate-100">
                        {t(`creature.${c.id}`)}{' '}
                        <span className="text-xs text-slate-400 align-middle">
                          ×{c.count}
                        </span>
                      </div>
                      <div className="text-xs text-emerald-200">
                        +{(c.manaPerSec * game.creatureMult).toFixed(1)} {t('ui.manaUnit')}/s
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-parchment">
                      {Math.floor(cost)} {t('ui.manaUnit')}
                    </div>
                    {!canAfford && (
                      <div className="text-[11px] text-muted-foreground">
                        {t('ui.notEnoughMana')}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section className="w-full max-w-3xl space-y-3">
          <h2 className="font-gothic text-sm tracking-[0.3em] text-parchment uppercase text-shadow-glow-purple">
            ✨ {t('ui.upgrades')}
          </h2>
          <div className="space-y-2">
            {game.upgrades.map((u) => {
              const canAfford = game.mana >= u.cost
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => game.buyUpgrade(u.id)}
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
                    <div className="text-parchment">{u.cost} {t('ui.manaUnit')}</div>
                    {!canAfford && (
                      <div className="text-[11px] text-muted-foreground">
                        {t('ui.notEnoughMana')}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section className="w-full max-w-3xl grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-950/70 border border-amber-500/50 p-4 space-y-3">
            <h3 className="font-gothic text-xs tracking-[0.3em] text-amber-200 uppercase">
              🔄 {t('ui.resetRaid')}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {t('ui.resetDesc')}
            </p>
            <div className="flex items-center justify-between text-xs">
              <div className="text-parchment">
                {t('ui.creaturesLabel')}:{' '}
                <span className="font-semibold text-emerald-200">
                  {game.totalCreatures}
                </span>
              </div>
              <div className="text-amber-300">
                {t('ui.reward')}:{' '}
                <span className="font-semibold">{game.goldOnReset}</span> {t('ui.goldUnit')}
              </div>
            </div>
            <button
              type="button"
              onClick={game.handleReset}
              disabled={game.totalCreatures < 5}
              className="mt-1 w-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 py-2 text-xs font-semibold text-slate-950 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('ui.resetButton')}
            </button>

            {game.goldUpgrades.length > 0 && (
              <div className="mt-3 space-y-2">
                {game.goldUpgrades.map((u) => {
                  const canAfford = game.gold >= u.cost
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => canAfford && game.buyGoldUpgrade(u.id)}
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
                          <div className="text-[10px] text-muted-foreground">
                            {t('ui.notEnoughGold')}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-slate-950/70 border border-purple-500/50 p-4 space-y-3">
            <h3 className="font-gothic text-xs tracking-[0.3em] text-purple-200 uppercase">
              💀 {t('ui.apocalypse')}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {t('ui.apocalypseDesc')}
            </p>
            <div className="flex items-center justify-between text-xs text-parchment">
              <div className="space-x-2">
                <span>
                  {t('ui.resetsLabel')}:{' '}
                  <span className="font-semibold">{game.resets}</span>
                </span>
                <span>
                  {t('ui.apocalypsesLabel')}:{' '}
                  <span className="font-semibold">{game.apocalypses}</span>
                </span>
              </div>
              <div className="text-purple-300">
                {t('ui.reward')}:{' '}
                <span className="font-semibold">{game.crystalsOnApocalypse}</span> {t('ui.crystalsUnit')}
              </div>
            </div>
            <button
              type="button"
              onClick={game.handleApocalypse}
              disabled={game.gold < 10 && game.resets < 3}
              className="mt-1 w-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-600 py-2 text-xs font-semibold text-slate-50 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('ui.apocalypseButton')}
            </button>

            {game.crystalUpgrades.length > 0 && (
              <div className="mt-3 space-y-2">
                {game.crystalUpgrades.map((u) => {
                  const canAfford = game.darkCrystals >= u.cost
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => canAfford && game.buyCrystalUpgrade(u.id)}
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
                            <span className="font-semibold text-parchment">{t(`crystalUpgrade.${u.id}.name`)}</span>
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
        </section>

        <section className="w-full max-w-3xl space-y-3">
          <h2 className="font-gothic text-sm tracking-[0.3em] text-parchment uppercase">
            📊 {t('ui.stats')}
          </h2>
          <div className="grid gap-3 sm:grid-cols-3 text-[11px]">
            <div className="rounded-xl bg-slate-950/70 border border-slate-700/70 p-3 space-y-1">
              <div className="text-muted-foreground">{t('ui.totalMana')}</div>
              <div className="text-parchment text-sm">
                {game.stats.totalManaEarned.toFixed(1)}
              </div>
            </div>
            <div className="rounded-xl bg-slate-950/70 border border-slate-700/70 p-3 space-y-1">
              <div className="text-muted-foreground">{t('ui.totalClicks')}</div>
              <div className="text-parchment text-sm">{game.stats.totalClicks}</div>
            </div>
            <div className="rounded-xl bg-slate-950/70 border border-slate-700/70 p-3 space-y-1">
              <div className="text-muted-foreground">{t('ui.peakManaPerSec')}</div>
              <div className="text-parchment text-sm">
                {game.stats.peakManaPerSec.toFixed(1)}
              </div>
            </div>
            <div className="rounded-xl bg-slate-950/70 border border-slate-700/70 p-3 space-y-1">
              <div className="text-muted-foreground">{t('ui.creaturesBought')}</div>
              <div className="text-parchment text-sm">
                {game.stats.totalCreaturesBought}
              </div>
            </div>
            <div className="rounded-xl bg-slate-950/70 border border-slate-700/70 p-3 space-y-1">
              <div className="text-muted-foreground">{t('ui.totalGold')}</div>
              <div className="text-parchment text-sm">
                {game.stats.totalGoldEarned}
              </div>
            </div>
            <div className="rounded-xl bg-slate-950/70 border border-slate-700/70 p-3 space-y-1">
              <div className="text-muted-foreground">{t('ui.totalCrystals')}</div>
              <div className="text-parchment text-sm">
                {game.stats.totalCrystalsEarned}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full max-w-3xl space-y-3 pb-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-gothic text-sm tracking-[0.3em] text-parchment uppercase">
              🏆 {t('ui.achievements')}
            </h2>
            <span className="text-[11px] text-muted-foreground">
              {unlockedCount}/{game.achievements.length} {t('ui.unlocked')}
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 text-[11px]">
            {game.achievements.slice(0, 9).map((a) => (
              <div
                key={a.id}
                className={`rounded-xl border px-3 py-2 space-y-1 ${
                  a.unlocked
                    ? 'bg-slate-900/80 border-emerald-400/70 shadow-glow-green'
                    : 'bg-slate-900/40 border-slate-700/80 opacity-70'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{a.icon}</span>
                  <span className="font-semibold text-parchment text-[11px]">
                    {t(`achievement.${a.id}.name`)}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {t(`achievement.${a.id}.desc`)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950/95 p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="font-gothic text-sm tracking-[0.3em] text-parchment uppercase">
                  {t('ui.settings')}
                </h2>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t('ui.settingsDesc')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="h-7 w-7 rounded-full border border-slate-600/80 bg-slate-900/80 text-xs hover:border-emerald-500/60"
                aria-label={t('ui.close')}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-[12px]">
              <div className="space-y-1">
                <label className="block text-xs text-parchment mb-1">
                  {t('ui.playerName')}
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-1.5 text-sm text-parchment outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                  placeholder="Mroczny Władca"
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-parchment">
                  {t('ui.saveGame')}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={game.saveNow}
                    className="flex items-center justify-center gap-2 rounded-md border border-emerald-500/70 bg-slate-900/80 px-3 py-2 text-xs text-parchment hover:bg-slate-800/90"
                  >
                    <span>💾</span>
                    <span>{t('ui.saveGame')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={game.loadFromStorage}
                    className="flex items-center justify-center gap-2 rounded-md border border-slate-600/80 bg-slate-900/80 px-3 py-2 text-xs text-parchment hover:bg-slate-800/90"
                  >
                    <span>📂</span>
                    <span>{t('ui.loadGame')}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-parchment">
                  {t('ui.googleLogin')}
                </div>
                <button
                  type="button"
                  disabled
                  className="flex w-full items-center gap-2 rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-muted-foreground opacity-70 cursor-not-allowed"
                >
                  <span className="text-lg">🟦</span>
                  <span>{t('ui.googleLoginSoon')}</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-parchment">
                  {t('ui.language')}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {langCodes.slice(0, 6).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setLang(code)}
                      className={`rounded-md px-2 py-1.5 text-[11px] border transition ${
                        code === lang
                          ? 'border-emerald-500/80 bg-emerald-500/15 text-emerald-200'
                          : 'border-slate-700 bg-slate-900/80 text-parchment hover:border-emerald-500/60'
                      }`}
                    >
                      {langNames[code]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


