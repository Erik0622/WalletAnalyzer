import Navigation from '@/components/Navigation'
import { BarChart3, TrendingUp, Target, Activity } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-headline text-white mb-4">
              Advanced Analytics
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Deep insights and performance metrics for your trading portfolio
            </p>
          </div>

          <div className="grid-auto-fit mb-12">
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-title text-white">Portfolio Performance</h3>
              </div>
              <p className="text-gray-400">
                Comprehensive analysis of your trading performance across all timeframes
              </p>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-title text-white">Risk Analysis</h3>
              </div>
              <p className="text-gray-400">
                Advanced risk metrics and portfolio optimization recommendations
              </p>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-title text-white">Trade Patterns</h3>
              </div>
              <p className="text-gray-400">
                Identify successful trading patterns and behavioral insights
              </p>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-title text-white">Market Correlation</h3>
              </div>
              <p className="text-gray-400">
                Analyze correlation with market trends and sector performance
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 