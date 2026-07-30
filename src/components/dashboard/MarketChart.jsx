import { useMemo } from 'react'
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts'
import { useCoins } from '../../hooks/useCoins.js'
import { isStableCoin } from '../../lib/stablecoins.js'

/**
 * Treemap des 50 premières cryptos colorées par variation 24h.
 * @param {{ currency: string }} props
 */
export function MarketChart({ currency }) {
  const { data: coinsData, isLoading } = useCoins(currency)
  const coins = coinsData?.assets || []

  const data = useMemo(() => {
    if (!coins || coins.length === 0) return []
    return coins
      .slice(0, 50)
      .filter((coin) => !isStableCoin(coin.symbol))
      .map((coin) => {
        const percent = coin.price_change_percentage_24h ?? 0
        return {
          name: `${coin.symbol.toUpperCase()} ${percent.toFixed(1)}%`,
          size: coin.market_cap,
          currentPrice: coin.current_price,
          percent,
          fill: colorPicker(percent),
        }
      })
  }, [coins])

  if (isLoading || data.length === 0) {
    return (
      <div className="bg-trade-surface border border-trade-border rounded-xl p-4 h-[220px] animate-pulse">
        <div className="h-full w-full bg-trade-elevated rounded-lg" />
      </div>
    )
  }

  return (
    <div className="bg-trade-surface border border-trade-border rounded-xl p-4 mb-6">
      <h2 className="text-lg font-semibold text-trade-text mb-4">
        Carte des top 50 cryptomonnaies
      </h2>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey="size"
            stroke="#0b0f19"
            strokeWidth={1}
            ratio={4 / 3}
            isAnimationActive={false}
          >
            <Tooltip content={<TreemapTooltip currency={currency} />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function TreemapTooltip({ active, payload, currency }) {
  if (active && payload && payload.length > 0) {
    const item = payload[0].payload
    return (
      <div className="bg-trade-elevated border border-trade-border text-trade-text text-xs rounded-lg p-2 shadow-lg">
        <p className="font-semibold">{item.name}</p>
        <p className="text-trade-muted">
          Prix : {item.currentPrice.toLocaleString()} {currency.toUpperCase()}
        </p>
      </div>
    )
  }
  return null
}

function colorPicker(number) {
  if (number >= 20) return '#064e3b' // emerald-900
  if (number >= 5) return '#10b981' // emerald-500
  if (number >= 0) return '#34d399' // emerald-400
  if (number >= -5) return '#f87171' // red-400
  if (number >= -20) return '#ef4444' // red-500
  return '#7f1d1d' // red-900
}
