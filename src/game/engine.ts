import Decimal from 'break_eternity.js'
import {
  CREATURES,
  UPGRADES,
  type GameState,
  type CreatureDefinition,
  type UpgradeDefinition
} from './types'
import { fromState, parseDecimal } from './decimal'

const MAX_OFFLINE_SECONDS = 24 * 60 * 60

function getCreatureCount(state: GameState, creatureId: string): number {
  return state.creatures.find((c) => c.creatureId === creatureId)?.count ?? 0
}

function getUpgradeLevel(state: GameState, upgradeId: string): number {
  return state.upgradeLevels[upgradeId] ?? 0
}

export function costForNextCreature(
  def: CreatureDefinition,
  currentCount: number
): Decimal {
  return parseDecimal(def.baseCost).times(
    Math.pow(def.costMultiplier, currentCount)
  )
}

export function productionPerSecond(state: GameState): Decimal {
  let total = new Decimal(0)
  const prodMultiplier =
    1 +
    UPGRADES.filter((u) => u.effect === 'energyProduction').reduce(
      (acc, u) => acc + getUpgradeLevel(state, u.id) * u.value,
      0
    )
  for (const def of CREATURES) {
    const count = getCreatureCount(state, def.id)
    if (count <= 0) continue
    total = total.add(
      parseDecimal(def.baseProduction).times(count).times(prodMultiplier)
    )
  }
  return total
}

export function totalArmyPower(state: GameState): number {
  let total = 0
  const powerMultiplier =
    1 +
    UPGRADES.filter((u) => u.effect === 'raidPower').reduce(
      (acc, u) => acc + getUpgradeLevel(state, u.id) * u.value,
      0
    )
  for (const def of CREATURES) {
    const count = getCreatureCount(state, def.id)
    total += def.basePower * count * powerMultiplier
  }
  return Math.floor(total)
}

export function raidGoldReward(state: GameState, power: number): Decimal {
  const base = new Decimal(power).times(2).plus(50)
  const goldMultiplier =
    1 +
    UPGRADES.filter((u) => u.effect === 'raidGold').reduce(
      (acc, u) => acc + getUpgradeLevel(state, u.id) * u.value,
      0
    )
  return base.times(goldMultiplier)
}

export function raidCasualtyRatio(power: number): number {
  return Math.min(0.95, 0.3 + power / 10000)
}

export function applyTick(
  state: GameState,
  deltaSeconds: number
): Partial<GameState> {
  if (state.raidInProgress) {
    const now = Date.now()
    if (now >= state.raidEndsAt) {
      const power = totalArmyPower(state)
      const goldGain = raidGoldReward(state, power)
      const ratio = raidCasualtyRatio(power)
      const newCreatures = state.creatures.map((c) => ({
        ...c,
        count: Math.max(0, Math.floor(c.count * (1 - ratio)))
      }))
      return {
        energy: state.energy,
        gold: fromState(state.gold).add(goldGain).toString(),
        creatures: newCreatures,
        raidInProgress: false,
        raidEndsAt: 0,
        totalRaids: state.totalRaids + 1,
        totalGoldEarned: fromState(state.totalGoldEarned)
          .add(goldGain)
          .toString()
      }
    }
    return {}
  }
  const prod = productionPerSecond(state)
  const energyGain = prod.times(deltaSeconds)
  const newEnergy = fromState(state.energy).add(energyGain).toString()
  return { energy: newEnergy }
}

export function applyOfflineProgress(
  state: GameState,
  now: number
): Partial<GameState> {
  const elapsed = (now - state.lastSavedAt) / 1000
  if (elapsed <= 0) return {}
  const capped = Math.min(elapsed, MAX_OFFLINE_SECONDS)
  const prod = productionPerSecond(state)
  const energyGain = prod.times(capped)
  const newEnergy = fromState(state.energy).add(energyGain).toString()
  return {
    energy: newEnergy,
    lastSavedAt: now
  }
}

