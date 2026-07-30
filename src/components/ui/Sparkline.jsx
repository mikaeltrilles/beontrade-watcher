import { useMemo } from 'react'
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts'

/**
 * Mini graphique sparkline pour le tableau.
 * @param {{ data: number[], height?: number }} props
 */
export function Sparkline({ data, height = 36 }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    return data.map((price, index) => ({ index, price }))
  }, [data])

  if (chartData.length === 0) {
    return (
      <div
        style={{ height }}
        className="w-full bg-trade-elevated/50 rounded border border-trade-border/50"
        title="Sparkline non disponible avec cette source"
      />
    )
  }

  const isPositive = chartData[chartData.length - 1].price >= chartData[0].price
  const strokeColor = isPositive ? '#10b981' : '#ef4444'

  return (
    <div style={{ height }} className="w-full min-w-[80px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <YAxis domain={['auto', 'auto']} hide />
          <Line
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
