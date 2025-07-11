'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, TrendingDown } from 'lucide-react'

interface CalendarDay {
  date: string
  pnl: number
  trades: number
  volume: number
}

interface PnLCalendarProps {
  data: CalendarDay[]
}

export default function PnLCalendar({ data }: PnLCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const getDayData = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return data.find(d => d.date === dateStr)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1)
    } else {
      newDate.setMonth(currentMonth + 1)
    }
    setCurrentDate(newDate)
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

  const totalPnL = data.reduce((sum, day) => sum + day.pnl, 0)
  const winDays = data.filter(day => day.pnl > 0).length
  const winRate = data.length > 0 ? (winDays / data.length) * 100 : 0

  return (
    <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">P&L Calendar</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          <span className="text-white font-medium min-w-[140px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className={`text-lg font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(0)}
          </div>
          <div className="text-xs text-gray-400">Total P&L</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">{winRate.toFixed(0)}%</div>
          <div className="text-xs text-gray-400">Win Rate</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-300">{data.length}</div>
          <div className="text-xs text-gray-400">Active Days</div>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square p-1">
            <div className="w-full h-full rounded-lg bg-slate-800/30"></div>
          </div>
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const dayData = getDayData(day)
          const hasPnL = dayData && dayData.pnl !== 0
          const isPositive = dayData && dayData.pnl > 0
          const isToday = new Date().getDate() === day && 
                          new Date().getMonth() === currentMonth && 
                          new Date().getFullYear() === currentYear

          return (
            <div key={day} className="aspect-square p-1">
              <div className={`
                w-full h-full rounded-lg flex flex-col items-center justify-center text-xs font-medium
                transition-all duration-200 cursor-pointer hover:scale-105 relative
                ${isToday ? 'ring-2 ring-blue-400' : ''}
                ${hasPnL
                  ? isPositive 
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                    : 'bg-red-500/20 border border-red-500/30 text-red-400'
                  : 'bg-slate-800/30 border border-slate-700/30 text-gray-500'
                }
              `}>
                <div className="text-[10px] text-gray-400 mb-1">{day}</div>
                {hasPnL && (
                  <div className={`text-[10px] font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{dayData.pnl.toFixed(0)}
                  </div>
                )}
                {hasPnL && (
                  <div className="absolute top-1 right-1">
                    {isPositive ? 
                      <TrendingUp className="w-2 h-2 text-green-400" /> : 
                      <TrendingDown className="w-2 h-2 text-red-400" />
                    }
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500/20 border border-green-500/30 rounded"></div>
          <span>Profit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500/20 border border-red-500/30 rounded"></div>
          <span>Loss</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-800/30 border border-slate-700/30 rounded"></div>
          <span>No Activity</span>
        </div>
      </div>
    </div>
  )
} 