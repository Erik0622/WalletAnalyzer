import { NextRequest, NextResponse } from 'next/server'
import { 
  validateWalletAddress, 
  getWalletTransactions, 
  calculateBasicPnL,
  calculateSOLBalanceChange 
} from '@/lib/solana'

// Test-Wallet Adresse
const TEST_WALLET = '4EPNLZHUnEbpxZm6qTPkXpMG2EDektbjUA1yAugHJLc4'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const testResults: any[] = []
  
  try {
    console.log('🧪 Starting isolated wallet analysis tests...')
    console.log(`🎯 Test wallet: ${TEST_WALLET}`)
    
    // Test 1: Wallet Address Validation
    testResults.push({
      test: 'Wallet Address Validation',
      status: 'running',
      timestamp: new Date().toISOString()
    })
    
    const isValid = validateWalletAddress(TEST_WALLET)
    testResults[0].status = isValid ? 'passed' : 'failed'
    testResults[0].result = { isValid }
    console.log(`✅ Test 1: Wallet validation - ${isValid ? 'PASSED' : 'FAILED'}`)
    
    if (!isValid) {
      throw new Error('Invalid test wallet address')
    }
    
    // Test 2: Connection & Transaction Fetching
    testResults.push({
      test: 'Transaction Fetching',
      status: 'running',
      timestamp: new Date().toISOString()
    })
    
    const transactions = await getWalletTransactions(TEST_WALLET, 50)
    testResults[1].status = 'passed'
    testResults[1].result = {
      transactionCount: transactions.length,
      hasTransactions: transactions.length > 0,
      firstTx: transactions[0] ? {
        signature: transactions[0].transaction.signatures[0],
        blockTime: transactions[0].blockTime
      } : null
    }
    console.log(`✅ Test 2: Transaction fetching - Found ${transactions.length} transactions`)
    
    // Test 3: SOL Balance Calculation
    testResults.push({
      test: 'SOL Balance Calculation',
      status: 'running',
      timestamp: new Date().toISOString()
    })
    
    let solBalanceTests = 0
    let validSolChanges = 0
    
    transactions.slice(0, 5).forEach((tx, index) => {
      if (tx) {
        const solChange = calculateSOLBalanceChange(tx, TEST_WALLET)
        solBalanceTests++
        if (!isNaN(solChange)) validSolChanges++
        
        console.log(`  📊 TX ${index + 1}: SOL change = ${solChange.toFixed(6)} SOL`)
      }
    })
    
    testResults[2].status = validSolChanges > 0 ? 'passed' : 'failed'
    testResults[2].result = {
      totalTests: solBalanceTests,
      validCalculations: validSolChanges,
      successRate: solBalanceTests > 0 ? (validSolChanges / solBalanceTests) * 100 : 0
    }
    console.log(`✅ Test 3: SOL balance calculation - ${validSolChanges}/${solBalanceTests} valid`)
    
    // Test 4: Basic PnL Analysis
    testResults.push({
      test: 'PnL Analysis',
      status: 'running',
      timestamp: new Date().toISOString()
    })
    
    const analysis = calculateBasicPnL(transactions, TEST_WALLET)
    testResults[3].status = 'passed'
    testResults[3].result = analysis
    
    console.log(`✅ Test 4: PnL Analysis complete`)
    console.log(`  💰 Total PnL: ${analysis.totalPnL.toFixed(6)} SOL`)
    console.log(`  📈 Total Volume: ${analysis.totalVolume.toFixed(6)} SOL`)
    console.log(`  🎯 Win Rate: ${analysis.winRate.toFixed(2)}%`)
    console.log(`  📊 Trades: ${analysis.totalTrades}`)
    
    // Test 5: Performance Check
    const endTime = Date.now()
    const executionTime = endTime - startTime
    
    testResults.push({
      test: 'Performance',
      status: executionTime < 10000 ? 'passed' : 'warning',
      result: {
        executionTimeMs: executionTime,
        executionTimeS: (executionTime / 1000).toFixed(2),
        performance: executionTime < 5000 ? 'excellent' : 
                    executionTime < 10000 ? 'good' : 'slow'
      },
      timestamp: new Date().toISOString()
    })
    
    console.log(`⏱️  Test 5: Performance - ${executionTime}ms (${(executionTime/1000).toFixed(2)}s)`)
    
    // Summary
    const passedTests = testResults.filter(t => t.status === 'passed').length
    const totalTests = testResults.length
    const allPassed = passedTests === totalTests
    
    console.log(`\n🎯 Test Summary: ${passedTests}/${totalTests} tests passed`)
    console.log(allPassed ? '🎉 ALL TESTS PASSED! Ready for integration.' : '⚠️  Some tests failed or have warnings.')
    
    return NextResponse.json({
      success: allPassed,
      wallet: TEST_WALLET,
      summary: {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        executionTimeMs: executionTime,
        allPassed
      },
      testResults,
      walletAnalysis: analysis,
      recommendations: allPassed ? [
        'Wallet analysis is working correctly',
        'Ready to integrate into frontend',
        'Consider adding token price data for more accurate PnL'
      ] : [
        'Review failed tests',
        'Check Solana RPC connection',
        'Verify wallet has sufficient transaction history'
      ]
    })
    
  } catch (error) {
    console.error('❌ Test suite failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      wallet: TEST_WALLET,
      testResults,
      executionTimeMs: Date.now() - startTime
    }, { status: 500 })
  }
} 