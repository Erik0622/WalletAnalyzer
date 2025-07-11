'use client'

import React, { useState } from 'react'
import { Search, Loader2, AlertCircle, CheckCircle, Wallet, TrendingUp } from 'lucide-react'

interface WalletSearchProps {
  onAnalysisComplete: (data: any) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export default function WalletSearch({ 
  onAnalysisComplete, 
  isLoading, 
  setIsLoading 
}: WalletSearchProps) {
  const [walletAddress, setWalletAddress] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const validateWalletAddress = (address: string): boolean => {
    // Basic Solana wallet address validation
    const solanaAddressRegex = /^[A-Za-z0-9]{44}$/
    return solanaAddressRegex.test(address)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!walletAddress.trim()) {
      setError('Please enter a wallet address')
      setStatus('error')
      return
    }

    if (!validateWalletAddress(walletAddress.trim())) {
      setError('Invalid wallet address format')
      setStatus('error')
      return
    }

    setIsLoading(true)
    setStatus('loading')

    try {
      const response = await fetch(`/api/wallet/${walletAddress.trim()}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setStatus('success')
        onAnalysisComplete(result.data)
      } else {
        throw new Error(result.error || 'Analysis failed')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze wallet')
      setStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setWalletAddress(value)
    setError('')
    setStatus('idle')
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

  const getStatusMessage = () => {
    switch (status) {
      case 'loading':
        return 'Analyzing wallet...'
      case 'success':
        return 'Analysis complete!'
      case 'error':
        return error
      default:
        return 'Enter a Solana wallet address to begin analysis'
    }
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <TrendingUp className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="text-title text-white mb-2">
          Wallet Analysis
        </h2>
        <p className="text-gray-400">
          Enter your Solana wallet address to get detailed trading insights
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Wallet className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="text"
            value={walletAddress}
            onChange={handleInputChange}
            placeholder="Enter Solana wallet address (e.g., 4EPNLZHUnEbpxZm6qTPkXpMG2EDektbjUA1yAugHJLc4)"
            className={`input pl-12 pr-16 py-4 text-lg ${
              error ? 'border-red-500 focus:ring-red-500' : ''
            } ${status === 'success' ? 'border-green-500' : ''}`}
            disabled={isLoading}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {getStatusIcon()}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !walletAddress.trim()}
          className={`btn btn-primary w-full py-4 text-lg font-medium transition-all duration-200 ${
            isLoading || !walletAddress.trim()
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-glow'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Analyze Wallet</span>
            </div>
          )}
        </button>
      </form>

      {/* Status Message */}
      <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm ${
            status === 'error' ? 'text-red-400' : 
            status === 'success' ? 'text-green-400' : 
            status === 'loading' ? 'text-blue-400' : 
            'text-gray-400'
          }`}>
            {getStatusMessage()}
          </span>
        </div>
        
        {status === 'loading' && (
          <div className="mt-2 text-xs text-gray-500">
            Fetching transaction data from Helius RPC...
          </div>
        )}
      </div>

      {/* Sample Address */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span className="text-sm font-medium text-blue-400">Try Sample Address</span>
        </div>
        <div className="text-xs text-gray-400 mb-2">
          Use this address to test the analyzer:
        </div>
        <button
          onClick={() => setWalletAddress('4EPNLZHUnEbpxZm6qTPkXpMG2EDektbjUA1yAugHJLc4')}
          className="text-xs text-mono text-blue-400 hover:text-blue-300 transition-colors cursor-pointer break-all"
          disabled={isLoading}
        >
          4EPNLZHUnEbpxZm6qTPkXpMG2EDektbjUA1yAugHJLc4
        </button>
      </div>
    </div>
  )
} 