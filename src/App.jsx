import { useState } from 'react'
import { Header } from './components/layout/Header.jsx'
import { Footer } from './components/layout/Footer.jsx'
import { StatsCards } from './components/dashboard/StatsCards.jsx'
import { MarketChart } from './components/dashboard/MarketChart.jsx'
import { CryptoTable } from './components/crypto/CryptoTable.jsx'
import { CryptoDetailChart } from './components/crypto/CryptoDetailChart.jsx'
import { DEFAULT_CURRENCY } from './lib/constants.js'

/**
 * Application principale Beontrade Watcher.
 */
function App() {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY)
  const [selectedCoin, setSelectedCoin] = useState(null)

  return (
    <div className="min-h-screen flex flex-col bg-trade-bg">
      <Header currency={currency} onCurrencyChange={setCurrency} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <StatsCards currency={currency} />
        <MarketChart currency={currency} />
        <CryptoTable currency={currency} onSelectCoin={setSelectedCoin} />
      </main>

      <Footer />

      <CryptoDetailChart
        coin={selectedCoin}
        currency={currency}
        onClose={() => setSelectedCoin(null)}
      />
    </div>
  )
}

export default App
