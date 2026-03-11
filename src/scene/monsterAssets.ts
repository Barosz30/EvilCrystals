/**
 * Mapowanie jednostek gry (creature id) na assety potworów z folderu public/monsters.
 * Ścieżki z spacjami są zakodowane przy użyciu.
 *
 * Mapowanie:
 * - bat          → Bat (IdleFly, 7 klatek)
 * - mushroom     → Mushroom (Idle, 8 klatek)
 * - golem        → Golem niebieski (idle, 9 klatek)
 * - greater_golem → Golem pomarańczowy (idle, 9 klatek)
 * - archdemon    → Golem pomarańczowy z VFX (idle, 9 klatek)
 *
 * Jeśli animacja jest przycięta lub rozciągnięta, dostosuj frameWidth/frameHeight
 * do rzeczywistego rozmiaru jednej klatki w PNG (wszystkie klatki w jednym rzędzie).
 */

export interface MonsterSpriteDef {
  /** Ścieżka do PNG – animacja idle (bez leading slash) */
  src: string
  frameCount: number
  frameWidth: number
  frameHeight: number
  fps?: number
  /** Ścieżka do PNG – animacja podczas rajdu (Attack/Run); gdy brak, używane jest src */
  srcRaid?: string
  frameCountRaid?: number
  frameWidthRaid?: number
  frameHeightRaid?: number
  fpsRaid?: number
}

/** Ścieżki w public – getMonsterSpriteUrl(id, isRaid) i getMonsterSpriteDef(id, isRaid). */
const MONSTER_SPRITES: Record<string, MonsterSpriteDef> = {
  bat: {
    src: 'monsters/DarkFantasyEnemies/Bat/Bat without VFX/Bat-IdleFly.png',
    frameCount: 9,
    frameWidth: 64,
    frameHeight: 64,
    fps: 16,
    srcRaid: 'monsters/DarkFantasyEnemies/Bat/Bat without VFX/Bat-Attack1.png',
    frameCountRaid: 8,
    frameWidthRaid: 64,
    frameHeightRaid: 64,
    fpsRaid: 20
  },
  mushroom: {
    src: 'monsters/Forest_Monsters/Forest_Monsters_FREE/Mushroom/Mushroom with VFX/Mushroom-Idle.png',
    frameCount: 7,
    frameWidth: 64,
    frameHeight: 64,
    fps: 14,
    srcRaid: 'monsters/Forest_Monsters/Forest_Monsters_FREE/Mushroom/Mushroom with VFX/Mushroom-Run.png',
    frameCountRaid: 8,
    frameWidthRaid: 64,
    frameHeightRaid: 64,
    fpsRaid: 18
  },
  golem: {
    src: 'monsters/Golems/Golem_1/Blue/No_Swoosh_VFX/Golem_1_idle.png',
    frameCount: 8,
    frameWidth: 64,
    frameHeight: 64,
    fps: 14,
    srcRaid: 'monsters/Golems/Golem_1/Blue/No_Swoosh_VFX/Golem_1_attack.png',
    frameCountRaid: 11,
    frameWidthRaid: 64,
    frameHeightRaid: 64,
    fpsRaid: 18
  },
  greater_golem: {
    src: 'monsters/Golems/Golem_1/Orange/No_Swoosh_VFX/Golem_1_idle.png',
    frameCount: 8,
    frameWidth: 64,
    frameHeight: 64,
    fps: 14,
    srcRaid: 'monsters/Golems/Golem_1/Orange/No_Swoosh_VFX/Golem_1_attack.png',
    frameCountRaid: 11,
    frameWidthRaid: 64,
    frameHeightRaid: 64,
    fpsRaid: 18
  },
  archdemon: {
    src: 'monsters/Golems/Golem_1/Orange/White_Swoosh_VFX/Golem_1_idle.png',
    frameCount: 9,
    frameWidth: 64,
    frameHeight: 64,
    fps: 14,
    srcRaid: 'monsters/Golems/Golem_1/Orange/White_Swoosh_VFX/Golem_1_attack.png',
    frameCountRaid: 9,
    frameWidthRaid: 64,
    frameHeightRaid: 64,
    fpsRaid: 18
  }
}

function encodePath(path: string): string {
  return `/${path.split('/').map((seg) => encodeURIComponent(seg)).join('/')}`
}

/** Zwraca URL do sprite sheetu. Gdy isRaid=true i jest srcRaid – zwraca wariant rajdu (Attack/Run). */
export function getMonsterSpriteUrl(creatureId: string, isRaid = false): string | null {
  const def = MONSTER_SPRITES[creatureId]
  if (!def) return null
  const path = isRaid && def.srcRaid ? def.srcRaid : def.src
  return encodePath(path)
}

/** Zwraca definicję sprite’a dla creatureId */
export function getMonsterSpriteDef(creatureId: string, isRaid = false): MonsterSpriteDef | null {
  const def = MONSTER_SPRITES[creatureId]
  if (!def) return null
  if (!isRaid || !def.srcRaid) return def
  return {
    src: def.srcRaid,
    frameCount: def.frameCountRaid ?? def.frameCount,
    frameWidth: def.frameWidthRaid ?? def.frameWidth,
    frameHeight: def.frameHeightRaid ?? def.frameHeight,
    fps: def.fpsRaid ?? def.fps
  }
}