export function canSummon(
  state: GameState,
  def: CreatureDefinition
): boolean {
  const count = getCreatureCount(state, def.id)
  const cost = costForNextCreature(def, count)
  const gold = fromState(state.gold)
  if (gold.lt(parseDecimal(def.unlockAtGold))) return false
  return fromState(state.energy).gte(cost)
}

export function summonCreature(
  state: GameState,
  creatureId: string
): Partial<GameState> | null {
  const def = CREATURES.find((c) => c.id === creatureId)
  if (!def || !canSummon(state, def)) return null
  const count = getCreatureCount(state, creatureId)
  const cost = costForNextCreature(def, count)
  const creatures = [...state.creatures]
  const idx = creatures.findIndex((c) => c.creatureId === creatureId)
  if (idx >= 0) creatures[idx] = { ...creatures[idx], count: creatures[idx].count + 1 }
  else creatures.push({ creatureId, count: 1 })
  return {
    energy: fromState(state.energy).sub(cost).toString(),
    creatures
  }
}

export function upgradeCost(
  def: UpgradeDefinition,
  currentLevel: number
): Decimal {
  if (currentLevel >= def.maxLevel) return new Decimal(Infinity)
  return parseDecimal(def.goldCost).times(
    Math.pow(def.costMultiplier, currentLevel)
  )
}

export function canBuyUpgrade(state: GameState, def: UpgradeDefinition): boolean {
  const level = getUpgradeLevel(state, def.id)
  if (level >= def.maxLevel) return false
  return fromState(state.gold).gte(upgradeCost(def, level))
}

export function buyUpgrade(
  state: GameState,
  upgradeId: string
): Partial<GameState> | null {
  const def = UPGRADES.find((u) => u.id === upgradeId)
  if (!def || !canBuyUpgrade(state, def)) return null
  const level = getUpgradeLevel(state, upgradeId)
  const cost = upgradeCost(def, level)
  const levels = { ...state.upgradeLevels, [upgradeId]: level + 1 }
  return {
    gold: fromState(state.gold).sub(cost).toString(),
    upgradeLevels: levels
  }
}

export function canStartRaid(state: GameState): boolean {
  if (state.raidInProgress) return false
  return totalArmyPower(state) > 0
}

const RAID_DURATION_MS = 30_000

export function startRaid(state: GameState): Partial<GameState> | null {
  if (!canStartRaid(state)) return null
  return {
    raidInProgress: true,
    raidEndsAt: Date.now() + RAID_DURATION_MS
  }
}

export function resolveRaidIfEnded(state: GameState, now: number): GameState {
  if (!state.raidInProgress || now < state.raidEndsAt) return state
  const power = totalArmyPower(state)
  const goldGain = raidGoldReward(state, power)
  const ratio = raidCasualtyRatio(power)
  const newCreatures = state.creatures.map((c) => ({
    ...c,
    count: Math.max(0, Math.floor(c.count * (1 - ratio)))
  }))
  return {
    ...state,
    gold: fromState(state.gold).add(goldGain).toString(),
    creatures: newCreatures,
    raidInProgress: false,
    raidEndsAt: 0,
    totalRaids: state.totalRaids + 1,
    totalGoldEarned: fromState(state.totalGoldEarned).add(goldGain).toString()
  }
}

/** Złoto na start – tyle, żeby odblokować każdą jednostkę (max unlockAtGold), bez żadnego stwora. */
const INITIAL_GOLD = 50_000

export function getInitialState(): GameState {
  return {
    energy: '10',
    gold: String(INITIAL_GOLD),
    lastSavedAt: Date.now(),
    creatures: [],
    upgradeLevels: {},
    raidInProgress: false,
    raidEndsAt: 0,
    totalRaids: 0,
    totalGoldEarned: '0',
    version: 1
  }
}

export function isCreatureUnlocked(state: GameState, def: CreatureDefinition): boolean {
  return fromState(state.gold).gte(parseDecimal(def.unlockAtGold))
}
