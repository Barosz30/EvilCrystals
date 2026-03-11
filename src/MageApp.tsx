import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from 'react'
import { createPortal } from 'react-dom'
import { useMageGameState } from './mage/useMageGameState'
import { useLanguage } from './i18n/LanguageContext'
import type { LangCode } from './i18n/translations'
import {
  MageHeader,
  SummonManaButton,
  MageScene,
  YourArmySection,
  CreatureShopSection,
  ResetRaidPanel,
  ApocalypsePanel,
  AchievementToast,
  AmbientDust,
  SettingsModal,
  UpgradesModal,
  StatsModal,
  AchievementsModal
} from './mage/components'

const LANG_CODES: LangCode[] = ['en', 'pl', 'es', 'de', 'fr', 'it', 'pt', 'ru', 'zh', 'ja']

const ARMY_VIEW_STORAGE_KEY = 'mage-army-view'
type ArmyView = 'scene' | 'army'

function useArmyView(): [ArmyView, Dispatch<SetStateAction<ArmyView>>] {
  const [view, setView] = useState<ArmyView>(() => {
    try {
      const v = localStorage.getItem(ARMY_VIEW_STORAGE_KEY)
      if (v === 'scene' || v === 'army') return v
    } catch {}
    return 'scene'
  })
  useEffect(() => {
    try {
      localStorage.setItem(ARMY_VIEW_STORAGE_KEY, view)
    } catch {}
  }, [view])
  return [view, setView]
}

function usePlayerName() {
  const [playerName, setPlayerName] = useState('Mroczny Władca')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mage-player-name')
      if (stored) setPlayerName(stored)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('mage-player-name', playerName)
    } catch {}
  }, [playerName])

  return [playerName, setPlayerName] as const
}

export default function MageApp() {
  const game = useMageGameState()
  const { t, lang, setLang, langNames } = useLanguage()
  const [playerName, setPlayerName] = usePlayerName()
  const [armyView, setArmyView] = useArmyView()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [upgradesOpen, setUpgradesOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  const [achievementsOpen, setAchievementsOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const langDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (settingsOpen || upgradesOpen || statsOpen || achievementsOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [settingsOpen, upgradesOpen, statsOpen, achievementsOpen])

  useEffect(() => {
    if (!langDropdownOpen) return
    const onOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [langDropdownOpen])

  return (
    <div
      className={`min-h-screen bg-dark-gradient text-foreground font-body relative ${
        settingsOpen || upgradesOpen || statsOpen || achievementsOpen ? 'hidden' : ''
      }`}
      aria-hidden={settingsOpen || upgradesOpen || statsOpen || achievementsOpen}
    >
      <div className="fixed top-4 right-4 z-50 flex flex-wrap gap-2 justify-end">
        <button
          type="button"
          onClick={() => setStatsOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/80 bg-slate-900/90 text-lg shadow-lg backdrop-blur-sm hover:border-emerald-500/60 hover:bg-slate-800/90"
          aria-label={t('ui.stats')}
        >
          📊
        </button>
        <button
          type="button"
          onClick={() => setAchievementsOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-500/70 bg-slate-900/90 text-lg shadow-lg backdrop-blur-sm hover:border-amber-400/80 hover:bg-slate-800/90"
          aria-label={t('ui.achievements')}
        >
          🏆
        </button>
        <button
          type="button"
          onClick={() => setUpgradesOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-purple-500/70 bg-slate-900/90 text-lg shadow-lg backdrop-blur-sm hover:border-purple-400/80 hover:bg-slate-800/90"
          aria-label={t('ui.upgrades')}
        >
          ✨
        </button>
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
        <AchievementToast t={t} achievementId={game.newAchievement} />
      )}

      <AmbientDust />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center px-4 py-8 space-y-8">
        <MageHeader t={t} mana={game.mana} totalManaPerSec={game.totalManaPerSec} playerName={playerName} />

        <SummonManaButton t={t} clickPower={game.clickPower} onSummon={game.handleClick} />

        <div className="w-full max-w-3xl relative">
          <button
            type="button"
            onClick={() => setArmyView((v) => (v === 'scene' ? 'army' : 'scene'))}
            className="absolute top-3 right-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-600/80 bg-slate-800/80 text-parchment/90 transition-colors hover:border-emerald-500/50 hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 z-10"
            aria-label={armyView === 'scene' ? t('ui.armyViewList') : t('ui.armyViewScene')}
            title={armyView === 'scene' ? t('ui.armyViewList') : t('ui.armyViewScene')}
          >
            <span
              className={`inline-block text-[10px] font-bold transition-transform ${armyView === 'army' ? 'rotate-[-90deg]' : ''}`}
              aria-hidden
            >
              ▼
            </span>
          </button>
          {armyView === 'scene' ? (
            <MageScene t={t} creatures={game.creatures} creatureMult={game.creatureMult} />
          ) : (
            <YourArmySection t={t} creatures={game.creatures} creatureMult={game.creatureMult} />
          )}
        </div>

        <CreatureShopSection
          t={t}
          creatures={game.creatures}
          mana={game.mana}
          discount={game.discount}
          creatureMult={game.creatureMult}
          onBuy={game.buyCreature}
        />

        <section className="w-full max-w-3xl grid gap-4 sm:grid-cols-2">
          <ResetRaidPanel
            t={t}
            totalCreatures={game.totalCreatures}
            goldOnReset={game.goldOnReset}
            gold={game.gold}
            goldUpgrades={game.goldUpgrades}
            onReset={game.handleReset}
            onBuyGoldUpgrade={game.buyGoldUpgrade}
          />
          <ApocalypsePanel
            t={t}
            resets={game.resets}
            apocalypses={game.apocalypses}
            crystalsOnApocalypse={game.crystalsOnApocalypse}
            darkCrystals={game.darkCrystals}
            gold={game.gold}
            crystalUpgrades={game.crystalUpgrades}
            onApocalypse={game.handleApocalypse}
            onBuyCrystalUpgrade={game.buyCrystalUpgrade}
          />
        </section>
      </main>

      {settingsOpen &&
        createPortal(
          <SettingsModal
            t={t}
            langNames={langNames}
            lang={lang}
            langCodes={LANG_CODES}
            playerName={playerName}
            onPlayerNameChange={setPlayerName}
            onClose={() => setSettingsOpen(false)}
            onSave={game.saveNow}
            onLoad={game.loadFromStorage}
            langDropdownOpen={langDropdownOpen}
            onLangDropdownToggle={() => setLangDropdownOpen((o) => !o)}
            onLangSelect={(code) => {
              setLang(code)
              setLangDropdownOpen(false)
            }}
            langDropdownRef={langDropdownRef}
          />,
          document.body
        )}

      {upgradesOpen &&
        createPortal(
          <UpgradesModal
            t={t}
            lang={lang}
            upgrades={game.upgrades}
            mana={game.mana}
            onBuy={game.buyUpgrade}
            onClose={() => setUpgradesOpen(false)}
          />,
          document.body
        )}

      {statsOpen &&
        createPortal(
          <StatsModal t={t} stats={game.stats} onClose={() => setStatsOpen(false)} />,
          document.body
        )}

      {achievementsOpen &&
        createPortal(
          <AchievementsModal
            t={t}
            achievements={game.achievements}
            onClose={() => setAchievementsOpen(false)}
          />,
          document.body
        )}
    </div>
  )
}
