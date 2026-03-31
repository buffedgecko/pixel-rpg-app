'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/store/gameStore'

export default function QuestPage() {
  const { hero, battleCount } = useGameStore()

  if (!hero) return null

  const quests = [
    { id: 1, name: 'First Steps', desc: 'Complete 10 battles', target: 10, reward: 100, progress: battleCount },
    { id: 2, name: 'Battle Hardened', desc: 'Complete 50 battles', target: 50, reward: 500, progress: battleCount },
    { id: 3, name: 'War Veteran', desc: 'Complete 100 battles', target: 100, reward: 1000, progress: battleCount },
    { id: 4, name: 'Level Master', desc: 'Reach level 5', target: 5, reward: 200, progress: hero.level },
    { id: 5, name: 'Crystal Collector', desc: 'Collect 100 crystals', target: 100, reward: 50, progress: hero.crystals },
  ]

  return (
    <div style={{ minHeight: '100vh', padding: '1rem', paddingBottom: '80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>📜 Quests</h1>
        
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {quests.map(quest => {
            const completed = quest.progress >= quest.target
            const progressPercent = Math.min(100, (quest.progress / quest.target) * 100)
            
            return (
              <motion.div
                key={quest.id}
                style={{
                  background: completed ? '#22c55e15' : '#1a1a2e',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: completed ? '1px solid #22c55e40' : '1px solid #374151',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold' }}>{completed ? '✅' : '📋'} {quest.name}</span>
                  <span style={{ color: '#f59e0b', fontSize: '0.875rem' }}>+{quest.reward} 💰</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem' }}>{quest.desc}</p>
                
                <div style={{ height: '6px', background: '#374151', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: completed ? '#22c55e' : '#8b5cf6',
                    transition: 'width 0.3s'
                  }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem', textAlign: 'right' }}>
                  {Math.min(quest.progress, quest.target)}/{quest.target}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#1a1a2e',
        borderTop: '1px solid #374151',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.75rem 0',
      }}>
        {[
          { href: '/game', icon: '⚔️', label: 'Battle' },
          { href: '/game/hero', icon: '🦸', label: 'Hero' },
          { href: '/game/shop', icon: '🛒', label: 'Shop' },
          { href: '/game/quest', icon: '📜', label: 'Quest' },
          { href: '/game/wallet', icon: '👛', label: 'Wallet' },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{ textAlign: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: '1.25rem' }}>{item.icon}</div>
            <div style={{ fontSize: '0.625rem', color: '#9ca3af' }}>{item.label}</div>
          </Link>
        ))}
      </nav>
    </div>
  )
}
