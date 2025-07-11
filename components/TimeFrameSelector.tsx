'use client'

import React from 'react'

interface TimeFrame {
  label: string
  value: string
  shortLabel: string
}

interface TimeFrameSelectorProps {
  selectedTimeFrame: string
  onTimeFrameChange: (timeFrame: string) => void
}

const timeFrames: TimeFrame[] = [
  { label: '24 Stunden', value: '24h', shortLabel: '24H' },
  { label: '3 Tage', value: '3d', shortLabel: '3D' },
  { label: '7 Tage', value: '7d', shortLabel: '7D' },
  { label: '1 Monat', value: '1m', shortLabel: '1M' },
  { label: '1 Jahr', value: '1y', shortLabel: '1Y' },
  { label: 'Alle Zeit', value: 'all', shortLabel: 'ALL' }
]

const TimeFrameSelector: React.FC<TimeFrameSelectorProps> = ({
  selectedTimeFrame,
  onTimeFrameChange
}) => {
  return (
    <div className="flex items-center space-x-1 bg-dark-800/50 rounded-lg p-1 border border-dark-600/50">
      {timeFrames.map((timeFrame) => (
        <button
          key={timeFrame.value}
          onClick={() => onTimeFrameChange(timeFrame.value)}
          className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
            selectedTimeFrame === timeFrame.value
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
              : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700/50'
          }`}
        >
          <span className="hidden sm:inline">{timeFrame.label}</span>
          <span className="sm:hidden">{timeFrame.shortLabel}</span>
        </button>
      ))}
    </div>
  )
}

export default TimeFrameSelector 