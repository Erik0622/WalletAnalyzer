import { NextResponse } from 'next/server'

// Mock-Daten für Offline-Tests
const MOCK_TRANSACTIONS = [
  {
    signature: 'mock-sig-1',
    blockTime: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
    slot: 123456789,
    err: null,
    meta: {
      preBalances: [5000000000], // 5 SOL
      postBalances: [4800000000], // 4.8 SOL
      fee: 5000,
      preTokenBalances: [],
      postTokenBalances: []
    },
    transaction: {
      message: {
        accountKeys: [
          { pubkey: { equals: () => true } }
        ]
      }
    }
  },
  {
    signature: 'mock-sig-2',
    blockTime: Math.floor(Date.now() / 1000) - 43200, // 12 hours ago
    slot: 123456790,
    err: null,
    meta: {
      preBalances: [4800000000], // 4.8 SOL
      postBalances: [5200000000], // 5.2 SOL (Gewinn!)
      fee: 5000,
      preTokenBalances: [],
      postTokenBalances: []
    },
    transaction: {
      message: {
        accountKeys: [
          { pubkey: { equals: () => true } }
        ]
      }
    }
  },
  {
    signature: 'mock-sig-3',
    blockTime: Math.floor(Date.now() / 1000) - 21600, // 6 hours ago
    slot: 123456791,
    err: null,
    meta: {
      preBalances: [5200000000], // 5.2 SOL
      postBalances: [4900000000], // 4.9 SOL
      fee: 5000,
      preTokenBalances: [],
      postTokenBalances: []
    },
    transaction: {
      message: {
        accountKeys: [
          { pubkey: { equals: () => true } }
        ]
      }
    }
  }
]

// Mock PnL Berechnung
function calculateMockPnL() {
  let totalPnL = 0
  let totalVolume = 0
  let tradeCount = 0
  let wins = 0

  MOCK_TRANSACTIONS.forEach(tx => {
    const preBalance = tx.meta.preBalances[0] / 1e9  // Convert to SOL
    const postBalance = tx.meta.postBalances[0] / 1e9
    const fee = tx.meta.fee / 1e9

    const solChange = postBalance - preBalance
    const pnl = solChange - fee
    const volume = Math.abs(solChange)

    totalPnL += pnl
    totalVolume += volume

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

export async function GET() {
  try {
    console.log('🧪 Starting offline test with mock data...')
    
    const testWallet = '4EPNLZHUnEbpxZm6qTPkXpMG2EDektbjUA1yAugHJLc4'
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const analysis = calculateMockPnL()
    
    console.log('✅ Mock analysis completed:', analysis)
    
    return NextResponse.json({
      success: true,
      message: 'Offline-Test mit Mock-Daten erfolgreich',
      data: {
        wallet: testWallet,
        analysis,
        mockTransactions: MOCK_TRANSACTIONS.length,
        testInfo: {
          type: 'offline',
          description: 'Verwendet Mock-Daten um Backend-Logik zu demonstrieren',
          realDataStatus: 'RPC-Verbindung wird noch optimiert'
        }
      }
    })
    
  } catch (error: any) {
    console.error('❌ Offline test failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Offline-Test fehlgeschlagen',
      error: error.message
    }, { status: 500 })
  }
} 