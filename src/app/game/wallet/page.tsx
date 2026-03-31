'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { useGameStore } from '@/store/gameStore'

export default function WalletPage() {
  const { hero, addCrystals, withdraw, transactions, pendingWithdraw } = useGameStore()
  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWallet()
  const [amount, setAmount] = useState('')
  const [showDeposit, setShowDeposit] = useState(false)

  if (!hero) return null

  const handleDeposit = () => {
    const crystalAmount = parseInt(amount) || 100
    addCrystals(crystalAmount)
    setAmount('')
    setShowDeposit(false)
  }

  const handleWithdraw = () => {
    const crystalAmount = parseInt(amount) || 100
    if (hero.crystals >= crystalAmount) {
      withdraw(crystalAmount)
      setAmount('')
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '1rem', paddingBottom: '80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>👛 Wallet</h1>
        
        {/* TON Connection */}
        <div style={{
          background: '#1a1a2e',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '1rem',
          border: '1px solid #374151',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>TON Wallet</div>
              {wallet ? (
                <div style={{ fontWeight: 'bold', color: '#22c55e' }}>✅ {(wallet as any).appName}</div>
              ) : (
                <div style={{ color: '#9ca3af' }}>Not connected</div>
              )}
            </div>
            <button
              onClick={() => tonConnectUI.connectWallet()}
              style={{
                padding: '0.75rem 1.5rem',
                background: wallet ? '#22c55e' : 'linear-gradient(135deg, #0098ea 0%, #0098ea 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {wallet ? 'Connected' : 'Connect'}
            </button>
          </div>
        </div>

        {/* Crystal Balance */}
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.875rem', color: '#fff', opacity: 0.8, marginBottom: '0.5rem' }}>
            💎 Crystal Balance
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{hero.crystals}</div>
          <div style={{ fontSize: '0.75rem', color: '#fff', opacity: 0.6, marginTop: '0.5rem' }}>
            ≈ {(hero.crystals * 0.001).toFixed(4)} TON
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setShowDeposit(true)}
            style={{
              padding: '1rem',
              background: '#22c55e20',
              border: '1px solid #22c55e',
              borderRadius: '12px',
              color: '#22c55e',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            💰 Deposit
          </button>
          <button
            onClick={handleWithdraw}
            disabled={!wallet || hero.crystals < 10}
            style={{
              padding: '1rem',
              background: hero.crystals >= 10 && wallet ? '#f59e0b20' : '#374151',
              border: hero.crystals >= 10 && wallet ? '1px solid #f59e0b' : 'none',
              borderRadius: '12px',
              color: hero.crystals >= 10 && wallet ? '#f59e0b' : '#6b7280',
              fontWeight: 'bold',
              cursor: hero.crystals >= 10 && wallet ? 'pointer' : 'not-allowed',
            }}
          >
            📤 Withdraw
          </button>
        </div>

        {/* Transaction History */}
        <div style={{
          background: '#1a1a2e',
          borderRadius: '12px',
          padding: '1rem',
        }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
            📋 Transaction History
          </h3>
          {transactions.length === 0 ? (
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center' }}>
              No transactions yet
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {transactions.slice(0, 5).map(tx => (
                <div key={tx.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem',
                  background: '#0f0f23',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                }}>
                  <span>{tx.type === 'deposit' ? '💰 Deposit' : '📤 Withdraw'}</span>
                  <span style={{ color: tx.type === 'deposit' ? '#22c55e' : '#f59e0b' }}>
                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount} 💎
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDeposit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={() => setShowDeposit(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#1a1a2e',
                borderRadius: '16px',
                padding: '1.5rem',
                width: '100%',
                maxWidth: '320px',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
                💰 Deposit Crystals
              </h3>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Amount (e.g. 100)"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#0f0f23',
                  border: '2px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                {[100, 500, 1000, 5000].map(a => (
                  <button
                    key={a}
                    onClick={() => setAmount(a.toString())}
                    style={{
                      padding: '0.5rem',
                      background: amount === a.toString() ? '#8b5cf6' : '#374151',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <button
                onClick={handleDeposit}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Confirm Deposit
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
