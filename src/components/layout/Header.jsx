import { useMemo } from 'react'
import { Coins, Globe, TrendingUp } from 'lucide-react'
import { useGlobalData } from '../../hooks/useGlobalData.js'
import { formatCompactCurrency, formatPercent } from '../../lib/formatters.js'
import { Badge } from '../ui/Badge.jsx'

/**
 * En-tête de l'application : logo, infos globales et sélecteur de devise.
 * @param {{ currency: string, onCurrencyChange: (currency: string) => void }} props
 */
export function Header({ currency, onCurrencyChange }) {
  const { data: globalData, isLoading } = useGlobalData()

  const infos = useMemo(() => {
    if (!globalData) return null
    return {
      activeCryptos: globalData.active_cryptocurrencies,
      markets: globalData.markets,
      marketCapChange: globalData.market_cap_change_percentage_24h_usd,
      btcDominance: globalData.market_cap_percentage?.btc,
      ethDominance: globalData.market_cap_percentage?.eth,
      totalVolume: globalData.total_volume?.[currency],
    }
  }, [globalData, currency])

  return (
    <header className="bg-trade-surface border-b border-trade-border">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo et titre */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo.png"
              alt="Beontrade"
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-trade-text tracking-tight">
                Beontrade Watcher
              </h1>
              <p className="text-xs text-trade-muted">Top 250 cryptomonnaies en temps réel</p>
            </div>
          </div>

          {/* Infos globales */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-trade-muted">
              <Coins size={16} />
              <span>
                {isLoading || !infos ? '...' : infos.activeCryptos?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-trade-muted">
              <Globe size={16} />
              <span>
                {isLoading || !infos ? '...' : infos.markets?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-trade-accent" />
              <span className="text-trade-muted">Cap. marché 24h :</span>
              <Badge value={infos?.marketCapChange} />
            </div>
            <div className="flex items-center gap-2 text-trade-muted">
              <span>BTC : {isLoading || !infos ? '...' : `${infos.btcDominance?.toFixed(1)}%`}</span>
              <span>| ETH : {isLoading || !infos ? '...' : `${infos.ethDominance?.toFixed(1)}%`}</span>
            </div>

            {/* Sélecteur de devise */}
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="bg-trade-elevated border border-trade-border text-trade-text text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-trade-accent"
            >
              <option value="usd">USD ($)</option>
              <option value="eur">EUR (€)</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  )
}
