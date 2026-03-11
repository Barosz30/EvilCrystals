import type Decimal from 'break_eternity.js'
import type { GameState } from '../game/types'
import { CREATURES } from '../game/types'
import { UPGRADES } from '../game/types'
import { fromState, formatShort } from '../game/decimal'
import { sceneConfig } from '../scene/config'
import { getMonsterSpriteDef, getMonsterSpriteUrl } from '../scene/monsterAssets'
import { LottieCharacter } from './LottieCharacter'
import { SpriteAnimation } from './SpriteAnimation'

function getCreatureCount(state: GameState, creatureId: string): number {
  return state.creatures.find((c) => c.creatureId === creatureId)?.count ?? 0
}

function getUpgradeLevel(state: GameState, upgradeId: string): number {
  return state.upgradeLevels[upgradeId] ?? 0
}

interface ScenePanelProps {
  state: GameState
  productionPerSecond: Decimal
}

/** Rozmiar wyświetlania potworów ze sprite sheetów na scenie (px) */
const SCENE_CREATURE_DISPLAY_SIZE = 80

/** Ikony stworów – sprite lub SVG; bez przesuwania, tylko zmiana klatek (idle / raid). */
function CreatureIcon({ id, count, isRaidInProgress }: { id: string; count: number; isRaidInProgress: boolean }) {
  if (count <= 0) return null
  const scale = 0.9 + Math.min(count, 10) * 0.02
  const spriteDef = getMonsterSpriteDef(id, isRaidInProgress)
  const spriteUrl = getMonsterSpriteUrl(id, isRaidInProgress)
  const useSprite = spriteDef && spriteUrl
  return (
    <div className="scene-creature-wrapper" title={CREATURES.find((c) => c.id === id)?.name} style={{ transform: 'none' }}>
      <div className="scene-creature flex flex-col items-center justify-end">
        <div className="relative flex items-end justify-center" style={{ transform: `scale(${Math.min(scale, 1.15)})`, minWidth: SCENE_CREATURE_DISPLAY_SIZE, minHeight: SCENE_CREATURE_DISPLAY_SIZE }}>
          {useSprite ? (
            <SpriteAnimation
              src={spriteUrl}
              frameCount={spriteDef.frameCount}
              frameWidth={spriteDef.frameWidth}
              frameHeight={spriteDef.frameHeight}
              fps={8}
              displaySize={{ width: SCENE_CREATURE_DISPLAY_SIZE, height: SCENE_CREATURE_DISPLAY_SIZE }}
              loop
            />
          ) : (
            <CreatureSprite id={id} size={SCENE_CREATURE_DISPLAY_SIZE} />
          )}
          <span className="absolute -top-0.5 -right-0.5 min-w-[22px] h-[22px] rounded-full bg-forest-600 text-white text-xs font-display flex items-center justify-center border-2 border-forest-400 shadow-lg">
            {count > 999 ? '999+' : count}
          </span>
        </div>
      </div>
    </div>
  )
}

