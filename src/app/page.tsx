'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'

export default function HomePage() {
  const router = useRouter()
  const { hero } = useGameStore()

  useEffect(() => {
    if (hero) {
      router.push('/game')
    }
  }, [hero, router])

  if (hero) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-8xl mb-6"
        >
          ⚔️
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-2">Pixel Quest</h1>
        <p className="text-purple-300 mb-8">Idle RPG Adventure</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/create')}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold"
        >
          Start Adventure
        </motion.button>
      </motion.div>
    </div>
  )
}
