'use client'

import { useState } from 'react'
import { Search, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

interface WalletSearchProps {
  onWalletFound: (walletData: any) => void
}

export default function WalletSearch({ onWalletFound }: WalletSearchProps) {
  const [walletInput, setWalletInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validateWalletAddress = (address: string): boolean => {
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
    return solanaAddressRegex.test(address)
  }

  const searchWallet = async () => {
    if (!walletInput.trim()) return
    
    if (!validateWalletAddress(walletInput)) {
      setStatus('error')
      setErrorMessage('Ungültige Solana Wallet-Adresse')
      return
    }

    setIsLoading(true)
    setStatus('loading')
    setErrorMessage('')
    
    try {
      console.log('🔍 Searching wallet:', walletInput)
      
      const response = await fetch(`/api/wallet/${walletInput}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        setStatus('success')
        onWalletFound(result.data)
        console.log('✅ Wallet data loaded:', result.meta?.status)
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Fehler beim Laden der Wallet-Daten')
      }
    } catch (error) {
      console.error('❌ Wallet search failed:', error)
      setStatus('error')
      setErrorMessage('Netzwerkfehler - bitte versuchen Sie es erneut')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      searchWallet()
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Search className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="mb-8">
      <div className="glass rounded-xl p-6 border border-primary-500/30">
        <h2 className="text-xl font-bold text-white mb-4">Wallet Analysieren</h2>
        
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={walletInput}
                onChange={(e) => setWalletInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Solana Wallet-Adresse eingeben..."
                className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
                disabled={isLoading}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                {getStatusIcon()}
              </div>
            </div>
            
            {status === 'error' && errorMessage && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errorMessage}
              </p>
            )}
            
            {status === 'success' && (
              <p className="text-green-400 text-sm mt-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Wallet-Daten erfolgreich geladen
              </p>
            )}
          </div>
          
          <button
            onClick={searchWallet}
            disabled={isLoading || !walletInput.trim()}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analysiere...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Analysieren
              </>
            )}
          </button>
        </div>
        
        <div className="mt-4 text-sm text-gray-400">
          <p>💡 Beispiel: 4EPNLZHUnEbpxZm6qTPkXpMG2EDektbjUA1yAugHJLc4</p>
        </div>
      </div>
    </div>
  )
} 