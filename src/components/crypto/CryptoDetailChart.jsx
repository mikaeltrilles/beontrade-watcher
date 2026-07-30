import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useCoinChart } from '../../hooks/useCoinChart.js'
import { CHART_DURATIONS } from '../../lib/constants.js'
import { formatPrice } from '../../lib/formatters.js'

/**
 * Modal affichant le graphique détaillé d'une crypto.
 * @param {{
 *   coin: import('../../types/coin.js').Coin | null,
 *   currency: string,
 *   onClose: () => void
 * }} props
 */
export function CryptoDetailChart({ coin, currency, onClose }) {
  const [duration, setDuration] = useState(30)

  // Réinitialise la durée à 30 jours quand on change de crypto
  useEffect(() => {
    if (coin) setDuration(30)
  }, [coin?.id])

  const { data: chartData, isLoading } = useCoinChart(coin?.id, currency, duration)

  // Ferme la modal avec la touche Échap
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!coin) return null

  const isPositive = chartData && chartData.length > 0
    ? chartData[chartData.length - 1].price >= chartData[0].price
    : true

  const strokeColor = isPositive ? '#10b981' : '#ef4444'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-trade-surface border border-trade-border rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-trade-border">
          <div className="flex items-center gap-3">
            <img
              src={coin.image}
              alt={coin.symbol}
              className="h-10 w-10 rounded-full object-contain"
            />
            <div>
              <h2 className="text-xl font-bold text-trade-text">{coin.name}</h2>
              <p className="text-sm text-trade-muted">
                {coin.symbol.toUpperCase()} — {formatPrice(coin.current_price, currency)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-trade-muted hover:text-trade-text hover:bg-trade-elevated rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sélecteur de durée */}
        <div className="flex flex-wrap gap-2 p-5 border-b border-trade-border">
          {CHART_DURATIONS.map((item) => (
            <button
              key={item.days}
              onClick={() => setDuration(item.days)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                duration === item.days
                  ? 'bg-trade-accent text-white'
                  : 'bg-trade-elevated text-trade-text hover:bg-trade-border'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Graphique */}
        <div className="p-5">
          {isLoading ? (
            <div className="h-[350px] flex items-center justify-center text-trade-muted">
              <Loader2 className="animate-spin mr-2" size={24} />
              Chargement du graphique...
            </div>
          ) : chartData && chartData.length > 0 ? (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip content={<ChartTooltip currency={currency} />} />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={strokeColor}
                    strokeWidth={2}
                    fill="url(#chartGradient)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-trade-muted">
              Aucune donnée disponible.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ChartTooltip({ active, payload, currency }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-trade-elevated border border-trade-border text-trade-text text-xs rounded-lg p-2 shadow-lg">
        <p className="text-trade-muted">{payload[0].payload.date}</p>
        <p className="font-semibold">{formatPrice(payload[0].value, currency)}</p>
      </div>
    )
  }
  return null
}
