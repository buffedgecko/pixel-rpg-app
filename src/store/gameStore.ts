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
  hp: number
  maxHp: number
  attack: number
  defense: number
  critRate: number
}

export interface Monster {
  id: string
  name: string
  emoji: string
  hp: number
  attack: number
  defense: number
  crystals: number
}

export interface ShopItem {
  id: string
  name: string
  description: string
  crystalPrice: number
  category: 'egg' | 'potion'
  emoji: string
}

export interface Quest {
  id: string
  name: string
  description: string
  target: number
  reward: number
  type: 'battle' | 'collect' | 'level'
}

export interface PlayerQuest {
  id: string
  progress: number
  claimed: boolean
}

export interface Transaction {
  id: string
  type: 'earn' | 'spend'
  amount: number
  timestamp: number
}

export interface Battle {
  monster: string
  monsterHp: number
  heroHp: number
}

export const HERO_CLASSES: Record<HeroClass, { name: string; emoji: string; color: string; desc: string }> = {
  warrior: { name: 'Warrior', emoji: '⚔️', color: '#ef4444', desc: 'Tank with high HP' },
  mage: { name: 'Mage', emoji: '🔮', color: '#8b5cf6', desc: 'High damage dealer' },
  archer: { name: 'Archer', emoji: '🏹', color: '#22c55e', desc: 'Balanced fighter' },
  assassin: { name: 'Assassin', emoji: '🗡️', color: '#6366f1', desc: 'High crit rate' },
}

export const MONSTERS: Record<string, Monster> = {
  slime: { id: 'slime', name: 'Slime', emoji: '🟢', hp: 30, attack: 5, defense: 2, crystals: 5 },
  goblin: { id: 'goblin', name: 'Goblin', emoji: '👺', hp: 50, attack: 8, defense: 3, crystals: 10 },
  skeleton: { id: 'skeleton', name: 'Skeleton', emoji: '💀', hp: 70, attack: 12, defense: 4, crystals: 15 },
  orc: { id: 'orc', name: 'Orc', emoji: '👹', hp: 100, attack: 15, defense: 6, crystals: 20 },
  demon: { id: 'demon', name: 'Demon', emoji: '😈', hp: 150, attack: 20, defense: 8, crystals: 35 },
  dragon: { id: 'dragon', name: 'Dragon', emoji: '🐉', hp: 200, attack: 30, defense: 12, crystals: 50 },
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'egg_common', name: 'Common Egg', description: 'Random equipment', crystalPrice: 100, category: 'egg', emoji: '🥚' },
  { id: 'egg_rare', name: 'Rare Egg', description: 'Rare equipment', crystalPrice: 300, category: 'egg', emoji: '🥚' },
  { id: 'egg_legendary', name: 'Legendary Egg', description: 'Legendary equipment', crystalPrice: 1000, category: 'egg', emoji: '🥚' },
  { id: 'potion_hp', name: 'Health Potion', description: 'Restore 50 HP', crystalPrice: 50, category: 'potion', emoji: '❤️' },
  { id: 'potion_atk', name: 'Attack Potion', description: '+10 ATK temporarily', crystalPrice: 150, category: 'potion', emoji: '⚔️' },
]

export const QUESTS: Quest[] = [
  { id: 'q1', name: 'First Steps', description: 'Win 10 battles', target: 10, reward: 100, type: 'battle' },
  { id: 'q2', name: 'Monster Hunter', description: 'Win 50 battles', target: 50, reward: 500, type: 'battle' },
  { id: 'q3', name: 'Crystal Collector', description: 'Collect 1000 crystals', target: 1000, reward: 200, type: 'collect' },
  { id: 'q4', name: 'Rising Star', description: 'Reach level 5', target: 5, reward: 300, type: 'level' },
]

const MONSTER_KEYS = Object.keys(MONSTERS)

interface GameState {
  hero: Hero | null
  crystals: number
  quests: PlayerQuest[]
  transactions: Transaction[]
  battle: Battle | null
  isBattling: boolean
  createHero: (name: string, heroClass: HeroClass) => void
  startBattle: () => void
  toggleBattling: () => void
  buyItem: (itemId: string) => void
  claimQuest: (questId: string) => void
  addCrystals: (amount: number) => void
}

