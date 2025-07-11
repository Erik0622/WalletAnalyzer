'use client'

import { useState } from 'react'
import { Filter, X, DollarSign, Clock, Zap } from 'lucide-react'

export interface FilterState {
  marketCap: { min: number | null; max: number | null }
  pumpFunOnly: boolean
  holdingDuration: { min: number | null; max: number | null }
}

interface AdvancedFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
}

export default function AdvancedFilters({ filters, onFiltersChange, onClearFilters }: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const hasActiveFilters = 
    filters.marketCap.min !== null || 
    filters.marketCap.max !== null || 
    filters.pumpFunOnly || 
    filters.holdingDuration.min !== null || 
    filters.holdingDuration.max !== null

  return (
    <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-3 py-1 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <Filter className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Market Cap Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-green-400" />
              <label className="text-sm font-medium text-white">Market Cap Range</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Min ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.marketCap.min || ''}
                  onChange={(e) => updateFilters({
                    marketCap: { 
                      ...filters.marketCap, 
                      min: e.target.value ? Number(e.target.value) : null 
                    }
                  })}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Max ($)</label>
                <input
                  type="number"
                  placeholder="∞"
                  value={filters.marketCap.max || ''}
                  onChange={(e) => updateFilters({
                    marketCap: { 
                      ...filters.marketCap, 
                      max: e.target.value ? Number(e.target.value) : null 
                    }
                  })}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pump.fun Only Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-purple-400" />
              <label className="text-sm font-medium text-white">Token Type</label>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.pumpFunOnly}
                onChange={(e) => updateFilters({ pumpFunOnly: e.target.checked })}
                className="w-4 h-4 rounded border-slate-600 bg-slate-900/50 text-purple-500 focus:ring-purple-400 focus:ring-2"
              />
              <span className="text-sm text-gray-300">Pump.fun tokens only</span>
            </label>
          </div>

          {/* Holding Duration Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-400" />
              <label className="text-sm font-medium text-white">Holding Duration (minutes)</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Min</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.holdingDuration.min || ''}
                  onChange={(e) => updateFilters({
                    holdingDuration: { 
                      ...filters.holdingDuration, 
                      min: e.target.value ? Number(e.target.value) : null 
                    }
                  })}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Max</label>
                <input
                  type="number"
                  placeholder="∞"
                  value={filters.holdingDuration.max || ''}
                  onChange={(e) => updateFilters({
                    holdingDuration: { 
                      ...filters.holdingDuration, 
                      max: e.target.value ? Number(e.target.value) : null 
                    }
                  })}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 