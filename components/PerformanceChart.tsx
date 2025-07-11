'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'

interface PerformanceData {
  date: string
  pnl: number
  cumulative: number
  volume: number
}

interface PerformanceChartProps {
  data: PerformanceData[]
  timeFrame: string
  loading?: boolean
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="glass p-4 rounded-lg border border-dark-600/50 shadow-xl">
        <p className="text-sm text-gray-400 mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="text-gray-400">PnL: </span>
            <span className={`font-medium ${
              data.pnl >= 0 ? 'text-success-400' : 'text-danger-400'
            }`}>
              {data.pnl >= 0 ? '+' : ''}${data.pnl.toLocaleString()}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-gray-400">Kumulativ: </span>
            <span className={`font-medium ${
              data.cumulative >= 0 ? 'text-success-400' : 'text-danger-400'
            }`}>
              {data.cumulative >= 0 ? '+' : ''}${data.cumulative.toLocaleString()}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-gray-400">Volumen: </span>
            <span className="text-primary-400 font-medium">
              ${data.volume.toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  timeFrame,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="glass rounded-xl p-6 border border-dark-600/50">
        <div className="animate-pulse">
          <div className="h-6 bg-dark-600 rounded w-48 mb-6"></div>
          <div className="h-64 bg-dark-600 rounded"></div>
        </div>
      </div>
    )
  }

  const isPositive = data.length > 0 && data[data.length - 1]?.cumulative >= 0

  return (
    <div className="glass rounded-xl p-6 border border-dark-600/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Performance Übersicht
          </h3>
          <p className="text-sm text-gray-400">
            PnL Entwicklung - {timeFrame}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <span className="text-xs text-gray-400">Kumulativer PnL</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success-500 rounded-full"></div>
            <span className="text-xs text-gray-400">Tagesvolumen</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? "#22c55e" : "#ef4444"}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? "#22c55e" : "#ef4444"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke={isPositive ? "#22c55e" : "#ef4444"}
              strokeWidth={2}
              fill="url(#colorPnl)"
            />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#3b82f6"
              strokeWidth={1}
              dot={false}
              opacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Höchster Gewinn</p>
          <p className="text-sm font-medium text-success-400">
            +$
            {Math.max(...data.map(d => d.cumulative)).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Größter Verlust</p>
          <p className="text-sm font-medium text-danger-400">
            -$
            {Math.abs(Math.min(...data.map(d => d.cumulative))).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Ø Tagesvolumen</p>
          <p className="text-sm font-medium text-primary-400">
            $
            {(data.reduce((sum, d) => sum + d.volume, 0) / data.length).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PerformanceChart 