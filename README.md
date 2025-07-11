# 🚀 Solana Wallet Analyzer

**Elevate Your Trading Game** - Eine professionelle Wallet-Analyse-Website für Solana-Trader

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)

## ✨ Features

### 📊 **Dashboard & Metriken**
- **PnL Tracking** - Detaillierte Profit & Loss Analyse
- **Performance Metriken** - Win Rate, Profit Factor, ROI, Sharpe Ratio
- **Trading Statistiken** - Anzahl Trades, Volumen, durchschnittliche Gewinne
- **Echtzeitaktualisierung** - Live-Updates der Wallet-Performance

### 📈 **Performance Charts**
- **Interaktive Diagramme** - Powered by Recharts
- **Kumulative PnL** - Zeitliche Entwicklung der Gesamtperformance
- **Volume Tracking** - Handelsvolumen-Übersicht
- **Custom Tooltips** - Detaillierte Informationen bei Hover

### 📅 **PnL Kalender**
- **Tägliche Performance** - Visualisierung der täglichen Gewinne/Verluste
- **Heatmap-Darstellung** - Farbcodierte Intensität der Performance
- **Monatsnavigation** - Einfache Navigation zwischen Monaten
- **Tooltip-Details** - Detaillierte Informationen pro Tag

### ⏱️ **Zeitrahmen-Filter**
- **24 Stunden** - Kurzfristige Performance
- **3 Tage** - Kurzzeittrends
- **7 Tage** - Wöchentliche Analyse
- **1 Monat** - Monatliche Performance
- **1 Jahr** - Langzeittrends
- **Alle Zeit** - Gesamtperformance

### 🔍 **Erweiterte Filter**
- **Market Cap Filter** - Micro, Small, Mid, Large Cap Tokens
- **Pump.fun Only** - Spezifische Pump.fun Token Analyse
- **Haltedauer** - Scalping, Day Trading, Swing Trading, Position Trading
- **Kombinierbare Filter** - Mehrere Filter gleichzeitig anwendbar

### 🎨 **Design & UX**
- **Dunkles Theme** - Professioneller, augenfreundlicher Look
- **Glassmorphism** - Moderne UI mit Blur-Effekten
- **Responsive Design** - Optimiert für Desktop, Tablet und Mobile
- **Animations** - Smooth Transitions und Hover-Effekte
- **Gradient-Effekte** - Visuell ansprechende Farbverläufe

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Build Tool:** Turbopack

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installiert
- npm oder pnpm Package Manager

### Installation

1. **Repository klonen**
```bash
git clone https://github.com/your-username/solana-wallet-analyzer.git
cd solana-wallet-analyzer
```

2. **Dependencies installieren**
```bash
npm install
# oder
pnpm install
```

3. **Development Server starten**
```bash
npm run dev
# oder
pnpm dev
```

4. **App öffnen**
```
http://localhost:3000
```

## 📱 Screenshots

### Dashboard Overview
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Overview)

### Performance Chart
![Performance Chart](https://via.placeholder.com/800x400?text=Performance+Chart)

### PnL Calendar
![PnL Calendar](https://via.placeholder.com/800x400?text=PnL+Calendar)

### Advanced Filters
![Filters](https://via.placeholder.com/800x400?text=Advanced+Filters)

## 🎯 Roadmap

### Phase 1 - Frontend (Aktuell ✅)
- [x] Responsive UI/UX Design
- [x] Dashboard mit Metriken
- [x] Performance Charts
- [x] PnL Kalender
- [x] Erweiterte Filter
- [x] Zeitrahmen-Selektor

### Phase 2 - Backend Integration (Geplant)
- [ ] Solana Wallet Connection
- [ ] Real-time Data APIs
- [ ] Transaction History Import
- [ ] Automated PnL Calculation
- [ ] Database Integration

### Phase 3 - Advanced Features (Zukunft)
- [ ] Portfolio Comparison
- [ ] AI-powered Insights
- [ ] Risk Management Tools
- [ ] Social Trading Features
- [ ] Mobile App

## 💡 Component Structure

```
components/
├── Navigation.tsx          # Hauptnavigation
├── MetricsCard.tsx         # Metriken-Karten
├── TimeFrameSelector.tsx   # Zeitrahmen-Auswahl
├── PerformanceChart.tsx    # Performance-Diagramm
├── AdvancedFilters.tsx     # Erweiterte Filter
└── PnLCalendar.tsx        # PnL-Kalender
```

## 🎨 Design System

### Farben
- **Primary:** Blue (#3b82f6)
- **Success:** Green (#22c55e)
- **Danger:** Red (#ef4444)
- **Warning:** Orange (#f59e0b)
- **Dark:** Various shades of slate

### Typography
- **Primary:** Inter (Google Fonts)
- **Monospace:** JetBrains Mono (Google Fonts)

### Spacing
- **Glass Effect:** `backdrop-blur(12px)`
- **Border Radius:** `rounded-xl` (12px)
- **Shadows:** Custom glow effects

## 📖 Usage Examples

### Basic Metrics Display
```tsx
<MetricsCard
  title="Gesamt PnL"
  value={totalPnL.toLocaleString()}
  prefix="$"
  change={12.5}
  changeType="positive"
  icon={<DollarSign className="w-5 h-5" />}
/>
```

### Performance Chart
```tsx
<PerformanceChart
  data={performanceData}
  timeFrame="7d"
  loading={false}
/>
```

### Filter Integration
```tsx
<AdvancedFilters
  filters={filters}
  onFiltersChange={setFilters}
  onClearFilters={clearFilters}
/>
```

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📄 License

Dieses Projekt ist unter der MIT License lizenziert - siehe [LICENSE](LICENSE) für Details.

## 🙏 Acknowledgments

- [Solana](https://solana.com/) - Blockchain Platform
- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Recharts](https://recharts.org/) - Chart Library
- [Lucide](https://lucide.dev/) - Icon Library

## 📞 Support

Bei Fragen oder Problemen:
- 📧 Email: support@solanalyzer.com
- 💬 Discord: [Join our community](https://discord.gg/solanalyzer)
- 🐦 Twitter: [@SolAnalyzer](https://twitter.com/solanalyzer)

---

**Made with ❤️ for the Solana Community**

*Elevate Your Trading Game* 