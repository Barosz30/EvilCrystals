import { useState, useEffect, useCallback, useRef } from 'react'

export interface Creature {
  id: string
  name: string
  count: number
  manaPerSec: number
  baseCost: number
  baseManaPerSec: number
}

export interface Upgrade {
  id: string
  name: string
  description: string
  icon: string
  cost: number
  owned: number
  effect: string
}

export interface GoldUpgrade {
  id: string
  name: string
  description: string
  icon: string
  cost: number
  owned: number
}

export interface CrystalUpgrade {
  id: string
  name: string
  description: string
  icon: string
  cost: number
  owned: number
}

export interface GameStats {
  totalManaEarned: number
  totalClicks: number
  playTimeSec: number
  peakManaPerSec: number
  totalCreaturesBought: number
  totalGoldEarned: number
  totalCrystalsEarned: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  check: (stats: GameStats & {
    totalCreatures: number
    gold: number
    resets: number
    apocalypses: number
    darkCrystals: number
    mana: number
    totalManaPerSec: number
  }) => boolean
}

const INITIAL_CREATURES: Creature[] = [
  { id: 'imp', name: 'Imp', count: 0, manaPerSec: 1, baseCost: 10, baseManaPerSec: 1 },
  { id: 'skeleton', name: 'Szkielet', count: 0, manaPerSec: 5, baseCost: 50, baseManaPerSec: 5 },
  { id: 'wraith', name: 'Upiór', count: 0, manaPerSec: 20, baseCost: 200, baseManaPerSec: 20 },
  { id: 'golem', name: 'Golem', count: 0, manaPerSec: 75, baseCost: 800, baseManaPerSec: 75 },
  { id: 'dragon', name: 'Smok', count: 0, manaPerSec: 300, baseCost: 3500, baseManaPerSec: 300 },
  { id: 'lich', name: 'Lisz', count: 0, manaPerSec: 1200, baseCost: 15000, baseManaPerSec: 1200 }
]

const INITIAL_UPGRADES: Upgrade[] = [
  { id: 'click', name: 'Moc Kliknięcia', description: '+1 many za kliknięcie', icon: '🖱️', cost: 15, owned: 0, effect: 'click' },
  { id: 'ritual', name: 'Mroczny Rytuał', description: 'Impy dają ×2 many', icon: '🕯️', cost: 100, owned: 0, effect: 'imp_mult' },
  { id: 'necro', name: 'Nekromancja', description: 'Szkielety dają ×2 many', icon: '💀', cost: 500, owned: 0, effect: 'skeleton_mult' },
  { id: 'golem_rune', name: 'Runiczne Wzmocnienie', description: 'Golemy dają ×2 many', icon: '🪨', cost: 2000, owned: 0, effect: 'golem_mult' },
  { id: 'dragon_fury', name: 'Smocza Furia', description: 'Smoki dają ×2 many', icon: '🐉', cost: 8000, owned: 0, effect: 'dragon_mult' },
  { id: 'lich_pact', name: 'Pakt Lisza', description: 'Lisze dają ×2 many', icon: '📿', cost: 35000, owned: 0, effect: 'lich_mult' }
]

const INITIAL_GOLD_UPGRADES: GoldUpgrade[] = [
  { id: 'gold_click', name: 'Złoty Dotyk', description: '+2 many za kliknięcie (permanentne)', icon: '👆', cost: 3, owned: 0 },
  { id: 'gold_mana', name: 'Studnia Many', description: 'Zacznij z +50 many po resecie', icon: '💧', cost: 5, owned: 0 },
  { id: 'gold_discount', name: 'Pakt Demonów', description: 'Stwory kosztują 10% mniej', icon: '📜', cost: 8, owned: 0 },
  { id: 'gold_power', name: 'Esencja Chaosu', description: 'Wszystkie stwory +50% many/s', icon: '🔥', cost: 15, owned: 0 }
]

