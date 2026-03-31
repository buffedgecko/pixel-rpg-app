import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export type HeroClass = 'warrior' | 'mage' | 'archer' | 'assassin'

export interface Hero {
  id: string
  name: string
  class: HeroClass
  level: number
  exp: number
  maxExp: number
  hp: number
  maxHp: number
  attack: number
  defense: number
  critRate: number
  crystals: number
  gold: number
  lastActive: number
}

export interface Monster {
  id: string
  name: string
  emoji: string
  hp: number
  maxHp: number
  attack: number
  defense: number
  crystals: number
}

export interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  currency: 'gold' | 'crystals'
  category: 'potion' | 'boost' | 'special'
  emoji: string
}

export interface Transaction {
  id: string
  type: 'deposit' | 'withdraw' | 'purchase'
  amount: number
  timestamp: number
}

// Hero Class Data
export const HERO_CLASSES: Record<HeroClass, { name: string; emoji: string; color: string; desc: string }> = {
  warrior: { name: 'Warrior', emoji: '⚔️', color: '#ef4444', desc: 'High HP & Defense' },
  mage: { name: 'Mage', emoji: '🔮', color: '#8b5cf6', desc: 'High Attack & Crit' },
  archer: { name: 'Archer', emoji: '🏹', color: '#22c55e', desc: 'Balanced Stats' },
  assassin: { name: 'Assassin', emoji: '🗡️', color: '#6366f1', desc: 'Highest Crit Rate' },
}

// Shop Items
export const SHOP_ITEMS: ShopItem[] = [
  { id: 'hp_potion', name: 'HP Potion', description: 'Restore 50 HP', price: 100, currency: 'gold', category: 'potion', emoji: '❤️' },
  { id: 'attack_boost', name: 'Attack Boost', description: '+30% ATK for 3 battles', price: 200, currency: 'gold', category: 'boost', emoji: '💪' },
  { id: 'crit_boost', name: 'Crit Boost', description: '+20% Crit for 5 battles', price: 150, currency: 'gold', category: 'boost', emoji: '🎯' },
  { id: 'mega_potion', name: 'Mega Potion', description: 'Full HP restore', price: 50, currency: 'crystals', category: 'potion', emoji: '💎' },
]

// Monsters by level
export const MONSTERS = [
  { name: 'Slime', emoji: '🟢', hp: 30, attack: 5, defense: 2, crystals: 5 },
  { name: 'Goblin', emoji: '👺', hp: 50, attack: 8, defense: 3, crystals: 10 },
  { name: 'Skeleton', emoji: '💀', hp: 70, attack: 12, defense: 4, crystals: 15 },
  { name: 'Orc', emoji: '👹', hp: 100, attack: 15, defense: 6, crystals: 20 },
  { name: 'Demon', emoji: '😈', hp: 150, attack: 20, defense: 8, crystals: 35 },
  { name: 'Dragon', emoji: '🐉', hp: 200, attack: 30, defense: 15, crystals: 50 },
]

// Game State
interface GameState {
  hero: Hero | null
  currentMonster: Monster | null
  battleLog: string[]
  isAutoBattle: boolean
  battleCount: number
  pendingWithdraw: number
  transactions: Transaction[]
  
  createHero: (name: string, heroClass: HeroClass) => void
  startBattle: () => void
  stopBattle: () => void
  autoBattle: () => void
  heal: (amount: number) => void
  buyItem: (itemId: string) => boolean
  addCrystals: (amount: number) => void
  withdraw: (amount: number) => void
  reset: () => void
}

// Helper
const generateId = () => Math.random().toString(36).substr(2, 9)

const getBaseStats = (heroClass: HeroClass) => {
  const stats = {
    warrior: { hp: 150, attack: 20, defense: 15, crit: 0.1 },
    mage: { hp: 80, attack: 35, defense: 5, crit: 0.2 },
    archer: { hp: 100, attack: 25, defense: 10, crit: 0.25 },
    assassin: { hp: 70, attack: 30, defense: 5, crit: 0.35 },
  }
  return stats[heroClass]
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      hero: null,
      currentMonster: null,
      battleLog: [],
      isAutoBattle: false,
      battleCount: 0,
      pendingWithdraw: 0,
      transactions: [],

      createHero: (name, heroClass) => {
        const base = getBaseStats(heroClass)
        const hero: Hero = {
          id: generateId(),
          name,
          class: heroClass,
          level: 1,
          exp: 0,
          maxExp: 100,
          hp: base.hp,
          maxHp: base.hp,
          attack: base.attack,
          defense: base.defense,
          critRate: base.crit,
          crystals: 0,
          gold: 500,
          lastActive: Date.now(),
        }
        set({ hero, battleLog: ['🗡️ Your adventure begins!'] })
      },

      startBattle: () => set({ isAutoBattle: true }),
      stopBattle: () => set({ isAutoBattle: false }),

      autoBattle: () => {
        const state = get()
        if (!state.hero || state.hero.hp <= 0) {
          set({ isAutoBattle: false })
          return
        }

        // Create monster based on hero level
        const monsterIndex = Math.min(state.hero.level - 1, MONSTERS.length - 1)
        const m = MONSTERS[monsterIndex]
        const levelMultiplier = 1 + (state.hero.level - 1) * 0.2
        const monster: Monster = {
          id: generateId(),
          name: m.name,
          emoji: m.emoji,
          hp: Math.floor(m.hp * levelMultiplier),
          maxHp: Math.floor(m.hp * levelMultiplier),
          attack: Math.floor(m.attack * levelMultiplier),
          defense: Math.floor(m.defense * levelMultiplier),
          crystals: Math.floor(m.crystals * levelMultiplier),
        }
        set({ currentMonster: monster, battleCount: state.battleCount + 1 })
      },

      heal: (amount) => {
        const hero = get().hero
        if (!hero) return
        set({
          hero: {
            ...hero,
            hp: Math.min(hero.maxHp, hero.hp + amount),
          },
        })
      },

      buyItem: (itemId) => {
        const state = get()
        const item = SHOP_ITEMS.find(i => i.id === itemId)
        if (!item || !state.hero) return false

        if (item.currency === 'gold' && state.hero.gold >= item.price) {
          set({
            hero: { ...state.hero, gold: state.hero.gold - item.price },
          })
          if (item.id === 'hp_potion') get().heal(50)
          return true
        }
        if (item.currency === 'crystals' && state.hero.crystals >= item.price) {
          set({
            hero: { ...state.hero, crystals: state.hero.crystals - item.price },
          })
          if (item.id === 'mega_potion') get().heal(state.hero.maxHp)
          return true
        }
        return false
      },

      addCrystals: (amount) => {
        const hero = get().hero
        if (!hero) return
        set({
          hero: { ...hero, crystals: hero.crystals + amount },
          transactions: [
            { id: generateId(), type: 'deposit', amount, timestamp: Date.now() },
            ...get().transactions,
          ],
        })
      },

      withdraw: (amount) => {
        const hero = get().hero
        if (!hero || hero.crystals < amount) return
        set({
          hero: { ...hero, crystals: hero.crystals - amount },
          pendingWithdraw: amount,
          transactions: [
            { id: generateId(), type: 'withdraw', amount, timestamp: Date.now() },
            ...get().transactions,
          ],
        })
      },

      reset: () => set({
        hero: null,
        currentMonster: null,
        battleLog: [],
        isAutoBattle: false,
        battleCount: 0,
        pendingWithdraw: 0,
        transactions: [],
      }),
    }),
    { name: 'pixel-quest-storage' }
  )
)
