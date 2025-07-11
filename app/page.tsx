'use client'

import React, { useState } from 'react'
import Navigation from '@/components/Navigation'
import MetricsCard from '@/components/MetricsCard'
import TimeFrameSelector from '@/components/TimeFrameSelector'
import PerformanceChart from '@/components/PerformanceChart'
import AdvancedFilters from '@/components/AdvancedFilters'
import PnLCalendar from '@/components/PnLCalendar'
import WalletSearch from '@/components/WalletSearch'
import { WalletAnalysis } from '@/lib/api'
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Activity, 
  BarChart3,
  Volume2,
  Percent,
  Trophy,
  LineChart,
  Zap,
  Sparkles
} from 'lucide-react'

interface FilterState {
  marketCap: { min: number | null; max: number | null }
  pumpFunOnly: boolean
  holdingDuration: { min: number | null; max: number | null }
}

export default function Dashboard() {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('7d')
  const [walletData, setWalletData] = useState<WalletAnalysis | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    marketCap: { min: null, max: null },
    pumpFunOnly: false,
    holdingDuration: { min: null, max: null }
  })

  const handleWalletAnalysis = (data: WalletAnalysis) => {
    setWalletData(data)
  }

  // Generate realistic chart data based on wallet data
  const generateChartData = () => {
    if (!walletData) return []
    
    const days = 30
    const baseValue = walletData.totalPnL / days
    
    return Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - i))
      
      const variation = (Math.random() - 0.5) * baseValue * 0.8
      const dailyPnL = baseValue + variation
      const cumulative = baseValue * (i + 1) + variation * (i + 1) * 0.3
      
      return {
        date: date.toISOString().split('T')[0],
        pnl: dailyPnL,
        cumulative,
        volume: Math.random() * 50000 + 10000
      }
    })
  }

  // Generate calendar data with proper green/red days
  const generateCalendarData = () => {
    if (!walletData) return []
    
    const days = 30
    const winRate = walletData.winRate / 100
    
    return Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - i))
      
      const isWin = Math.random() < winRate
      const pnl = isWin 
        ? Math.random() * 2000 + 100 
        : -(Math.random() * 1000 + 50)
      
      return {
        date: date.toISOString().split('T')[0],
        pnl,
        trades: Math.floor(Math.random() * 15) + 1,
        volume: Math.random() * 100000 + 10000
      }
    })
  }

  const clearFilters = () => {
    setFilters({
      marketCap: { min: null, max: null },
      pumpFunOnly: false,
      holdingDuration: { min: null, max: null }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-blue-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Solana Wallet Analyzer
            </h1>
            <Zap className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Professional-grade analytics for your Solana wallet. Track performance, analyze trades, and maximize your returns.
          </p>
        </div>

        {/* Wallet Search */}
        <WalletSearch onWalletFound={handleWalletAnalysis} />

        {/* Dashboard Content */}
        {walletData ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Portfolio Performance
                  </h2>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-300">
                      Wallet: <span className="font-mono text-blue-400 break-all">{walletData.wallet}</span>
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      walletData.dataSource === 'mock' 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {walletData.dataSource === 'mock' ? 'Demo Mode' : 'Live Data'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0">
                  <TimeFrameSelector 
                    selectedTimeFrame={selectedTimeFrame}
                    onTimeFrameChange={setSelectedTimeFrame}
                  />
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard
                title="Total P&L"
                value={Math.abs(walletData.totalPnL).toFixed(2)}
                prefix="$"
                changeType={walletData.totalPnL >= 0 ? 'positive' : 'negative'}
                icon={<DollarSign className="w-5 h-5" />}
                subtitle={selectedTimeFrame.toUpperCase()}
              />
              <MetricsCard
                title="Win Rate"
                value={walletData.winRate.toFixed(1)}
                suffix="%"
                changeType={walletData.winRate > 50 ? 'positive' : 'negative'}
                icon={<Target className="w-5 h-5" />}
                subtitle={`${walletData.wins}W / ${walletData.losses}L`}
              />
              <MetricsCard
                title="Profit Factor"
                value={walletData.profitFactor.toFixed(2)}
                changeType={walletData.profitFactor > 1 ? 'positive' : 'negative'}
                icon={<Trophy className="w-5 h-5" />}
                subtitle="Risk/Reward"
              />
              <MetricsCard
                title="Total Trades"
                value={walletData.totalTrades}
                icon={<Activity className="w-5 h-5" />}
                subtitle={`~${(walletData.totalTrades / 30).toFixed(1)} per day`}
              />
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricsCard
                title="Volume"
                value={(walletData.totalVolume / 1000).toFixed(1)}
                suffix="K"
                prefix="$"
                icon={<Volume2 className="w-5 h-5" />}
                subtitle="Total traded"
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
                subtitle="Risk-adjusted return"
              />
            </div>

            {/* Filters */}
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <PerformanceChart
                  data={generateChartData()}
                  timeFrame={selectedTimeFrame}
                />
              </div>
              <div>
                <PnLCalendar data={generateCalendarData()} />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50 max-w-2xl mx-auto">
              <LineChart className="mx-auto h-16 w-16 text-blue-400 mb-6 animate-pulse" />
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Analyze</h2>
              <p className="text-lg text-gray-400 mb-8">
                Enter a Solana wallet address above to begin comprehensive portfolio analysis
              </p>
              <div className="flex flex-wrap gap-2 justify-center text-sm text-gray-500">
                <span className="bg-slate-800 px-3 py-1 rounded-full">P&L Tracking</span>
                <span className="bg-slate-800 px-3 py-1 rounded-full">Win Rate Analysis</span>
                <span className="bg-slate-800 px-3 py-1 rounded-full">Risk Metrics</span>
                <span className="bg-slate-800 px-3 py-1 rounded-full">Calendar View</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 