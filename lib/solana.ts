import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js'
import axios from 'axios'

// Helius Premium RPC endpoint with API key
const HELIUS_API_KEY = 'fa43e2c8-81f4-4b61-96b7-534ed874139b'
const RPC_ENDPOINTS = [
  `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
  // Fallback endpoints (falls Helius nicht verfügbar)
  'https://api.mainnet-beta.solana.com',
  'https://solana-mainnet.rpc.extrnode.com'
]

// Connection setup mit retry logic
let currentEndpointIndex = 0
export let connection = new Connection(RPC_ENDPOINTS[0], 'confirmed')

// Retry logic für RPC calls (optimiert für Helius Premium)
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 2,
  delayMs: number = 500
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      console.log(`Attempt ${attempt}/${maxRetries} failed:`, error.message)
      
      // Bei Rate-Limiting oder Network-Fehlern, nächsten Endpunkt probieren
      if (error.message?.includes('429') || error.message?.includes('Too many requests')) {
        currentEndpointIndex = (currentEndpointIndex + 1) % RPC_ENDPOINTS.length
        connection = new Connection(RPC_ENDPOINTS[currentEndpointIndex], 'confirmed')
        console.log(`Switching to RPC endpoint: ${RPC_ENDPOINTS[currentEndpointIndex]}`)
      }
      
      if (attempt === maxRetries) {
        throw error
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt))
    }
  }
  throw new Error('Max retries exceeded')
}

// Types für unsere Analyse
export interface TokenBalance {
  mint: string
  amount: number
  decimals: number
  uiAmount: number
}

export interface Transaction {
  signature: string
  blockTime: number
  slot: number
  err: any
  memo?: string
  preBalances: number[]
  postBalances: number[]
  preTokenBalances: TokenBalance[]
  postTokenBalances: TokenBalance[]
}

export interface WalletAnalysis {
  totalPnL: number
  totalVolume: number
  totalTrades: number
  winRate: number
  profitFactor: number
  transactions: Transaction[]
}

// Wallet-Adresse validieren
export function validateWalletAddress(address: string): boolean {
  try {
    new PublicKey(address)
    return true
  } catch {
    return false
  }
}

// Transaktionen einer Wallet abrufen (mit Helius Premium RPC)
export async function getWalletTransactions(
  walletAddress: string,
  limit: number = 100 // Erhöht für Helius Premium
): Promise<ParsedTransactionWithMeta[]> {
  try {
    const publicKey = new PublicKey(walletAddress)
    
    // Get signatures first mit retry logic
    const signatures = await withRetry(async () => {
      return await connection.getSignaturesForAddress(publicKey, {
        limit
      })
    })
    
    if (signatures.length === 0) {
      return []
    }
    
    // Process in larger batches (Helius Premium allows higher throughput)
    const batchSize = 25
    const allTransactions: ParsedTransactionWithMeta[] = []
    
    for (let i = 0; i < signatures.length; i += batchSize) {
      const batch = signatures.slice(i, i + batchSize)
      
      const batchTransactions = await withRetry(async () => {
        return await connection.getParsedTransactions(
          batch.map(sig => sig.signature),
          {
            maxSupportedTransactionVersion: 0
          }
        )
      })
      
      allTransactions.push(...(batchTransactions.filter(tx => tx !== null) as ParsedTransactionWithMeta[]))
      
      // Minimal delay between batches (Helius Premium)
      if (i + batchSize < signatures.length) {
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    }
    
    return allTransactions
  } catch (error) {
    console.error('Error fetching wallet transactions:', error)
    throw new Error('Failed to fetch wallet transactions')
  }
}

// SOL Balance Änderungen berechnen
export function calculateSOLBalanceChange(
  transaction: ParsedTransactionWithMeta,
  walletAddress: string
): number {
  try {
    const walletPubkey = new PublicKey(walletAddress)
    const accountIndex = transaction.transaction.message.accountKeys.findIndex(
      key => key.pubkey.equals(walletPubkey)
    )
    
    if (accountIndex === -1) return 0
    
    const preBalance = transaction.meta?.preBalances[accountIndex] || 0
    const postBalance = transaction.meta?.postBalances[accountIndex] || 0
    
    return (postBalance - preBalance) / 1e9 // Convert from lamports to SOL
  } catch {
    return 0
  }
}

// Token Balance Änderungen berechnen
export function calculateTokenBalanceChanges(
  transaction: ParsedTransactionWithMeta,
  walletAddress: string
): { [mint: string]: number } {
  const changes: { [mint: string]: number } = {}
  
  try {
    const walletPubkey = new PublicKey(walletAddress)
    
    const preTokenBalances = transaction.meta?.preTokenBalances || []
    const postTokenBalances = transaction.meta?.postTokenBalances || []
    
    // Get all unique mints
    const allMints = new Set([
      ...preTokenBalances.map(b => b.mint),
      ...postTokenBalances.map(b => b.mint)
    ])
    
    allMints.forEach(mint => {
      const preBalance = preTokenBalances.find(
        b => b.mint === mint && b.owner === walletAddress
      )?.uiTokenAmount?.uiAmount || 0
      
      const postBalance = postTokenBalances.find(
        b => b.mint === mint && b.owner === walletAddress
      )?.uiTokenAmount?.uiAmount || 0
      
      const change = postBalance - preBalance
      if (change !== 0) {
        changes[mint] = change
      }
    })
    
    return changes
  } catch {
    return changes
  }
}

// Einfache PnL Berechnung (nur SOL für den Anfang)
export function calculateBasicPnL(transactions: ParsedTransactionWithMeta[], walletAddress: string) {
  let totalPnL = 0
  let totalVolume = 0
  let tradeCount = 0
  let wins = 0
  
  transactions.forEach(tx => {
    if (!tx || tx.meta?.err) return
    
    const solChange = calculateSOLBalanceChange(tx, walletAddress)
    const fee = (tx.meta?.fee || 0) / 1e9
    
    // PnL = SOL change - fees
    const pnl = solChange - fee
    totalPnL += pnl
    
    // Volume = absolute SOL change
    const volume = Math.abs(solChange)
    totalVolume += volume
    
    // Count as trade if significant SOL movement
    if (volume > 0.001) {
      tradeCount++
      if (pnl > 0) wins++
    }
  })
  
  const winRate = tradeCount > 0 ? (wins / tradeCount) * 100 : 0
  const losses = tradeCount - wins
  const avgWin = wins > 0 ? totalPnL / wins : 0
  const avgLoss = losses > 0 ? Math.abs(totalPnL) / losses : 1
  const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0
  
  return {
    totalPnL,
    totalVolume,
    totalTrades: tradeCount,
    winRate,
    profitFactor,
    wins,
    losses
  }
} 