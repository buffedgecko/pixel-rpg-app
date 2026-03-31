'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { useGameStore } from '../../../store/gameStore'

export default function WalletPage() {
  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWallet()
  const { crystals, transactions } = useGameStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Link href="/game" className="text-purple-400 mb-4 inline-block">← Back</Link>
      
      <h1 className="text-2xl font-bold text-white mb-4">Wallet</h1>

      {/* TON Connect */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-4">
        {wallet ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                💎
              </div>
              <div>
                <div className="text-white font-semibold">Connected</div>
                <div className="text-slate-400 text-xs">{wallet.account.address.slice(0, 8)}...{wallet.account.address.slice(-6)}</div>
              </div>
            </div>
            <button
              onClick={() => tonConnectUI.disconnect()}
              className="w-full py-2 bg-red-600/20 text-red-400 rounded-lg text-sm"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => tonConnectUI.openModal()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold"
          >
            Connect TON Wallet
          </motion.button>
        )}
      </div>

      {/* Crystals Balance */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-4">
        <div className="text-slate-400 text-sm mb-1">Crystal Balance</div>
        <div className="text-3xl font-bold text-purple-400 flex items-center gap-2">
          <span>💎</span>
          <span>{crystals.toLocaleString()}</span>
        </div>
      </div>

      {/* Recent Transactions */}
      <h2 className="text-lg font-semibold text-white mb-2">Recent Activity</h2>
      <div className="space-y-2">
        {transactions.slice(0, 5).map(tx => (
          <div key={tx.id} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
            <div className="flex justify-between items-center">
              <div className="text-white">{tx.type === 'earn' ? '💰 Earned' : '🛒 Spent'}</div>
              <div className={tx.type === 'earn' ? 'text-green-400' : 'text-red-400'}>
                {tx.type === 'earn' ? '+' : '-'}💎 {tx.amount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
