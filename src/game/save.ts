import type { GameState } from './types'
import { getInitialState, applyOfflineProgress, resolveRaidIfEnded } from './engine'
import { SAVE_VERSION } from './types'

const STORAGE_KEY = 'demon_king_idle_save'

/** Mapowanie starych id stworów na aktualne (kompatybilność zapisów). */
const CREATURE_ID_MIGRATION: Record<string, string> = {
  imp: 'bat',
  lesser_demon: 'mushroom',
  demon: 'golem',
  greater_demon: 'greater_golem'
}

function migrateCreatureIds(creatures: { creatureId: string; count: number }[]): { creatureId: string; count: number }[] {
  const migrated = creatures.map((c) => ({
    creatureId: CREATURE_ID_MIGRATION[c.creatureId] ?? c.creatureId,
    count: c.count
  }))
  const byId = new Map<string, number>()
  for (const c of migrated) {
    byId.set(c.creatureId, (byId.get(c.creatureId) ?? 0) + c.count)
  }
  return [...byId.entries()].map(([creatureId, count]) => ({ creatureId, count }))
}

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getInitialState()
    const parsed = JSON.parse(raw) as GameState
    if (parsed.version !== SAVE_VERSION) return getInitialState()
    if (Array.isArray(parsed.creatures)) {
      parsed.creatures = migrateCreatureIds(parsed.creatures)
    }
    const now = Date.now()
    let state = resolveRaidIfEnded(parsed, now)
    const patch = applyOfflineProgress(state, now)
    state = { ...state, ...patch }
    return state
  } catch {
    return getInitialState()
  }
}

export function saveState(state: GameState): void {
  try {
    const toSave = {
      ...state,
      lastSavedAt: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch {
    // ignore
  }
}

export function exportSave(state: GameState): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(state))))
}

export function importSave(encoded: string): GameState | null {
  try {
    const raw = decodeURIComponent(escape(atob(encoded)))
    const parsed = JSON.parse(raw) as GameState
    if (typeof parsed.energy !== 'string' || !Array.isArray(parsed.creatures))
      return null
    parsed.creatures = migrateCreatureIds(parsed.creatures)
    return { ...getInitialState(), ...parsed, version: SAVE_VERSION }
  } catch {
    return null
  }
}
