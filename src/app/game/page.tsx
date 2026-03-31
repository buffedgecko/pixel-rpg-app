'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore, HERO_CLASSES, MONSTERS } from '../../store/gameStore'

export default function GamePage() {
  const { hero, battle, startBattle, isBattling, crystals } = useGameStore()
  const battleRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isBattling && hero) {
      battleRef.current = setInterval(() => {
        startBattle()
      }, 1000)
    }
    return () => {
      if (battleRef.current) clearInterval(battleRef.current)
    }
  }, [isBattling, hero, startBattle])

  if (!hero) return null

  const heroClass = HERO_CLASSES[hero.class]
  const monster = battle?.monster ? MONSTERS[battle.monster] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{heroClass.emoji}</span>
          <div>
            <div className="text-white font-bold">{hero.name}</div>
            <div className="text-purple-300 text-sm">Lv.{hero.level}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-purple-400">
          <span>💎</span>
          <span className="font-bold">{crystals.toLocaleString()}</span>
        </div>
      </div>

      {/* Battle Area */}
      <motion.div
        animate={{ scale: isBattling ? [1, 1.02, 1] : 1 }}
        transition={{ repeat: isBattling ? Infinity : 0, duration: 0.5 }}
        className="bg-slate-800/50 rounded-2xl p-4 mb-4 border border-slate-700"
      >
        {monster && battle ? (
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-4xl mb-2">{heroClass.emoji}</div>
              <div className="h-2 w-24 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-500"
                  animate={{ width: `${(battle.heroHp / hero.hp) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-2xl">⚔️</div>
            <div className="text-center">
              <div className="text-4xl mb-2">{monster.emoji}</div>
              <div className="h-2 w-24 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-500"
                  animate={{ width: `${(battle.monsterHp / monster.hp) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 py-8">
            Ready for battle
          </div>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
          <div className="text-red-400 text-sm">ATK</div>
          <div className="text-white font-bold">{hero.attack}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
          <div className="text-blue-400 text-sm">DEF</div>
          <div className="text-white font-bold">{hero.defense}</div>
        </div>
      </div>

      {/* Nav */}
      <div className="grid grid-cols-4 gap-2">
        <Link href="/game/hero" className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
          <div className="text-2xl">👤</div>
          <div className="text-xs text-slate-400">Hero</div>
        </Link>
        <Link href="/game/shop" className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
          <div className="text-2xl">🏪</div>
          <div className="text-xs text-slate-400">Shop</div>
        </Link>
        <Link href="/game/quest" className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
          <div className="text-2xl">📜</div>
          <div className="text-xs text-slate-400">Quest</div>
        </Link>
        <Link href="/game/wallet" className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
          <div className="text-2xl">💎</div>
          <div className="text-xs text-slate-400">Wallet</div>
        </Link>
      </div>
    </div>
  )
}
