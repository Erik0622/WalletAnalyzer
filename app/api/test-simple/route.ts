import { NextResponse } from 'next/server'
import { validateWalletAddress, connection } from '@/lib/solana'
import { PublicKey } from '@solana/web3.js'

export async function GET() {
  try {
    console.log('🧪 Starting simple connectivity test...')
    
    // Test 1: Wallet-Adress Validierung
    const testAddress = '4EPNLZHUnEbpxZm6qTPkXpMG2EDektbjUA1yAugHJLc4'
    const isValid = validateWalletAddress(testAddress)
    console.log('✅ Wallet validation:', isValid)
    
    if (!isValid) {
      throw new Error('Wallet validation failed')
    }
    
    // Test 2: Einfacher RPC Connection Test
    try {
      const publicKey = new PublicKey(testAddress)
      console.log('✅ PublicKey creation successful')
      
      // Test 3: Nur Block-Height abfragen (sehr leichtgewichtiger Test)
      const blockHeight = await connection.getBlockHeight()
      console.log('✅ Block height retrieved:', blockHeight)
      
      return NextResponse.json({
        success: true,
        message: 'Basis-Funktionalität erfolgreich getestet',
        tests: {
          walletValidation: isValid,
          connectionTest: true,
          currentBlockHeight: blockHeight
        }
      })
      
    } catch (rpcError: any) {
      console.log('⚠️ RPC Error:', rpcError.message)
      
      return NextResponse.json({
        success: false,
        message: 'RPC-Verbindung fehlgeschlagen',
        error: rpcError.message,
        tests: {
          walletValidation: isValid,
          connectionTest: false
        }
      })
    }
    
  } catch (error: any) {
    console.error('❌ Test failed:', error.message)
    
    return NextResponse.json({
      success: false,
      message: 'Test fehlgeschlagen',
      error: error.message
    }, { status: 500 })
  }
} 