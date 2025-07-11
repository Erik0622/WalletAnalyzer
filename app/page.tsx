'use client'

import React, { useState } from 'react'
import Navigation from '@/components/Navigation'
import MetricsCard from '@/components/MetricsCard'
import TimeFrameSelector from '@/components/TimeFrameSelector'
import PerformanceChart from '@/components/PerformanceChart'
import AdvancedFilters from '@/components/AdvancedFilters'
import PnLCalendar from '@/components/PnLCalendar'
import WalletSearch from '@/components/WalletSearch' // Importiert
import { WalletAnalysis } from '@/lib/api' // Importiert
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Activity, 
  BarChart3,
  Volume2,
  Percent,
  Trophy,
  LineChart
} from 'lucide-react'

// Filter state
interface FilterState {
  marketCap: { min: number | null; max: number | null }
  pumpFunOnly: boolean
  holdingDuration: { min: number | null; max: number | null }
}

export default function Dashboard() {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('7d')
  const [walletData, setWalletData] = useState<WalletAnalysis | null>(null) // API-Daten
  const [filters, setFilters] = useState<FilterState>({
    marketCap: { min: null, max: null },
    pumpFunOnly: false,
    holdingDuration: { min: null, max: null }
  })

  // Handler für Wallet-Analyse
  const handleWalletAnalysis = (data: WalletAnalysis) => {
    setWalletData(data)
  }

  // Mock-Daten für Charts (werden noch mit API-Daten verbunden)
  const mockPerformanceData = [
    { date: '2024-01-01', pnl: 1200, cumulative: 1200, volume: 45000 },
    { date: '2024-01-02', pnl: -800, cumulative: 400, volume: 32000 },
    { date: '2024-01-03', pnl: 2100, cumulative: 2500, volume: 67000 },
    { date: '2024-01-04', pnl: 150, cumulative: 2650, volume: 18000 },
    { date: '2024-01-05', pnl: -500, cumulative: 2150, volume: 28000 },
    { date: '2024-01-06', pnl: 1800, cumulative: 3950, volume: 89000 },
    { date: '2024-01-07', pnl: 750, cumulative: 4700, volume: 43000 }
  ]

  const mockCalendarData = Array.from({ length: 30 }, (_, i) => ({
    date: `2024-07-${String(i + 1).padStart(2, '0')}`,
    pnl: Math.random() * 2000 - 1000,
    trades: Math.floor(Math.random() * 20),
    volume: Math.random() * 100000
  }))

  const clearFilters = () => {
    setFilters({
      marketCap: { min: null, max: null },
      pumpFunOnly: false,
      holdingDuration: { min: null, max: null }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Wallet Search Component */}
        <WalletSearch onWalletFound={handleWalletAnalysis} />

        {/* Dashboard Content */}
        {walletData ? (
          <>
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold gradient-text mb-2">
                    Performance für: <span className="text-primary-400 break-all">{walletData.wallet}</span>
                  </h1>
                  <p className="text-gray-400 text-lg">
                    {walletData.dataSource === 'mock' ? 'Demo-Daten - RPC-Verbindung wird optimiert' : 'Live-Daten'}
                  </p>
                </div>
                <div className="mt-4 lg:mt-0">
                  <TimeFrameSelector 
                    selectedTimeFrame={selectedTimeFrame}
                    onTimeFrameChange={setSelectedTimeFrame}
                  />
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricsCard
                  title="Gesamt PnL"
                  value={walletData.totalPnL.toFixed(2)}
                  prefix="$"
                  changeType={walletData.totalPnL >= 0 ? 'positive' : 'negative'}
                  icon={<DollarSign className="w-5 h-5" />}
                  subtitle={`${selectedTimeFrame} Zeitraum`}
                />
                <MetricsCard
                  title="Win Rate"
                  value={walletData.winRate.toFixed(1)}
                  suffix="%"
                  changeType={walletData.winRate > 50 ? 'positive' : 'negative'}
                  icon={<Target className="w-5 h-5" />}
                  subtitle={`${walletData.wins} von ${walletData.totalTrades} Trades`}
                />
                <MetricsCard
                  title="Profit Factor"
                  value={walletData.profitFactor.toFixed(2)}
                  changeType={walletData.profitFactor > 1 ? 'positive' : 'negative'}
                  icon={<Trophy className="w-5 h-5" />}
                  subtitle="Gewinn/Verlust Verhältnis"
                />
                <MetricsCard
                  title="Trades"
                  value={walletData.totalTrades}
                  icon={<Activity className="w-5 h-5" />}
                  subtitle={`Ø ${(walletData.totalTrades / 7).toFixed(1)} pro Tag`}
                />
              </div>

              {/* Additional Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MetricsCard
                  title="Handelsvolumen"
                  value={(walletData.totalVolume / 1000).toFixed(1)}
                  suffix="K"
                  prefix="$"
                  icon={<Volume2 className="w-5 h-5" />}
                  subtitle={`Ø $${(walletData.totalVolume / 7 / 1000).toFixed(1)}K pro Tag`}
                />
                <MetricsCard
                  title="ROI"
                  value={walletData.roi.toFixed(2)}
                  suffix="%"
                  changeType={walletData.roi > 0 ? 'positive' : 'negative'}
                  icon={<Percent className="w-5 h-5" />}
                  subtitle="Return on Investment"
                />
                <MetricsCard
                  title="Sharpe Ratio"
                  value={walletData.sharpeRatio.toFixed(2)}
                  changeType={walletData.sharpeRatio > 1 ? 'positive' : 'negative'}
                  icon={<BarChart3 className="w-5 h-5" />}
                  subtitle="Risiko-adjustierte Rendite"
                />
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="mb-8">
              <AdvancedFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
              <div className="xl:col-span-2">
                <PerformanceChart
                  data={mockPerformanceData}
                  timeFrame={selectedTimeFrame}
                />
              </div>
              <div>
                <PnLCalendar
                  data={mockCalendarData}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20 glass rounded-xl border border-dark-700/50">
            <LineChart className="mx-auto h-16 w-16 text-primary-500 animate-pulse" />
            <h2 className="mt-6 text-2xl font-semibold text-white">Warte auf Analyse</h2>
            <p className="mt-2 text-lg text-gray-400">
              Gib oben eine Solana-Wallet-Adresse ein, um die Analyse zu starten.
            </p>
          </div>
        )}
      </main>
    </div>
  )
} 