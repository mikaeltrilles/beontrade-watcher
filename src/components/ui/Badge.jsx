import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatPercent } from '../../lib/formatters.js'

/**
 * Badge de variation avec icône et couleur hausse/baisse.
 * @param {{ value: number|null|undefined, className?: string }} props
 */
export function Badge({ value, className = '' }) {
  if (value === undefined || value === null) {
    return (
      <span className={`inline-flex items-center gap-1 text-trade-muted ${className}`}>
        -
      </span>
    )
  }

  const isPositive = value >= 0
  const colorClass = isPositive ? 'text-trade-up' : 'text-trade-down'
  const Icon = isPositive ? TrendingUp : TrendingDown

  return (
    <span className={`inline-flex items-center gap-1 ${colorClass} ${className}`}>
      <Icon size={14} />
      {formatPercent(value)}
    </span>
  )
}
