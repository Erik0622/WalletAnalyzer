// API Service für Frontend-Backend Kommunikation

export interface WalletAnalysis {
  totalPnL: number
  totalVolume: number
  totalTrades: number
  winRate: number
  profitFactor: number
  wins: number
  losses: number
  roi: number
  sharpeRatio: number
  lastUpdated: string
  wallet: string
  dataSource: 'real' | 'mock'
  transactionCount?: number
  note?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  meta?: {
    wallet: string
    dataSource: 'real' | 'mock'
    timestamp: string
    status: 'live_data' | 'demo_mode'
  }
  error?: string
  details?: string
}

// API Service Klasse
class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:3000'
  }

  // Wallet-Analyse abrufen
  async getWalletAnalysis(walletAddress: string): Promise<ApiResponse<WalletAnalysis>> {
    try {
      console.log(`🔍 Fetching analysis for wallet: ${walletAddress}`)
      
      const response = await fetch(`${this.baseUrl}/api/wallet/${walletAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Cache für 1 Minute
        next: { revalidate: 60 }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log(`✅ Analysis received:`, data.meta?.status)
      
      return data
    } catch (error) {
      console.error('❌ API Error:', error)
      throw new Error(`Failed to fetch wallet analysis: ${error}`)
    }
  }

  // Wallet-Adresse validieren
  validateWalletAddress(address: string): boolean {
    // Solana-Adressen sind 32-44 Zeichen lang (Base58)
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
    return solanaAddressRegex.test(address)
  }

  // Demo-Modus Test
  async testOfflineMode(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/test-offline`)
      return await response.json()
    } catch (error) {
      console.error('Offline test failed:', error)
      throw error
    }
  }

  // Einfacher Verbindungstest
  async testConnection(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/test-simple`)
      return await response.json()
    } catch (error) {
      console.error('Connection test failed:', error)
      throw error
    }
  }
}

// Singleton Export
export const apiService = new ApiService()

// Utility Hook für React Components
export const useWalletAnalysis = () => {
  return {
    getAnalysis: apiService.getWalletAnalysis.bind(apiService),
    validateAddress: apiService.validateWalletAddress.bind(apiService),
    testOffline: apiService.testOfflineMode.bind(apiService),
    testConnection: apiService.testConnection.bind(apiService)
  }
} 