const INITIAL_CRYSTAL_UPGRADES: CrystalUpgrade[] = [
  { id: 'crystal_gold_mult', name: 'Złota Żyła', description: '×2 złota z resetów', icon: '⛏️', cost: 3, owned: 0 },
  { id: 'crystal_start_creatures', name: 'Wierny Imp', description: 'Zacznij z 5 impami po resecie', icon: '👿', cost: 5, owned: 0 },
  { id: 'crystal_all_power', name: 'Mroczna Esencja', description: 'Wszystkie stwory ×2 many/s (stacks)', icon: '🌑', cost: 10, owned: 0 },
  { id: 'crystal_click_mega', name: 'Uderzenie Chaosu', description: '+10 many za kliknięcie (permanentne)', icon: '💥', cost: 20, owned: 0 },
  { id: 'crystal_cheap', name: 'Pakt Otchłani', description: 'Stwory kosztują 25% mniej (stacks)', icon: '🕳️', cost: 30, owned: 0 }
]

const INITIAL_STATS: GameStats = {
  totalManaEarned: 0,
  totalClicks: 0,
  playTimeSec: 0,
  peakManaPerSec: 0,
  totalCreaturesBought: 0,
  totalGoldEarned: 0,
  totalCrystalsEarned: 0
}

const ACHIEVEMENTS: Omit<Achievement, 'unlocked'>[] = [
  { id: 'first_click', name: 'Pierwszy Dotyk', description: 'Kliknij po raz pierwszy', icon: '👆', check: (s) => s.totalClicks >= 1 },
  { id: 'click_100', name: 'Klikacz', description: 'Kliknij 100 razy', icon: '🖱️', check: (s) => s.totalClicks >= 100 },
  { id: 'click_1000', name: 'Maniak Klikania', description: 'Kliknij 1000 razy', icon: '⚡', check: (s) => s.totalClicks >= 1000 },
  { id: 'click_10000', name: 'Palec Chaosu', description: 'Kliknij 10 000 razy', icon: '🌩️', check: (s) => s.totalClicks >= 10000 },
  { id: 'mana_100', name: 'Iskra Mocy', description: 'Zbierz łącznie 100 many', icon: '✨', check: (s) => s.totalManaEarned >= 100 },
  { id: 'mana_1000', name: 'Źródło Many', description: 'Zbierz łącznie 1 000 many', icon: '💧', check: (s) => s.totalManaEarned >= 1000 },
  { id: 'mana_10000', name: 'Rzeka Mocy', description: 'Zbierz łącznie 10 000 many', icon: '🌊', check: (s) => s.totalManaEarned >= 10000 },
  { id: 'mana_100000', name: 'Ocean Many', description: 'Zbierz łącznie 100 000 many', icon: '🌀', check: (s) => s.totalManaEarned >= 100000 },
  { id: 'mana_1m', name: 'Władca Many', description: 'Zbierz łącznie 1 000 000 many', icon: '👑', check: (s) => s.totalManaEarned >= 1000000 },
  { id: 'creature_1', name: 'Pierwszy Sługa', description: 'Przywołaj pierwszego stwora', icon: '👿', check: (s) => s.totalCreaturesBought >= 1 },
  { id: 'creature_10', name: 'Mała Armia', description: 'Kup łącznie 10 stworów', icon: '⚔️', check: (s) => s.totalCreaturesBought >= 10 },
  { id: 'creature_50', name: 'Mroczna Armia', description: 'Kup łącznie 50 stworów', icon: '🏴', check: (s) => s.totalCreaturesBought >= 50 },
  { id: 'creature_100', name: 'Legion Ciemności', description: 'Kup łącznie 100 stworów', icon: '💀', check: (s) => s.totalCreaturesBought >= 100 },
  { id: 'mps_10', name: 'Strumień Many', description: 'Osiągnij 10 many/s', icon: '🔮', check: (s) => s.peakManaPerSec >= 10 },
  { id: 'mps_100', name: 'Potok Many', description: 'Osiągnij 100 many/s', icon: '🌟', check: (s) => s.peakManaPerSec >= 100 },
  { id: 'mps_1000', name: 'Kaskada Mocy', description: 'Osiągnij 1 000 many/s', icon: '💎', check: (s) => s.peakManaPerSec >= 1000 },
  { id: 'mps_10000', name: 'Huragan Many', description: 'Osiągnij 10 000 many/s', icon: '🌪️', check: (s) => s.peakManaPerSec >= 10000 },
  { id: 'reset_1', name: 'Nowy Początek', description: 'Zresetuj grę po raz pierwszy', icon: '🔄', check: (s) => s.resets >= 1 },
  { id: 'reset_5', name: 'Cykliczny Mag', description: 'Zresetuj grę 5 razy', icon: '♻️', check: (s) => s.resets >= 5 },
  { id: 'reset_10', name: 'Wieczny Powrót', description: 'Zresetuj grę 10 razy', icon: '🔁', check: (s) => s.resets >= 10 },
  { id: 'gold_10', name: 'Skarbiec', description: 'Zbierz łącznie 10 złota', icon: '🪙', check: (s) => s.totalGoldEarned >= 10 },
  { id: 'gold_50', name: 'Złoty Smok', description: 'Zbierz łącznie 50 złota', icon: '🏆', check: (s) => s.totalGoldEarned >= 50 },
  { id: 'gold_100', name: 'Złota Góra', description: 'Zbierz łącznie 100 złota', icon: '⛰️', check: (s) => s.totalGoldEarned >= 100 },
  { id: 'apocalypse_1', name: 'Koniec Świata', description: 'Przeprowadź pierwszą Apokalipsę', icon: '☠️', check: (s) => s.apocalypses >= 1 },
  { id: 'apocalypse_3', name: 'Zagłada', description: 'Przeprowadź 3 Apokalipsy', icon: '🌋', check: (s) => s.apocalypses >= 3 },
  { id: 'crystal_10', name: 'Kolekcjoner Kryształów', description: 'Zbierz łącznie 10 kryształów', icon: '💠', check: (s) => s.totalCrystalsEarned >= 10 },
  { id: 'playtime_60', name: 'Godzina Mroku', description: 'Graj przez godzinę', icon: '⏰', check: (s) => s.playTimeSec >= 3600 },
  { id: 'playtime_300', name: 'Pochłonięty Ciemnością', description: 'Graj przez 5 godzin', icon: '🕰️', check: (s) => s.playTimeSec >= 18000 }
]

