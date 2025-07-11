'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import WalletSearch from '@/components/WalletSearch'
import MetricsCard from '@/components/MetricsCard'
import PerformanceChart from '@/components/PerformanceChart'
import PnLCalendar from '@/components/PnLCalendar'
import AdvancedFilters from '@/components/AdvancedFilters'
import TimeFrameSelector from '@/components/TimeFrameSelector'
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Activity, 
  BarChart3, 
  Percent,
  Calculator,
  Zap,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react'

export default function HomePage() {
  const [walletData, setWalletData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('7d')
  const [activeFilters, setActiveFilters] = useState({
    minMarketCap: 0,
    maxMarketCap: 1000000000,
    pumpFunOnly: false,
    holdingPeriod: 'all'
  })

  // Handle wallet analysis
  const handleWalletAnalysis = (data: any) => {
    setWalletData(data)
  }

  // Mock data for demonstration
  const mockMetrics = [
    {
      title: 'Total PnL',
      value: walletData?.totalPnL || 0,
      suffix: ' SOL',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      description: 'Overall profit and loss'
    },
    {
      title: 'Win Rate',
      value: walletData?.winRate || 0,
      suffix: '%',
      change: '+2.3%',
      changeType: 'positive' as const,
      icon: Target,
      description: 'Percentage of profitable trades'
    },
    {
      title: 'Profit Factor',
      value: walletData?.profitFactor || 0,
      suffix: 'x',
      change: '+0.2x',
      changeType: 'positive' as const,
      icon: Calculator,
      description: 'Ratio of gross profit to gross loss'
    },
    {
      title: 'Total Trades',
      value: walletData?.totalTrades || 0,
      suffix: '',
      change: '+5',
      changeType: 'positive' as const,
      icon: Activity,
      description: 'Number of completed transactions'
    },
    {
      title: 'Volume',
      value: walletData?.totalVolume || 0,
      suffix: ' SOL',
      change: '+8.7%',
      changeType: 'positive' as const,
      icon: BarChart3,
      description: 'Total trading volume'
    },
    {
      title: 'ROI',
      value: walletData?.roi || 0,
      suffix: '%',
      change: '+1.8%',
      changeType: 'positive' as const,
      icon: Percent,
      description: 'Return on investment'
    }
  ]

  const features = [
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Deep insights into your trading performance with real-time data analysis'
    },
    {
      icon: Target,
      title: 'Precision Tracking',
      description: 'Accurate PnL calculations and performance metrics for every trade'
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      description: 'Live data synchronization with the Solana blockchain via Helius RPC'
    },
    {
      icon: BarChart3,
      title: 'Smart Filtering',
      description: 'Filter trades by market cap, holding period, and platform-specific criteria'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span className="text-sm font-medium text-purple-400 tracking-wider uppercase">
                Premium Analytics
              </span>
            </div>
            
            <h1 className="text-display text-gradient max-w-4xl mx-auto">
              Elevate Your Solana Trading
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Professional-grade wallet analysis with real-time insights, advanced metrics, 
              and institutional-quality reporting for serious traders.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Helius Premium RPC</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Real-time Data</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Advanced Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wallet Search Section */}
      <section className="py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <WalletSearch 
              onAnalysisComplete={handleWalletAnalysis}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      {!walletData && (
        <section className="py-16 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-headline text-white mb-4">
                Why Choose WalletAnalyzer?
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Built for professional traders who demand precision, speed, and reliability
              </p>
            </div>

            <div className="grid-auto-fit">
              {features.map((feature, index) => (
                <div key={index} className="card card-glow group cursor-pointer">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-title text-white group-hover:text-purple-400 transition-colors">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dashboard Section */}
      {walletData && (
        <section className="py-16 space-y-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Status */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-headline text-white mb-2">
                  Portfolio Analysis
                </h2>
                <p className="text-gray-400">
                  Wallet: {walletData.wallet}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`status-indicator ${
                  walletData.dataSource === 'real' ? 'status-success' : 'status-warning'
                }`}>
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                  {walletData.dataSource === 'real' ? 'Live Data' : 'Demo Mode'}
                </div>
                <TimeFrameSelector 
                  selected={selectedTimeFrame}
                  onSelect={setSelectedTimeFrame}
                />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid-auto-fit">
              {mockMetrics.map((metric, index) => (
                <MetricsCard key={index} {...metric} />
              ))}
            </div>

            {/* Charts and Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-title text-white mb-6">Performance Chart</h3>
                <PerformanceChart timeFrame={selectedTimeFrame} />
              </div>
              
              <div className="card">
                <h3 className="text-title text-white mb-6">PnL Calendar</h3>
                <PnLCalendar />
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="card">
              <h3 className="text-title text-white mb-6">Advanced Filters</h3>
              <AdvancedFilters 
                filters={activeFilters}
                onFiltersChange={setActiveFilters}
              />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">WalletAnalyzer</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>© 2025 WalletAnalyzer</span>
              <span>•</span>
              <span>Powered by Helius RPC</span>
              <span>•</span>
              <span>Built for Solana</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 