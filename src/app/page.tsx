'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'

export default function HomePage() {
  const router = useRouter()
  const hero = useGameStore(state => state.hero)

  useEffect(() => {
    if (hero) {
      router.replace('/game')
    } else {
      router.replace('/create')
    }
  }, [hero, router])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚔️</div>
        <p style={{ color: '#9ca3af' }}>Loading...</p>
      </div>
    </div>
  )
}
