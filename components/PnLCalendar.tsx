'use client'

import React, { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

interface DailyPnL {
  date: string
  pnl: number
  trades: number
  volume: number
}

interface PnLCalendarProps {
  data: DailyPnL[]
  loading?: boolean
}

const PnLCalendar: React.FC<PnLCalendarProps> = ({
  data,
  loading = false
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ]

  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

  const getPnLForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return data.find(item => item.date === dateStr)
  }

  const getPnLColor = (pnl: number) => {
    if (pnl > 0) return 'bg-success-500/20 text-success-400 border-success-500/30'
    if (pnl < 0) return 'bg-danger-500/20 text-danger-400 border-danger-500/30'
    return 'bg-dark-700/50 text-gray-400 border-dark-600/30'
  }

  const getPnLIntensity = (pnl: number) => {
    const maxPnl = Math.max(...data.map(d => Math.abs(d.pnl)))
    const intensity = Math.abs(pnl) / maxPnl
    
    if (pnl > 0) {
      return `bg-success-500/${Math.max(10, Math.min(80, intensity * 80))}`
    } else if (pnl < 0) {
      return `bg-danger-500/${Math.max(10, Math.min(80, intensity * 80))}`
    }
    return 'bg-dark-700/30'
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const totalPnL = data.reduce((sum, day) => sum + day.pnl, 0)
  const totalTrades = data.reduce((sum, day) => sum + day.trades, 0)
  const totalVolume = data.reduce((sum, day) => sum + day.volume, 0)
  const profitableDays = data.filter(day => day.pnl > 0).length
  const totalDays = data.length

  if (loading) {
    return (
      <div className="glass rounded-xl p-6 border border-dark-600/50">
        <div className="animate-pulse">
          <div className="h-6 bg-dark-600 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-12 bg-dark-600 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl p-6 border border-dark-600/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-500/20 rounded-lg">
            <Calendar className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">PnL Kalender</h3>
            <p className="text-sm text-gray-400">Tägliche Performance Übersicht</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-700/50 rounded-lg transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-lg font-medium text-white min-w-[140px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-700/50 rounded-lg transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-400 p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before the first day of the month */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="h-12"></div>
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const dayData = getPnLForDate(day)
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

            return (
              <div
                key={day}
                className={`
                  h-12 rounded-lg border transition-all duration-200 cursor-pointer relative overflow-hidden
                  ${dayData ? getPnLColor(dayData.pnl) : 'bg-dark-800/30 border-dark-700/50 text-gray-500'}
                  ${isToday ? 'ring-2 ring-primary-500' : ''}
                  hover:scale-105 hover:shadow-lg
                `}
                title={dayData ? `${day}. - PnL: $${dayData.pnl.toLocaleString()} | Trades: ${dayData.trades} | Volume: $${dayData.volume.toLocaleString()}` : `${day}.`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                  <span className="text-xs font-medium">{day}</span>
                  {dayData && (
                    <span className="text-xs font-bold">
                      {dayData.pnl >= 0 ? '+' : ''}${Math.abs(dayData.pnl) > 1000 ? 
                        `${(dayData.pnl / 1000).toFixed(1)}k` : 
                        dayData.pnl.toFixed(0)
                      }
                    </span>
                  )}
                </div>
                {dayData && (
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${getPnLIntensity(dayData.pnl)}`}></div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-dark-700/50">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Gesamt PnL</p>
          <p className={`text-lg font-bold ${
            totalPnL >= 0 ? 'text-success-400' : 'text-danger-400'
          }`}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Gewinnrate</p>
          <p className="text-lg font-bold text-primary-400">
            {totalDays > 0 ? ((profitableDays / totalDays) * 100).toFixed(1) : 0}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Trades</p>
          <p className="text-lg font-bold text-white">
            {totalTrades.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Volumen</p>
          <p className="text-lg font-bold text-white">
            ${totalVolume.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PnLCalendar 