function CreatureSprite({ id, size = 32 }: { id: string; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 32 32' }
  switch (id) {
    case 'bat':
      return (
        <svg {...common} className="text-red-700 drop-shadow-md">
          <ellipse cx="16" cy="20" rx="10" ry="8" fill="currentColor" />
          <circle cx="16" cy="12" r="6" fill="currentColor" />
          <path d="M10 8 L12 4 L14 8 M22 8 L20 4 L18 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      )
    case 'mushroom':
      return (
        <svg {...common} className="text-red-900 drop-shadow-md">
          <path d="M16 28 L8 18 L12 14 L16 18 L20 14 L24 18 L16 28Z" fill="currentColor" />
          <circle cx="16" cy="10" r="5" fill="currentColor" />
          <path d="M14 6 L16 2 L18 6" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
      )
    case 'golem':
      return (
        <svg {...common} className="text-red-950 drop-shadow-md">
          <path d="M16 30 L6 16 L14 12 L16 16 L18 12 L26 16 Z" fill="currentColor" />
          <circle cx="16" cy="8" r="6" fill="currentColor" />
          <path d="M12 4 L16 0 L20 4 M8 10 L6 6 L10 8" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
      )
    case 'greater_golem':
      return (
        <svg {...common} className="text-purple-900 drop-shadow-lg">
          <path d="M16 30 L4 14 L12 10 L16 14 L20 10 L28 14 Z" fill="currentColor" />
          <circle cx="16" cy="7" r="6" fill="currentColor" />
          <path d="M11 3 L16 0 L21 3 M5 12 L2 8 L8 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      )
    case 'archdemon':
      return (
        <svg {...common} className="text-purple-950 drop-shadow-lg">
          <path d="M16 32 L2 14 L10 8 L16 14 L22 8 L30 14 Z" fill="currentColor" />
          <circle cx="16" cy="6" r="7" fill="currentColor" />
          <path d="M10 2 L16 0 L22 2 M2 14 L0 10 L6 12 M30 14 L32 10 L26 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      )
    default:
      return <div className="rounded-full bg-void-600" style={{ width: size, height: size }} />
  }
}

/** Wizualizacje ulepszeń przy namiocie */
function UpgradeVisual({ upgradeId, level }: { upgradeId: string; level: number }) {
  if (level <= 0) return null
  const intensity = Math.min(level / 10, 1)
  const def = UPGRADES.find((u) => u.id === upgradeId)
  if (!def) return null

  const title = `${def.name} (${level}/${def.maxLevel})`
  if (upgradeId === 'prod_1') {
    return (
      <div className="scene-upgrade absolute left-[8%] bottom-[18%]" title={title}>
        <svg width="28" height="28" viewBox="0 0 32 32" className="drop-shadow-md opacity-90" style={{ opacity: 0.5 + intensity * 0.5 }}>
          <rect x="6" y="10" width="20" height="18" rx="2" fill="#5c5042" stroke="#854d0e" strokeWidth="1" />
          <path d="M10 14 L16 8 L22 14 L16 20 Z" fill="#22c55e" fillOpacity={intensity} />
          <line x1="16" y1="8" x2="16" y2="20" stroke="#22c55e" strokeWidth="0.8" opacity={intensity} />
          <line x1="10" y1="14" x2="22" y2="14" stroke="#22c55e" strokeWidth="0.8" opacity={intensity} />
        </svg>
        {level >= 5 && <span className="absolute -top-0.5 -right-0.5 text-[10px] text-forest-400 font-display">{level}</span>}
      </div>
    )
  }
  if (upgradeId === 'power_1') {
    return (
      <div className="scene-upgrade absolute left-[12%] bottom-[12%]" title={title}>
        <svg width="26" height="26" viewBox="0 0 32 32" className="drop-shadow-md" style={{ opacity: 0.5 + intensity * 0.5 }}>
          <path d="M8 28 L16 4 L24 28 L16 22 Z" fill="#4a4035" stroke="#854d0e" strokeWidth="1" />
          <path d="M10 24 L16 10 L22 24" fill="none" stroke="#b45309" strokeWidth="1.5" opacity={intensity} />
        </svg>
        {level >= 5 && <span className="absolute -top-0.5 -right-0.5 text-[10px] text-gold-400 font-display">{level}</span>}
      </div>
    )
  }
  if (upgradeId === 'gold_1') {
    return (
      <div className="scene-upgrade absolute left-[6%] bottom-[8%]" title={title}>
        <svg width="30" height="24" viewBox="0 0 32 24" className="drop-shadow-md" style={{ opacity: 0.5 + intensity * 0.5 }}>
          <ellipse cx="16" cy="14" rx="12" ry="6" fill="#5c5042" stroke="#854d0e" strokeWidth="1" />
          <circle cx="12" cy="12" r="3" fill="#f59e0b" fillOpacity={intensity} />
          <circle cx="16" cy="10" r="3" fill="#fbbf24" fillOpacity={intensity} />
          <circle cx="20" cy="12" r="3" fill="#f59e0b" fillOpacity={intensity} />
        </svg>
        {level >= 5 && <span className="absolute -top-0.5 -right-0.5 text-[10px] text-gold-400 font-display">{level}</span>}
      </div>
    )
  }
  return null
}

export function ScenePanel({ state, productionPerSecond }: ScenePanelProps) {
  const creatureCounts = CREATURES.map((c) => ({ id: c.id, count: getCreatureCount(state, c.id) })).filter(
    (x) => x.count > 0
  )
  const upgradeLevels = UPGRADES.map((u) => ({ id: u.id, level: getUpgradeLevel(state, u.id) })).filter(
    (x) => x.level > 0
  )

  return (
    <section
      className="scene-panel relative w-full overflow-hidden border-b border-earth-700/50 bg-gradient-to-b from-void-950 to-void-900 scene-vignette"
      aria-label="Scena – obóz złego maga"
      style={{ minHeight: '32vh', maxHeight: '32vh' }}
    >
      {/* Trawa – dolna warstwa */}
      <div className="absolute inset-0 grass-layer" aria-hidden="true" />

      {/* Kępki trawy / zarośla – pierwszy plan */}
      <div className="absolute left-[8%] bottom-[8%] w-16 h-8 opacity-60" aria-hidden="true">
        <svg viewBox="0 0 64 32" className="w-full h-full" preserveAspectRatio="xMinYMax meet">
          <path d="M4 32 L6 18 L8 32 M12 32 L14 14 L16 32 M20 32 L22 20 L24 32" stroke="#166534" strokeWidth="1.5" fill="none" opacity="0.8" />
          <path d="M28 32 L30 16 L32 32 M36 32 L38 22 L40 32 M44 32 L46 12 L48 32" stroke="#15803d" strokeWidth="1.2" fill="none" opacity="0.7" />
        </svg>
      </div>
      <div className="absolute right-[54%] bottom-[6%] w-12 h-6 opacity-50" aria-hidden="true">
        <svg viewBox="0 0 48 24" className="w-full h-full" preserveAspectRatio="xMaxYMax meet">
          <path d="M40 24 L42 12 L44 24 M32 24 L34 8 L36 24" stroke="#166534" strokeWidth="1.2" fill="none" opacity="0.8" />
        </svg>
      </div>

      {/* Namiot */}
      <div className="absolute left-[4%] bottom-[5%] w-[22%] max-w-[140px] z-10" aria-hidden="true">
        <svg viewBox="0 0 120 100" className="w-full h-auto drop-shadow-xl" preserveAspectRatio="xMinYMax meet">
          <defs>
            <linearGradient id="tent-fabric" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5c3310" />
              <stop offset="50%" stopColor="#713f12" />
              <stop offset="100%" stopColor="#4a2910" />
            </linearGradient>
            <linearGradient id="tent-stripe" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#854d0e" />
              <stop offset="100%" stopColor="#3d2210" />
            </linearGradient>
          </defs>
          <path d="M60 8 L105 92 L15 92 Z" fill="url(#tent-fabric)" stroke="#3d2210" strokeWidth="2" />
          <path d="M60 8 L60 92" stroke="url(#tent-stripe)" strokeWidth="2" opacity="0.6" />
          <path d="M60 20 L90 92 M60 20 L30 92" stroke="#3d2210" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>

      {/* Ulepszenia – przy namiocie */}
      {upgradeLevels.map(({ id, level }) => (
        <UpgradeVisual key={id} upgradeId={id} level={level} />
      ))}

      {/* Zły mag – przy namiocie, mniejszy od namiotu (Lottie gdy skonfigurowane, inaczej domyślny SVG) */}
      <div className="absolute left-[26%] bottom-[5%] w-[11%] max-w-[70px] h-[42%] z-20 flex items-end justify-center" aria-hidden="true">
        {sceneConfig.mageAnimationUrl ? (
          <LottieCharacter
            url={sceneConfig.mageAnimationUrl}
            className="w-full h-full object-contain object-bottom"
            loop
          />
        ) : (
          <svg viewBox="0 0 80 120" className="w-full h-auto drop-shadow-2xl mage-sprite" preserveAspectRatio="xMidYMax meet">
            <defs>
              <linearGradient id="robe" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e2a1a" />
                <stop offset="50%" stopColor="#14532d" />
                <stop offset="100%" stopColor="#0f3d20" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path d="M40 35 L55 115 L25 115 Z" fill="url(#robe)" stroke="#166534" strokeWidth="1" />
            <path d="M40 50 L48 115 M40 50 L32 115" stroke="#0f3d20" strokeWidth="0.8" opacity="0.6" />
            <ellipse cx="40" cy="28" rx="18" ry="14" fill="#1a1612" stroke="#166534" strokeWidth="1" />
            <path d="M22 28 Q40 8 58 28" fill="#1e2a1a" stroke="#166534" strokeWidth="1" />
            <ellipse cx="34" cy="26" rx="2" ry="2.5" fill="#22c55e" filter="url(#glow)" />
            <ellipse cx="46" cy="26" rx="2" ry="2.5" fill="#22c55e" filter="url(#glow)" />
            <path d="M25 55 L15 95 L18 95 L28 58" fill="#2e2820" stroke="#4a4035" strokeWidth="0.8" />
            <path d="M55 55 L65 95 L62 95 L52 58" fill="#2e2820" stroke="#4a4035" strokeWidth="0.8" />
            <line x1="18" y1="95" x2="18" y2="75" stroke="#854d0e" strokeWidth="3" strokeLinecap="round" />
            <circle cx="18" cy="70" r="4" fill="#22c55e" filter="url(#glow)" opacity="0.9" />
          </svg>
        )}
      </div>

      {/* Armia potworów – większość widoku u góry; podczas rajdu idą w prawo i wychodzą z ekranu */}
      <div className="absolute left-[38%] right-0 top-0 bottom-12 z-10 flex flex-wrap items-center justify-center content-center gap-4 py-4 px-2">
        {creatureCounts.length > 0 ? (
          creatureCounts.map(({ id, count }) => (
            <CreatureIcon key={id} id={id} count={count} isRaidInProgress={state.raidInProgress} />
          ))
        ) : (
          <span className="text-amber-100/30 text-sm font-body italic">Brak armii – przywołaj stwory</span>
        )}
      </div>

      {/* Pasek zasobów – zawsze widoczny u dołu sceny */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-center gap-4 sm:gap-8 py-2 px-4 bg-gradient-to-t from-black/80 to-black/50 border-t border-earth-700/50 scene-resource-bar">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-forest-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]" aria-hidden="true" />
          <span className="text-amber-100/70 text-xs uppercase tracking-wider font-display">Energia</span>
          <span className="text-forest-400 font-semibold tabular-nums min-w-[4ch]">{formatShort(fromState(state.energy))}</span>
          <span className="text-forest-500/90 text-[10px] sm:text-xs">+{formatShort(productionPerSecond)}/s</span>
        </div>
        <div className="w-px h-5 bg-earth-600/50" aria-hidden="true" />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" aria-hidden="true" />
          <span className="text-amber-100/70 text-xs uppercase tracking-wider font-display">Złoto</span>
          <span className="text-gold-400 font-semibold tabular-nums min-w-[4ch]">{formatShort(fromState(state.gold))}</span>
        </div>
      </div>
    </section>
  )
}
