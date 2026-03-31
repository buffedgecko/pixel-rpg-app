'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useGameStore, HERO_CLASSES, type HeroClass } from '@/store/gameStore'

export default function CreatePage() {
  const router = useRouter()
  const createHero = useGameStore(state => state.createHero)
  const [name, setName] = useState('')
  const [selectedClass, setSelectedClass] = useState<HeroClass>('warrior')

  const handleCreate = () => {
    if (!name.trim()) return
    createHero(name.trim(), selectedClass)
    router.push('/game')
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem 1rem',
      background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '400px', margin: '0 auto' }}
      >
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚔️</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Pixel Quest</h1>
          <p style={{ color: '#9ca3af' }}>Create your hero</p>
        </div>

        {/* Name Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af', fontSize: '0.875rem' }}>
            Hero Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            maxLength={15}
            style={{
              width: '100%',
              padding: '1rem',
              background: '#1a1a2e',
              border: '2px solid #374151',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Class Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.75rem', color: '#9ca3af', fontSize: '0.875rem' }}>
            Choose Class
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {(Object.entries(HERO_CLASSES) as [HeroClass, typeof HERO_CLASSES[HeroClass]][]).map(([key, data]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedClass(key)}
                style={{
                  padding: '1rem',
                  background: selectedClass === key ? `${data.color}22` : '#1a1a2e',
                  border: `2px solid ${selectedClass === key ? data.color : '#374151'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{data.emoji}</div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: data.color }}>{data.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{data.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Create Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreate}
          disabled={!name.trim()}
          style={{
            width: '100%',
            padding: '1rem',
            background: name.trim() ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' : '#374151',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: name.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          Start Adventure
        </motion.button>
      </motion.div>
    </div>
  )
}
