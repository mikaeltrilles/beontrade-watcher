import { useMemo } from 'react'
import { BarChart3, DollarSign, Activity, Bitcoin } from 'lucide-react'
import { useGlobalData } from '../../hooks/useGlobalData.js'
import { Card } from '../ui/Card.jsx'
import { formatCompactCurrency, formatPercent } from '../../lib/formatters.js'

/**
 * Cartes de statistiques globales du marché crypto.
 * @param {{ currency: string }} props
 */
export function StatsCards({ currency }) {
  const { data: globalData, isLoading } = useGlobalData()

  const stats = useMemo(() => {
    if (!globalData) return null
    return {
      marketCap: globalData.total_market_cap?.[currency],
      volume: globalData.total_volume?.[currency],
      btcDominance: globalData.market_cap_percentage?.btc,
      marketCapChange: globalData.market_cap_change_percentage_24h_usd,
    }
  }, [globalData, currency])

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card
        title="Market Cap total"
        value={stats ? formatCompactCurrency(stats.marketCap, currency) : '-'}
        icon={<BarChart3 size={20} />}
        isLoading={isLoading}
      >
        {stats && (
          <span className={`text-xs ${stats.marketCapChange >= 0 ? 'text-trade-up' : 'text-trade-down'}`}>
            {formatPercent(stats.marketCapChange)} / 24h
          </span>
        )}
      </Card>

      <Card
        title="Volume 24h"
        value={stats ? formatCompactCurrency(stats.volume, currency) : '-'}
        icon={<Activity size={20} />}
        isLoading={isLoading}
      />

      <Card
        title="Dominance BTC"
        value={stats ? `${stats.btcDominance?.toFixed(1)}%` : '-'}
        icon={<Bitcoin size={20} />}
        isLoading={isLoading}
      />

      <Card
        title="Devise"
        value={currency.toUpperCase()}
        icon={<DollarSign size={20} />}
        isLoading={false}
      >
        <span className="text-xs text-trade-muted">Référence de cotation</span>
      </Card>
    </section>
  )
}
