'use client'

import { useState } from 'react'
import { Search, Loader2, AlertCircle, CheckCircle, Sparkles } from 'lucide-react'

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
      setErrorMessage('Invalid Solana wallet address format')
      return
    }

    setIsLoading(true)
    setStatus('loading')
    setErrorMessage('')
    
    try {
      console.log('🔍 Analyzing wallet:', walletInput)
      
      const response = await fetch(`/api/wallet/${walletInput}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        setStatus('success')
        onWalletFound(result.data)
        console.log('✅ Wallet analysis complete:', result.meta?.status)
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Failed to analyze wallet data')
      }
    } catch (error) {
      console.error('❌ Wallet analysis failed:', error)
      setStatus('error')
      setErrorMessage('Network error - please try again')
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
        return <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Search className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="mb-12">
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Analyze Wallet</h2>
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={walletInput}
                onChange={(e) => setWalletInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Solana wallet address..."
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                disabled={isLoading}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                {getStatusIcon()}
              </div>
            </div>
            
            {status === 'error' && errorMessage && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errorMessage}
                </p>
              </div>
            )}
            
            {status === 'success' && (
              <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Wallet analysis complete
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={searchWallet}
            disabled={isLoading || !walletInput.trim()}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Analyze
              </>
            )}
          </button>
        </div>
        
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
          <span>💡 Try:</span>
          <code className="bg-slate-800 px-2 py-1 rounded text-blue-400 font-mono text-xs">
            4EPNLZHUnEbpxZm6qTPkXpMG2EDektbjUA1yAugHJLc4
          </code>
        </div>
      </div>
    </div>
  )
} 