'use client'

import React, { useState } from 'react'
import { Filter, ChevronDown, Zap, Clock, DollarSign, X } from 'lucide-react'

interface FilterState {
  marketCap: {
    min: number | null
    max: number | null
  }
  pumpFunOnly: boolean
  holdingDuration: {
    min: number | null // in hours
    max: number | null // in hours
  }
}

interface AdvancedFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const marketCapRanges = [
    { label: 'Micro Cap', min: 0, max: 10000 },
    { label: 'Small Cap', min: 10000, max: 100000 },
    { label: 'Mid Cap', min: 100000, max: 1000000 },
    { label: 'Large Cap', min: 1000000, max: null },
  ]

  const holdingDurations = [
    { label: 'Scalping (<1h)', min: 0, max: 1 },
    { label: 'Day Trading (1-24h)', min: 1, max: 24 },
    { label: 'Swing Trading (1-7d)', min: 24, max: 168 },
    { label: 'Position Trading (>7d)', min: 168, max: null },
  ]

  const handleMarketCapChange = (min: number | null, max: number | null) => {
    onFiltersChange({
      ...filters,
      marketCap: { min, max }
    })
  }

  const handleHoldingDurationChange = (min: number | null, max: number | null) => {
    onFiltersChange({
      ...filters,
      holdingDuration: { min, max }
    })
  }

  const handlePumpFunToggle = () => {
    onFiltersChange({
      ...filters,
      pumpFunOnly: !filters.pumpFunOnly
    })
  }

  const hasActiveFilters = 
    filters.marketCap.min !== null ||
    filters.marketCap.max !== null ||
    filters.pumpFunOnly ||
    filters.holdingDuration.min !== null ||
    filters.holdingDuration.max !== null

  return (
    <div className="glass rounded-xl border border-dark-600/50">
      {/* Filter Header */}
      <div className="p-4 border-b border-dark-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <Filter className="w-4 h-4 text-primary-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Erweiterte Filter</h3>
              <p className="text-xs text-gray-400">
                Verfeinere deine Analyse
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Zurücksetzen</span>
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-1 rounded transition-all duration-200 ${
                isExpanded ? 'text-primary-400 bg-primary-500/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Market Cap Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="w-4 h-4 text-primary-400" />
              <label className="text-sm font-medium text-white">
                Market Cap
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {marketCapRanges.map((range, index) => (
                <button
                  key={index}
                  onClick={() => handleMarketCapChange(range.min, range.max)}
                  className={`p-3 rounded-lg text-xs font-medium transition-all duration-200 border ${
                    filters.marketCap.min === range.min && filters.marketCap.max === range.max
                      ? 'bg-primary-500/20 text-primary-400 border-primary-500/30'
                      : 'bg-dark-800/50 text-gray-300 border-dark-600/50 hover:bg-dark-700/50 hover:text-white'
                  }`}
                >
                  {range.label}
                  <div className="text-xs text-gray-400 mt-1">
                    ${range.min.toLocaleString()}
                    {range.max ? ` - $${range.max.toLocaleString()}` : '+'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Pump.fun Filter */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-warning-400" />
                <label className="text-sm font-medium text-white">
                  Nur Pump.fun Tokens
                </label>
              </div>
              <button
                onClick={handlePumpFunToggle}
                className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
                  filters.pumpFunOnly
                    ? 'bg-warning-500'
                    : 'bg-dark-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
                    filters.pumpFunOnly ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Zeige nur Trades mit Pump.fun Tokens
            </p>
          </div>

          {/* Holding Duration Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-4 h-4 text-success-400" />
              <label className="text-sm font-medium text-white">
                Haltedauer
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {holdingDurations.map((duration, index) => (
                <button
                  key={index}
                  onClick={() => handleHoldingDurationChange(duration.min, duration.max)}
                  className={`p-3 rounded-lg text-xs font-medium transition-all duration-200 border ${
                    filters.holdingDuration.min === duration.min && filters.holdingDuration.max === duration.max
                      ? 'bg-success-500/20 text-success-400 border-success-500/30'
                      : 'bg-dark-800/50 text-gray-300 border-dark-600/50 hover:bg-dark-700/50 hover:text-white'
                  }`}
                >
                  {duration.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="p-3 bg-dark-800/30 rounded-lg border border-dark-700/50">
              <h4 className="text-xs font-medium text-gray-300 mb-2">Aktive Filter:</h4>
              <div className="flex flex-wrap gap-2">
                {filters.marketCap.min !== null && (
                  <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded">
                    Market Cap: ${filters.marketCap.min?.toLocaleString()}
                    {filters.marketCap.max ? ` - $${filters.marketCap.max.toLocaleString()}` : '+'}
                  </span>
                )}
                {filters.pumpFunOnly && (
                  <span className="px-2 py-1 bg-warning-500/20 text-warning-400 text-xs rounded">
                    Nur Pump.fun
                  </span>
                )}
                {filters.holdingDuration.min !== null && (
                  <span className="px-2 py-1 bg-success-500/20 text-success-400 text-xs rounded">
                    Haltedauer: {filters.holdingDuration.min}h
                    {filters.holdingDuration.max ? ` - ${filters.holdingDuration.max}h` : '+'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdvancedFilters 