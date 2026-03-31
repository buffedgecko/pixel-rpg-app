'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore, SHOP_ITEMS } from '../../../store/gameStore'

export default function ShopPage() {
  const { crystals, buyItem } = useGameStore()
  const [tab, setTab] = useState<'eggs' | 'potions'>('eggs')

  const items = SHOP_ITEMS.filter(item => 
    tab === 'eggs' ? item.category === 'egg' : item.category === 'potion'
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Link href="/game" className="text-purple-400 mb-4 inline-block">← Back</Link>
      
      <h1 className="text-2xl font-bold text-white mb-2">Shop</h1>
      <div className="flex items-center gap-2 text-purple-400 mb-4">
        <span>💎</span>
        <span className="font-bold">{crystals.toLocaleString()}</span>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('eggs')}
          className={`flex-1 py-2 rounded-xl font-semibold ${
            tab === 'eggs' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}
        >
          🥚 Eggs
        </button>
        <button
          onClick={() => setTab('potions')}
          className={`flex-1 py-2 rounded-xl font-semibold ${
            tab === 'potions' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}
        >
          🧪 Potions
        </button>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <motion.div
            key={item.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => buyItem(item.id)}
            className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{item.emoji}</div>
              <div>
                <div className="text-white font-semibold">{item.name}</div>
                <div className="text-slate-400 text-sm">{item.description}</div>
              </div>
            </div>
            <div className="text-purple-400 font-bold">
              💎 {item.crystalPrice}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
