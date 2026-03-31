'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore, HERO_CLASSES } from '@/store/gameStore'

export default function HeroPage() {
  const { hero, reset } = useGameStore()

  if (!hero) return null

  const heroClass = HERO_CLASSES[hero.class]

  return (
    <div style={{ minHeight: '100vh', padding: '1rem', paddingBottom: '80px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '24px',
          padding: '2rem',
          textAlign: 'center',
          border: `2px solid ${heroClass.color}40`,
        }}
      >
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }} className="animate-float">
          {heroClass.emoji}
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{hero.name}</h1>
        <p style={{ color: heroClass.color, marginBottom: '1.5rem' }}>
          Lv.{hero.level} {heroClass.name}
        </p>

        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'HP', value: `${hero.hp}/${hero.maxHp}`, icon: '❤️', color: '#ef4444' },
            { label: 'Attack', value: hero.attack, icon: '⚔️', color: '#ef4444' },
            { label: 'Defense', value: hero.defense, icon: '🛡️', color: '#3b82f6' },
            { label: 'Crit Rate', value: `${hero.critRate * 100}%`, icon: '🎯', color: '#f59e0b' },
            { label: 'Gold', value: hero.gold, icon: '💰', color: '#f59e0b' },
            { label: 'Crystals', value: hero.crystals, icon: '💎', color: '#8b5cf6' },
          ].map(stat => (
            <div key={stat.label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              background: '#0f0f23',
              borderRadius: '12px',
            }}>
              <span style={{ color: '#9ca3af' }}>{stat.icon} {stat.label}</span>
              <span style={{ fontWeight: 'bold', color: stat.color }}>{stat.value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            if (confirm('Reset all progress?')) {
              reset()
              window.location.href = '/create'
            }
          }}
          style={{
            width: '100%',
            padding: '1rem',
            background: '#ef444420',
            border: '1px solid #ef4444',
            borderRadius: '12px',
            color: '#ef4444',
            cursor: 'pointer',
          }}
        >
          🗑️ Reset Progress
        </button>
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
