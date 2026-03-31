'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore, QUESTS } from '../../../store/gameStore'

export default function QuestPage() {
  const { quests: playerQuests, claimQuest, crystals } = useGameStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Link href="/game" className="text-purple-400 mb-4 inline-block">← Back</Link>
      
      <h1 className="text-2xl font-bold text-white mb-2">Quests</h1>
      <div className="flex items-center gap-2 text-purple-400 mb-4">
        <span>💎</span>
        <span className="font-bold">{crystals.toLocaleString()}</span>
      </div>

      <div className="space-y-3">
        {QUESTS.map(quest => {
          const playerQuest = playerQuests.find(pq => pq.id === quest.id)
          const progress = playerQuest?.progress || 0
          const isComplete = progress >= quest.target
          const isClaimed = playerQuest?.claimed

          return (
            <motion.div
              key={quest.id}
              className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-white font-semibold">{quest.name}</div>
                  <div className="text-slate-400 text-sm">{quest.description}</div>
                </div>
                <div className="text-purple-400 font-bold">💎 {quest.reward}</div>
              </div>

              <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full ${isComplete ? 'bg-green-500' : 'bg-purple-500'}`}
                  style={{ width: `${Math.min((progress / quest.target) * 100, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">{progress}/{quest.target}</span>
                {isComplete && !isClaimed && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => claimQuest(quest.id)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-semibold"
                  >
                    Claim
                  </motion.button>
                )}
                {isClaimed && (
                  <span className="text-green-400 text-sm">✓ Claimed</span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