const createTransaction = (type: 'earn' | 'spend', amount: number): Transaction => ({
  id: Date.now().toString() + Math.random().toString(36).slice(2),
  type,
  amount,
  timestamp: Date.now(),
})

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      hero: null,
      crystals: 100,
      quests: QUESTS.map(q => ({ id: q.id, progress: 0, claimed: false })),
      transactions: [],
      battle: null,
      isBattling: false,

      createHero: (name, heroClass) => {
        const baseHp = heroClass === 'warrior' ? 150 : heroClass === 'mage' ? 80 : heroClass === 'archer' ? 100 : 70
        const baseAtk = heroClass === 'warrior' ? 25 : heroClass === 'mage' ? 40 : heroClass === 'archer' ? 30 : 35
        const baseDef = heroClass === 'warrior' ? 20 : heroClass === 'mage' ? 10 : heroClass === 'archer' ? 15 : 8
        const baseCrit = heroClass === 'assassin' ? 0.35 : heroClass === 'archer' ? 0.25 : 0.1

        set({
          hero: {
            id: Date.now().toString(),
            name,
            class: heroClass,
            level: 1,
            exp: 0,
            hp: baseHp,
            maxHp: baseHp,
            attack: baseAtk,
            defense: baseDef,
            critRate: baseCrit,
          },
          quests: QUESTS.map(q => ({ id: q.id, progress: 0, claimed: false })),
          transactions: [createTransaction('earn', 100)],
        })
      },

      startBattle: () => {
        const { hero, battle, crystals, quests, transactions } = get()
        if (!hero) return

        if (!battle) {
          const monsterKey = MONSTER_KEYS[Math.floor(Math.random() * MONSTER_KEYS.length)]
          const monster = MONSTERS[monsterKey]
          set({
            battle: {
              monster: monsterKey,
              monsterHp: monster.hp,
              heroHp: hero.hp,
            },
          })
          return
        }

        const monster = MONSTERS[battle.monster]
        const newMonsterHp = Math.max(0, battle.monsterHp - hero.attack)
        const newHeroHp = Math.max(0, battle.heroHp - monster.attack)

        if (newMonsterHp === 0) {
          const newExp = hero.exp + 10
          const levelUp = newExp >= hero.level * 100
          
          set({
            battle: null,
            crystals: crystals + monster.crystals,
            hero: {
              ...hero,
              exp: levelUp ? 0 : newExp,
              level: levelUp ? hero.level + 1 : hero.level,
              hp: hero.maxHp,
            },
            transactions: [createTransaction('earn', monster.crystals), ...transactions].slice(0, 20),
            quests: quests.map(q => {
              const quest = QUESTS.find(x => x.id === q.id)
              if (quest?.type === 'battle') {
                return { ...q, progress: q.progress + 1 }
              }
              if (quest?.type === 'collect' && monster.crystals > 0) {
                return { ...q, progress: q.progress + monster.crystals }
              }
              return q
            }),
          })
        } else if (newHeroHp === 0) {
          set({
            battle: null,
            hero: { ...hero, hp: hero.maxHp },
          })
        } else {
          set({
            battle: {
              ...battle,
              monsterHp: newMonsterHp,
              heroHp: newHeroHp,
            },
          })
        }
      },

      toggleBattling: () => set(state => ({ isBattling: !state.isBattling })),

      buyItem: (itemId) => {
        const { crystals, transactions } = get()
        const item = SHOP_ITEMS.find(i => i.id === itemId)
        if (!item || crystals < item.crystalPrice) return
        
        set({
          crystals: crystals - item.crystalPrice,
          transactions: [createTransaction('spend', item.crystalPrice), ...transactions].slice(0, 20),
        })
      },

      claimQuest: (questId) => {
        const { quests, crystals, transactions, hero } = get()
        const quest = QUESTS.find(q => q.id === questId)
        const playerQuest = quests.find(q => q.id === questId)
        if (!quest || !playerQuest || playerQuest.progress < quest.target || playerQuest.claimed) return

        set({
          crystals: crystals + quest.reward,
          quests: quests.map(q => q.id === questId ? { ...q, claimed: true } : q),
          transactions: [createTransaction('earn', quest.reward), ...transactions].slice(0, 20),
          hero: hero ? {
            ...hero,
            level: quest.type === 'level' ? Math.max(hero.level, quest.target) : hero.level,
          } : null,
        })
      },

      addCrystals: (amount) => {
        const { crystals, transactions } = get()
        set({
          crystals: crystals + amount,
          transactions: [createTransaction('earn', amount), ...transactions].slice(0, 20),
        })
      },
    }),
    { name: 'pixel-quest-storage' }
  )
)
