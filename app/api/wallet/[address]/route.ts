import { NextRequest, NextResponse } from 'next/server'
import { validateWalletAddress, getWalletTransactions, calculateBasicPnL, connection } from '@/lib/solana'
import { PublicKey } from '@solana/web3.js'

// Mock-Daten als Fallback
const generateMockAnalysis = (walletAddress: string) => {
  // Simuliere realistische Daten basierend auf Wallet-Adresse
  const hash = walletAddress.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const seed = hash % 1000
  
  return {
    totalPnL: (seed % 100) - 50, // -50 bis +50 SOL
    totalVolume: 100 + (seed % 500), // 100-600 SOL
    totalTrades: 5 + (seed % 95), // 5-100 Trades
    winRate: 30 + (seed % 40), // 30-70%
    profitFactor: 0.5 + (seed % 20) / 10, // 0.5-2.5
    wins: Math.floor((5 + (seed % 95)) * (30 + (seed % 40)) / 100),
    losses: Math.floor((5 + (seed % 95)) * (70 - (seed % 40)) / 100),
    dataSource: 'mock',
    note: 'Demo-Daten - Helius Premium RPC wird konfiguriert'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const walletAddress = params.address
    
    console.log(`🎯 Analyzing wallet: ${walletAddress}`)
    
    // Schritt 1: Wallet-Adresse validieren
    if (!validateWalletAddress(walletAddress)) {
      return NextResponse.json({
        success: false,
        error: 'Ungültige Wallet-Adresse'
      }, { status: 400 })
    }
    
    // Schritt 2: Versuche echte Daten zu laden (Helius Premium RPC)
    let analysis
    let dataSource = 'real'
    
    try {
      console.log('🔄 Fetching real transaction data via Helius Premium...')
      
      // Versuche zunächst eine einfache Balance-Abfrage
      const simpleBalance = await connection.getBalance(new PublicKey(walletAddress))
      console.log(`✅ Basic balance check successful: ${simpleBalance / 1e9} SOL`)
      
      // Dann versuche Transaktionen abzurufen (mit kürzerem Timeout)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 8000)
      )
      
      const transactionsPromise = getWalletTransactions(walletAddress, 20)
      
      const transactions = await Promise.race([transactionsPromise, timeoutPromise]) as any
      
      console.log(`✅ Fetched ${transactions.length} transactions`)
      
             const basicAnalysis = calculateBasicPnL(transactions, walletAddress)
       analysis = {
         ...basicAnalysis,
         dataSource: 'real',
         transactionCount: transactions.length
       }
      
    } catch (rpcError: any) {
      console.log('⚠️ Helius RPC failed, falling back to mock data:', rpcError.message)
      
      analysis = generateMockAnalysis(walletAddress)
      dataSource = 'mock'
    }
    
    // Schritt 3: Zusätzliche Metriken berechnen
    const enhancedAnalysis = {
      ...analysis,
      roi: analysis.totalVolume > 0 ? (analysis.totalPnL / analysis.totalVolume) * 100 : 0,
      sharpeRatio: analysis.winRate > 50 ? 1.2 : 0.8, // Vereinfacht
      lastUpdated: new Date().toISOString(),
      wallet: walletAddress
    }
    
    console.log(`✅ Analysis completed using ${dataSource} data:`, enhancedAnalysis)
    
    return NextResponse.json({
      success: true,
      data: enhancedAnalysis,
      meta: {
        wallet: walletAddress,
        dataSource,
        timestamp: new Date().toISOString(),
        status: dataSource === 'real' ? 'live_helius_data' : 'demo_mode'
      }
    })
    
  } catch (error: any) {
    console.error('❌ Wallet analysis failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Wallet-Analyse fehlgeschlagen',
      details: error.message
    }, { status: 500 })
  }
}

// Test endpoint für Health Check
export async function POST(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params
    
    if (!validateWalletAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      status: 'ok',
      address,
      message: 'Wallet address is valid',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Health check failed' },
      { status: 500 }
    )
  }
} 