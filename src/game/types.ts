import type Decimal from 'break_eternity.js'

export type DecimalLike = Decimal | number | string

export interface CreatureDefinition {
  id: string
  name: string
  description: string
  baseCost: DecimalLike
  costMultiplier: number
  baseProduction: DecimalLike
  basePower: number
  unlockAtGold: DecimalLike
}

export interface CreatureCount {
  creatureId: string
  count: number
}

export interface UpgradeDefinition {
  id: string
  name: string
  description: string
  goldCost: DecimalLike
  costMultiplier: number
  effect: 'energyProduction' | 'raidPower' | 'raidGold'
  value: number
  maxLevel: number
}

export interface GameState {
  energy: string
  gold: string
  lastSavedAt: number
  creatures: CreatureCount[]
  upgradeLevels: Record<string, number>
  raidInProgress: boolean
  raidEndsAt: number
  totalRaids: number
  totalGoldEarned: string
  version: number
}

export const SAVE_VERSION = 1

export const CREATURES: CreatureDefinition[] = [
  {
    id: 'bat',
    name: 'Nietoperz',
    description: 'Latający sługus, zbiera odrobinę złej energii.',
    baseCost: 10,
    costMultiplier: 1.12,
    baseProduction: 0.5,
    basePower: 1,
    unlockAtGold: 0
  },
  {
    id: 'mushroom',
    name: 'Grzybolak',
    description: 'Leśny stwór o średniej sile i lepszej produkcji.',
    baseCost: 100,
    costMultiplier: 1.15,
    baseProduction: 3,
    basePower: 5,
    unlockAtGold: 50
  },
  {
    id: 'golem',
    name: 'Golem',
    description: 'Niebieski strażnik – prawdziwa moc ciemności.',
    baseCost: 1200,
    costMultiplier: 1.18,
    baseProduction: 15,
    basePower: 25,
    unlockAtGold: 500
  },
  {
    id: 'greater_golem',
    name: 'Golem ognisty',
    description: 'Pomarańczowa elita twojej armii.',
    baseCost: 15000,
    costMultiplier: 1.2,
    baseProduction: 80,
    basePower: 120,
    unlockAtGold: 5000
  },
  {
    id: 'archdemon',
    name: 'Arcygolem',
    description: 'Przerażająca potęga ożywionej magii.',
    baseCost: 200000,
    costMultiplier: 1.22,
    baseProduction: 400,
    basePower: 600,
    unlockAtGold: 50000
  }
]

export const UPGRADES: UpgradeDefinition[] = [
  {
    id: 'prod_1',
    name: 'Ciemna wiedza',
    description: '+25% produkcji złej energii',
    goldCost: 100,
    costMultiplier: 2,
    effect: 'energyProduction',
    value: 0.25,
    maxLevel: 10
  },
  {
    id: 'power_1',
    name: 'Krwawe ostrza',
    description: '+20% siły armii w rajdach',
    goldCost: 150,
    costMultiplier: 2.5,
    effect: 'raidPower',
    value: 0.2,
    maxLevel: 10
  },
  {
    id: 'gold_1',
    name: 'Łupieżcy',
    description: '+15% złota z rajdów',
    goldCost: 200,
    costMultiplier: 2.2,
    effect: 'raidGold',
    value: 0.15,
    maxLevel: 10
  }
]
