'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore, SHOP_ITEMS } from '@/store/gameStore'

export default function ShopPage() {
  const { hero, buyItem, heal } = useGameStore()
  const [purchased, setPurchased] = useState<string | null>(null)

  const handleBuy = (itemId: string) => {
    if (buyItem(itemId)) {
      setPurchased(itemId)
      setTimeout(() => setPurchased(null), 1500)
    }
  }

  if (!hero) return null

  return (
    <div style={{ minHeight: '100vh', padding: '1rem', paddingBottom: '80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>🛒 Shop</h1>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '0.75rem', background: '#f59e0b20', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>💰 Gold</div>
            <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>{hero.gold}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '0.75rem', background: '#8b5cf620', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>💎 Crystals</div>
            <div style={{ fontWeight: 'bold', color: '#8b5cf6' }}>{hero.crystals}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {SHOP_ITEMS.map(item => {
            const canAfford = item.currency === 'gold' ? hero.gold >= item.price : hero.crystals >= item.price
            return (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => canAfford && handleBuy(item.id)}
                style={{
                  background: '#1a1a2e',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: canAfford ? '1px solid #374151' : '1px solid #1f2937',
                  opacity: canAfford ? 1 : 0.5,
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>{item.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{item.description}</div>
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: canAfford ? `${item.currency === 'gold' ? '#f59e0b' : '#8b5cf6'}20` : '#374151',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    color: canAfford ? (item.currency === 'gold' ? '#f59e0b' : '#8b5cf6') : '#6b7280',
                  }}>
                    {item.price} {item.currency === 'gold' ? '💰' : '💎'}
                  </div>
                </div>
                
                <AnimatePresence>
                  {purchased === item.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: '#22c55e80',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                      }}
                    >
                      ✅ Purchased!
                    </motion.div>
                  )}
                </AnimatePresence>
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
