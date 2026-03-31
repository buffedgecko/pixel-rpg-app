'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore, HERO_CLASSES, MONSTERS } from '@/store/gameStore'

export default function GamePage() {
  const { hero, currentMonster, battleLog, isAutoBattle, battleCount, autoBattle, stopBattle, addCrystals } = useGameStore()
  const battleInterval = useRef<NodeJS.Timeout | null>(null)

  // Battle loop
  useEffect(() => {
    if (isAutoBattle && hero && hero.hp > 0) {
      battleInterval.current = setInterval(() => {
        autoBattle()
      }, 2000)
    }
    return () => {
      if (battleInterval.current) {
        clearInterval(battleInterval.current)
      }
    }
  }, [isAutoBattle, hero, autoBattle])

  // Simulate battle result
  useEffect(() => {
    if (currentMonster && hero) {
      const heroDamage = Math.max(1, hero.attack - currentMonster.defense)
      const monsterDamage = Math.max(1, currentMonster.attack - hero.defense)
      const isCrit = Math.random() < hero.critRate
      const finalDamage = isCrit ? heroDamage * 2 : heroDamage

      // Hero wins
      if (finalDamage >= currentMonster.hp) {
        const expGain = currentMonster.crystals * 2
        const goldGain = currentMonster.crystals * 5
        const crystalGain = Math.floor(currentMonster.crystals * (0.5 + Math.random() * 0.5))
        const newExp = hero.exp + expGain
        const levelUp = newExp >= hero.maxExp

        useGameStore.setState(state => ({
          hero: state.hero ? {
            ...state.hero,
            exp: levelUp ? newExp - state.hero.maxExp : newExp,
            maxExp: levelUp ? state.hero.maxExp * 1.5 : state.hero.maxExp,
            level: levelUp ? state.hero.level + 1 : state.hero.level,
            maxHp: levelUp ? Math.floor(state.hero.maxHp * 1.1) : state.hero.maxHp,
            hp: levelUp ? Math.floor(state.hero.maxHp * 1.1) : state.hero.hp,
            attack: levelUp ? Math.floor(state.hero.attack * 1.05) : state.hero.attack,
            defense: levelUp ? Math.floor(state.hero.defense * 1.05) : state.hero.defense,
            gold: state.hero.gold + goldGain,
            crystals: state.hero.crystals + crystalGain,
          } : null,
          currentMonster: null,
          battleLog: [
            `⚔️ ${isCrit ? 'CRIT! ' : ''}Dealt ${finalDamage} damage!`,
            `🎉 Defeated ${currentMonster.emoji} ${currentMonster.name}!`,
            `💰 +${goldGain} Gold | 💎 +${crystalGain} Crystals`,
            levelUp ? `🌟 LEVEL UP! Now Lv.${hero.level + 1}` : '',
          ].filter(Boolean),
        }))
      } else {
        // Monster counter attack
        const heroHpAfter = hero.hp - monsterDamage
        if (heroHpAfter <= 0) {
          useGameStore.setState({
            hero: { ...hero, hp: 0 },
            currentMonster: null,
            isAutoBattle: false,
            battleLog: [...battleLog, `💀 You were defeated! Heal to continue.`],
          })
        } else {
          useGameStore.setState({
            hero: { ...hero, hp: heroHpAfter },
            currentMonster: { ...currentMonster, hp: currentMonster.hp - finalDamage },
            battleLog: [
              `⚔️ ${isCrit ? 'CRIT! ' : ''}Dealt ${finalDamage} to ${currentMonster.emoji}`,
              `💥 Took ${monsterDamage} damage! HP: ${heroHpAfter}/${hero.maxHp}`,
            ],
          })
        }
      }
    }
  }, [currentMonster, hero])

  // Start battle function
  const toggleBattle = useCallback(() => {
    if (isAutoBattle) {
      stopBattle()
    } else {
      if (hero && hero.hp > 0) {
        useGameStore.setState({ isAutoBattle: true })
      }
    }
  }, [isAutoBattle, stopBattle, hero])

  if (!hero) return null

  const heroClass = HERO_CLASSES[hero.class]
  const expPercent = (hero.exp / hero.maxExp) * 100
  const hpPercent = (hero.hp / hero.maxHp) * 100

  return (
    <div style={{ minHeight: '100vh', padding: '1rem', paddingBottom: '80px' }}>
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '1rem',
          border: `2px solid ${heroClass.color}40`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: `${heroClass.color}20`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
          }}>
            {heroClass.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{hero.name}</div>
            <div style={{ color: heroClass.color, fontSize: '0.875rem' }}>Lv.{hero.level} {heroClass.name}</div>
          </div>
        </div>

        {/* HP Bar */}
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            <span>❤️ HP</span>
            <span>{hero.hp}/{hero.maxHp}</span>
          </div>
          <div style={{ height: '8px', background: '#374151', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${hpPercent}%`, height: '100%', background: hpPercent > 30 ? '#ef4444' : '#ef4444', transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* EXP Bar */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            <span>⭐ EXP</span>
            <span>{Math.floor(hero.exp)}/{Math.floor(hero.maxExp)}</span>
          </div>
          <div style={{ height: '6px', background: '#374151', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${expPercent}%`, height: '100%', background: '#f59e0b', transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '0.5rem', background: '#0f0f23', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ATK</div>
            <div style={{ fontWeight: 'bold', color: '#ef4444' }}>{hero.attack}</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.5rem', background: '#0f0f23', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>DEF</div>
            <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>{hero.defense}</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.5rem', background: '#0f0f23', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>CRIT</div>
            <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>{Math.floor(hero.critRate * 100)}%</div>
          </div>
        </div>

        {/* Resources */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '0.75rem', background: '#f59e0b20', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.25rem' }}>💰</div>
            <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>{hero.gold}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '0.75rem', background: '#8b5cf620', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.25rem' }}>💎</div>
            <div style={{ fontWeight: 'bold', color: '#8b5cf6' }}>{hero.crystals}</div>
          </div>
        </div>
      </motion.div>

      {/* Battle Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#1a1a2e',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 'bold' }}>⚔️ Battle Arena</h2>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Battles: {battleCount}</span>
        </div>

        {/* Monster */}
        {currentMonster && (
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }} className="animate-shake">{currentMonster.emoji}</div>
            <div style={{ fontWeight: 'bold' }}>{currentMonster.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              HP: {currentMonster.hp}/{currentMonster.maxHp}
            </div>
          </div>
        )}

        {/* Battle Log */}
        <div style={{
          height: '80px',
          overflow: 'auto',
          background: '#0f0f23',
          borderRadius: '8px',
          padding: '0.75rem',
          marginBottom: '1rem',
          fontSize: '0.75rem',
        }}>
          {battleLog.slice(-4).map((log, i) => (
            <div key={i} style={{ marginBottom: '0.25rem', color: log.includes('Defeated') ? '#22c55e' : log.includes('defeated') ? '#ef4444' : '#fff' }}>
              {log}
            </div>
          ))}
        </div>

        {/* Battle Button */}
        <button
          onClick={toggleBattle}
          disabled={hero.hp <= 0}
          style={{
            width: '100%',
            padding: '1rem',
            background: hero.hp <= 0 ? '#374151' : isAutoBattle ? '#ef4444' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: hero.hp <= 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {hero.hp <= 0 ? '💀 Heal to Continue' : isAutoBattle ? '⏹️ Stop Battle' : '▶️ Start Auto Battle'}
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
