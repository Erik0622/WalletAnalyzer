'use client'

import React from 'react'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

interface MetricsCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
  prefix?: string
  suffix?: string
  subtitle?: string
  loading?: boolean
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  prefix = '',
  suffix = '',
  subtitle,
  loading = false
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success-400'
      case 'negative':
        return 'text-danger-400'
      default:
        return 'text-gray-400'
    }
  }

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="w-3 h-3" />
      case 'negative':
        return <TrendingDown className="w-3 h-3" />
      default:
        return <Activity className="w-3 h-3" />
    }
  }

  const getBorderColor = () => {
    switch (changeType) {
      case 'positive':
        return 'border-success-500/30 glow-green'
      case 'negative':
        return 'border-danger-500/30 glow-red'
      default:
        return 'border-dark-600/50'
    }
  }

  if (loading) {
    return (
      <div className="glass rounded-xl p-6 card-hover border border-dark-600/50">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-dark-600 rounded w-24"></div>
            <div className="h-6 w-6 bg-dark-600 rounded"></div>
          </div>
          <div className="h-8 bg-dark-600 rounded w-32 mb-2"></div>
          <div className="h-3 bg-dark-600 rounded w-20"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`glass rounded-xl p-6 card-hover border ${getBorderColor()} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        {icon && (
          <div className={`p-2 rounded-lg ${
            changeType === 'positive' 
              ? 'bg-success-500/20 text-success-400' 
              : changeType === 'negative'
              ? 'bg-danger-500/20 text-danger-400'
              : 'bg-primary-500/20 text-primary-400'
          }`}>
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-white">
            {prefix}{value}{suffix}
          </span>
        </div>

        <div className="flex items-center justify-between">
          {subtitle && (
            <span className="text-xs text-gray-500">
              {subtitle}
            </span>
          )}
          
          {change !== undefined && (
            <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
              {getChangeIcon()}
              <span className="text-xs font-medium">
                {change > 0 ? '+' : ''}{change.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MetricsCard 