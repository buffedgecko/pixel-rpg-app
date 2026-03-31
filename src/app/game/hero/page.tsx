'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore, HERO_CLASSES } from '../../../store/gameStore'

export default function HeroPage() {
  const { hero } = useGameStore()
  
  if (!hero) return null

  const heroClass = HERO_CLASSES[hero.class]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Link href="/game" className="text-purple-400 mb-4 inline-block">← Back</Link>
      
      <div className="text-center mb-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl mb-4"
        >
          {heroClass.emoji}
        </motion.div>
        <h1 className="text-2xl font-bold text-white">{hero.name}</h1>
        <p className="text-purple-300">{heroClass.name} • Level {hero.level}</p>
      </div>

      <div className="space-y-3">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">EXP</span>
            <span className="text-white">{hero.exp}/{hero.level * 100}</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500" style={{ width: `${(hero.exp / (hero.level * 100)) * 100}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
            <div className="text-red-400 text-sm">HP</div>
            <div className="text-white font-bold">{hero.hp}</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
            <div className="text-orange-400 text-sm">ATK</div>
            <div className="text-white font-bold">{hero.attack}</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
            <div className="text-blue-400 text-sm">DEF</div>
            <div className="text-white font-bold">{hero.defense}</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
            <div className="text-yellow-400 text-sm">CRIT</div>
            <div className="text-white font-bold">{(hero.critRate * 100).toFixed(0)}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