const SAVE_KEY = 'mage-summoner-save'

interface SaveData {
  mana: number
  clickPower: number
  creatures: { id: string; count: number; manaPerSec: number }[]
  upgrades: { id: string; owned: number; cost: number }[]
  gold: number
  goldUpgrades: { id: string; owned: number; cost: number }[]
  resets: number
  darkCrystals: number
  crystalUpgrades: { id: string; owned: number; cost: number }[]
  apocalypses: number
  stats?: GameStats
  unlockedAchievements?: string[]
}

function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SaveData
  } catch {
    return null
  }
}

function mergeCreatures(initial: Creature[], saved: { id: string; count: number; manaPerSec: number }[]): Creature[] {
  return initial.map((c) => {
    const s = saved.find((x) => x.id === c.id)
    return s ? { ...c, count: s.count, manaPerSec: s.manaPerSec } : c
  })
}

function mergeUpgrades<T extends { id: string; owned: number; cost: number }>(
  initial: T[],
  saved: { id: string; owned: number; cost: number }[]
): T[] {
  return initial.map((u) => {
    const s = saved.find((x) => x.id === u.id)
    return s ? { ...u, owned: s.owned, cost: s.cost } : u
  })
}

export const getCost = (baseCost: number, owned: number, discount: number) =>
  Math.max(1, Math.floor(baseCost * Math.pow(1.15, owned) * (1 - discount)))

