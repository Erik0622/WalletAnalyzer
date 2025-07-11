import React from 'react'
import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Solana Wallet Analyzer - Elevate Your Trading Game',
  description: 'Advanced wallet analysis tool for Solana traders. Track PnL, performance metrics, and trading patterns to take your trading to the next level.',
  keywords: 'Solana, wallet analyzer, trading, PnL, performance, analytics, DeFi',
  authors: [{ name: 'Solana Wallet Analyzer' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
        <div className="min-h-screen bg-gradient-to-br from-dark-950/90 via-dark-900/90 to-dark-800/90">
          {children}
        </div>
      </body>
    </html>
  )
} 