'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useGameStore, HERO_CLASSES, type HeroClass } from '../../store/gameStore'

export default function CreatePage() {
  const router = useRouter()
  const { createHero } = useGameStore()
  const [name, setName] = useState('')
  const [selectedClass, setSelectedClass] = useState<HeroClass>('warrior')

  const handleCreate = () => {
    if (name.trim()) {
      createHero(name.trim(), selectedClass)
      router.push('/game')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Create Hero</h1>
        
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Hero Name"
          className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white mb-6"
        />

        <div className="grid grid-cols-2 gap-3 mb-6">
          {(Object.entries(HERO_CLASSES) as [HeroClass, typeof HERO_CLASSES[HeroClass]][]).map(([key, cls]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedClass(key)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedClass === key
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-slate-700 bg-slate-800'
              }`}
            >
              <div className="text-3xl mb-2">{cls.emoji}</div>
              <div className="text-white font-semibold">{cls.name}</div>
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreate}
          disabled={!name.trim()}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-semibold"
        >
          Create Hero
        </motion.button>
      </div>
    </div>
  )
}