export function useMageGameState() {
  const saved = useRef<SaveData | null>(loadGame())

  const [mana, setMana] = useState(saved.current?.mana ?? 0)
  const [clickPower, setClickPower] = useState(saved.current?.clickPower ?? 1)
  const [creatures, setCreatures] = useState<Creature[]>(
    () => (saved.current ? mergeCreatures(INITIAL_CREATURES, saved.current.creatures) : INITIAL_CREATURES.map((c) => ({ ...c })))
  )
  const [upgrades, setUpgrades] = useState<Upgrade[]>(
    () => (saved.current ? mergeUpgrades(INITIAL_UPGRADES, saved.current.upgrades) : INITIAL_UPGRADES.map((u) => ({ ...u })))
  )
  const [gold, setGold] = useState(saved.current?.gold ?? 0)
  const [goldUpgrades, setGoldUpgrades] = useState<GoldUpgrade[]>(
    () => (saved.current ? mergeUpgrades(INITIAL_GOLD_UPGRADES, saved.current.goldUpgrades) : INITIAL_GOLD_UPGRADES.map((u) => ({ ...u })))
  )
  const [resets, setResets] = useState(saved.current?.resets ?? 0)
  const [darkCrystals, setDarkCrystals] = useState(saved.current?.darkCrystals ?? 0)
  const [crystalUpgrades, setCrystalUpgrades] = useState<CrystalUpgrade[]>(
    () =>
      saved.current
        ? mergeUpgrades(INITIAL_CRYSTAL_UPGRADES, saved.current.crystalUpgrades)
        : INITIAL_CRYSTAL_UPGRADES.map((u) => ({ ...u }))
  )
  const [apocalypses, setApocalypses] = useState(saved.current?.apocalypses ?? 0)
  const [showExplosion, setShowExplosion] = useState(false)
  const [showApocalypse, setShowApocalypse] = useState(false)

  const [stats, setStats] = useState<GameStats>(() => saved.current?.stats ?? { ...INITIAL_STATS })
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(
    () => new Set(saved.current?.unlockedAchievements ?? [])
  )
  const [newAchievement, setNewAchievement] = useState<string | null>(null)

  const permClickBonus = goldUpgrades.find((u) => u.id === 'gold_click')!.owned * 2
  const crystalClickBonus = crystalUpgrades.find((u) => u.id === 'crystal_click_mega')!.owned * 10
  const startMana = goldUpgrades.find((u) => u.id === 'gold_mana')!.owned * 50
  const goldDiscount = Math.min(0.9, goldUpgrades.find((u) => u.id === 'gold_discount')!.owned * 0.1)
  const crystalDiscount = Math.min(0.9, crystalUpgrades.find((u) => u.id === 'crystal_cheap')!.owned * 0.25)
  const discount = Math.min(0.95, goldDiscount + crystalDiscount)
  const goldCreatureMult = 1 + goldUpgrades.find((u) => u.id === 'gold_power')!.owned * 0.5
  const crystalCreatureMult = Math.pow(2, crystalUpgrades.find((u) => u.id === 'crystal_all_power')!.owned)
  const creatureMult = goldCreatureMult * crystalCreatureMult
  const goldMult = Math.pow(2, crystalUpgrades.find((u) => u.id === 'crystal_gold_mult')!.owned)
  const startImps = crystalUpgrades.find((u) => u.id === 'crystal_start_creatures')!.owned * 5

  const totalCreatures = creatures.reduce((sum, c) => sum + c.count, 0)
  const totalManaPerSec = creatures.reduce((sum, c) => sum + c.count * c.manaPerSec * creatureMult, 0)
  const goldOnReset = Math.floor(Math.sqrt(totalCreatures) * 2 * goldMult)
  const crystalsOnApocalypse = Math.floor(Math.sqrt(gold + goldOnReset) + Math.log2(1 + resets) * 2)

  useEffect(() => {
    if (totalManaPerSec > stats.peakManaPerSec) {
      setStats((s) => ({ ...s, peakManaPerSec: totalManaPerSec }))
    }
  }, [totalManaPerSec, stats.peakManaPerSec])

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((s) => ({ ...s, playTimeSec: s.playTimeSec + 1 }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const ctx = {
      ...stats,
      totalCreatures,
      gold,
      resets,
      apocalypses,
      darkCrystals,
      mana,
      totalManaPerSec
    }
    for (const a of ACHIEVEMENTS) {
      if (!unlockedAchievements.has(a.id) && a.check(ctx)) {
        setUnlockedAchievements((prev) => {
          const next = new Set(prev)
          next.add(a.id)
          return next
        })
        setNewAchievement(a.id)
        setTimeout(() => setNewAchievement(null), 3000)
      }
    }
  }, [stats, totalCreatures, gold, resets, apocalypses, darkCrystals, mana, totalManaPerSec, unlockedAchievements])

  useEffect(() => {
    const interval = setInterval(() => {
      const data: SaveData = {
        mana,
        clickPower,
        creatures: creatures.map((c) => ({ id: c.id, count: c.count, manaPerSec: c.manaPerSec })),
        upgrades: upgrades.map((u) => ({ id: u.id, owned: u.owned, cost: u.cost })),
        gold,
        goldUpgrades: goldUpgrades.map((u) => ({ id: u.id, owned: u.owned, cost: u.cost })),
        resets,
        darkCrystals,
        crystalUpgrades: crystalUpgrades.map((u) => ({ id: u.id, owned: u.owned, cost: u.cost })),
        apocalypses,
        stats,
        unlockedAchievements: Array.from(unlockedAchievements)
      }
      localStorage.setItem(SAVE_KEY, JSON.stringify(data))
    }, 5000)
    return () => clearInterval(interval)
  }, [mana, clickPower, creatures, upgrades, gold, goldUpgrades, resets, darkCrystals, crystalUpgrades, apocalypses, stats, unlockedAchievements])

  useEffect(() => {
    const interval = setInterval(() => {
      if (totalManaPerSec > 0) {
        const tick = totalManaPerSec / 10
        setMana((m) => m + tick)
        setStats((s) => ({ ...s, totalManaEarned: s.totalManaEarned + tick }))
      }
    }, 100)
    return () => clearInterval(interval)
  }, [totalManaPerSec])

  const handleClick = useCallback(() => {
    const amount = clickPower + permClickBonus + crystalClickBonus
    setMana((m) => m + amount)
    setStats((s) => ({
      ...s,
      totalClicks: s.totalClicks + 1,
      totalManaEarned: s.totalManaEarned + amount
    }))
  }, [clickPower, permClickBonus, crystalClickBonus])

  const buyCreature = (id: string) => {
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        const cost = getCost(c.baseCost, c.count, discount)
        if (mana < cost) return c
        setMana((m) => m - cost)
        setStats((s) => ({ ...s, totalCreaturesBought: s.totalCreaturesBought + 1 }))
        return { ...c, count: c.count + 1 }
      })
    )
  }

  const buyUpgrade = (id: string) => {
    setUpgrades((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u
        if (mana < u.cost) return u
        setMana((m) => m - u.cost)

        if (u.effect === 'click') setClickPower((p) => p + 1)
        const multEffects: Record<string, string> = {
          imp_mult: 'imp',
          skeleton_mult: 'skeleton',
          golem_mult: 'golem',
          dragon_mult: 'dragon',
          lich_mult: 'lich'
        }
        const creatureId = multEffects[u.effect]
        if (creatureId) {
          setCreatures((cs) => cs.map((c) => (c.id === creatureId ? { ...c, manaPerSec: c.manaPerSec * 2 } : c)))
        }

        return { ...u, owned: u.owned + 1, cost: Math.floor(u.cost * 2.5) }
      })
    )
  }

  const handleReset = () => {
    if (totalCreatures < 5) return
    setShowExplosion(true)
    setTimeout(() => {
      const earned = goldOnReset
      setGold((g) => g + earned)
      setStats((s) => ({ ...s, totalGoldEarned: s.totalGoldEarned + earned }))
      setResets((r) => r + 1)
      setMana(startMana)
      setClickPower(1)
      const resetCreatures = INITIAL_CREATURES.map((c) => ({ ...c }))
      if (startImps > 0) {
        const imp = resetCreatures.find((c) => c.id === 'imp')
        if (imp) imp.count = startImps
      }
      setCreatures(resetCreatures)
      setUpgrades(INITIAL_UPGRADES.map((u) => ({ ...u })))
      setShowExplosion(false)
    }, 400)
  }

  const buyGoldUpgrade = (id: string) => {
    setGoldUpgrades((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u
        if (gold < u.cost) return u
        setGold((g) => g - u.cost)
        return { ...u, owned: u.owned + 1, cost: Math.floor(u.cost * 2) }
      })
    )
  }

  const handleApocalypse = () => {
    if (gold < 10 && resets < 3) return
    setShowApocalypse(true)
    setTimeout(() => {
      const earned = crystalsOnApocalypse
      setDarkCrystals((c) => c + earned)
      setStats((s) => ({ ...s, totalCrystalsEarned: s.totalCrystalsEarned + earned }))
      setApocalypses((a) => a + 1)
      setMana(0)
      setClickPower(1)
      setCreatures(INITIAL_CREATURES.map((c) => ({ ...c })))
      setUpgrades(INITIAL_UPGRADES.map((u) => ({ ...u })))
      setGold(0)
      setGoldUpgrades(INITIAL_GOLD_UPGRADES.map((u) => ({ ...u })))
      setResets(0)
      setShowApocalypse(false)
    }, 600)
  }

  const buyCrystalUpgrade = (id: string) => {
    setCrystalUpgrades((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u
        if (darkCrystals < u.cost) return u
        setDarkCrystals((c) => c - u.cost)
        return { ...u, owned: u.owned + 1, cost: Math.floor(u.cost * 2.5) }
      })
    )
  }

  const saveNow = useCallback(() => {
    const data: SaveData = {
      mana,
      clickPower,
      creatures: creatures.map((c) => ({ id: c.id, count: c.count, manaPerSec: c.manaPerSec })),
      upgrades: upgrades.map((u) => ({ id: u.id, owned: u.owned, cost: u.cost })),
      gold,
      goldUpgrades: goldUpgrades.map((u) => ({ id: u.id, owned: u.owned, cost: u.cost })),
      resets,
      darkCrystals,
      crystalUpgrades: crystalUpgrades.map((u) => ({ id: u.id, owned: u.owned, cost: u.cost })),
      apocalypses,
      stats,
      unlockedAchievements: Array.from(unlockedAchievements)
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
  }, [mana, clickPower, creatures, upgrades, gold, goldUpgrades, resets, darkCrystals, crystalUpgrades, apocalypses, stats, unlockedAchievements])

  const loadFromStorage = useCallback(() => {
    const data = loadGame()
    if (!data) return

    setMana(data.mana)
    setClickPower(data.clickPower)
    setCreatures(mergeCreatures(INITIAL_CREATURES, data.creatures))
    setUpgrades(mergeUpgrades(INITIAL_UPGRADES, data.upgrades))
    setGold(data.gold)
    setGoldUpgrades(mergeUpgrades(INITIAL_GOLD_UPGRADES, data.goldUpgrades))
    setResets(data.resets)
    setDarkCrystals(data.darkCrystals)
    setCrystalUpgrades(mergeUpgrades(INITIAL_CRYSTAL_UPGRADES, data.crystalUpgrades))
    setApocalypses(data.apocalypses)
    setStats(data.stats ?? { ...INITIAL_STATS })
    setUnlockedAchievements(new Set(data.unlockedAchievements ?? []))
  }, [])

  const achievements: Achievement[] = ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: unlockedAchievements.has(a.id)
  }))

  return {
    mana,
    clickPower,
    creatures,
    upgrades,
    gold,
    goldUpgrades,
    resets,
    darkCrystals,
    crystalUpgrades,
    apocalypses,
    totalCreatures,
    totalManaPerSec,
    goldOnReset,
    crystalsOnApocalypse,
    discount,
    creatureMult,
    showExplosion,
    setShowExplosion,
    showApocalypse,
    setShowApocalypse,
    handleClick,
    buyCreature,
    buyUpgrade,
    handleReset,
    buyGoldUpgrade,
    handleApocalypse,
    buyCrystalUpgrade,
    saveNow,
    loadFromStorage,
    stats,
    achievements,
    newAchievement
  }
}

