import { Star, ExternalLink, BarChart3 } from 'lucide-react'
import { Badge } from '../ui/Badge.jsx'
import { formatPrice, formatCompactCurrency } from '../../lib/formatters.js'

/**
 * Ligne du tableau de cryptomonnaies.
 * @param {{
 *   coin: import('../../types/coin.js').Coin,
 *   index: number,
 *   currency: string,
 *   isFavorite: boolean,
 *   onToggleFavorite: () => void,
 *   onShowChart: () => void
 * }} props
 */
export function CryptoTableRow({ coin, index, currency, isFavorite, onToggleFavorite, onShowChart }) {
  const coingeckoUrl = `https://www.coingecko.com/fr/pi%C3%A8ces/${coin.id}`

  return (
    <tr className="border-b border-trade-border hover:bg-trade-elevated/50 transition-colors">
      <td className="py-2 px-2 text-xs text-trade-muted">{index + 1}</td>

      <td className="py-2 px-2 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleFavorite}
            className="text-trade-muted hover:text-yellow-400 transition-colors"
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Star size={16} className={isFavorite ? 'fill-yellow-400 text-yellow-400' : ''} />
          </button>
          <img
            src={coin.image}
            alt={coin.symbol}
            className="h-6 w-6 rounded-full object-contain"
            loading="lazy"
            onError={(e) => {
              // Fallback en cas d'image indisponible : lettre initiale sur fond coloré
              e.target.style.display = 'none'
              const fallback = e.target.nextElementSibling
              if (fallback) fallback.style.display = 'flex'
            }}
          />
          <div
            className="h-6 w-6 rounded-full bg-trade-elevated text-trade-text text-xs font-bold items-center justify-center hidden"
            aria-hidden="true"
          >
            {coin.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-trade-text truncate">{coin.name}</span>
              <a
                href={coingeckoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-trade-muted hover:text-trade-accent transition-colors"
                aria-label="Voir sur CoinGecko"
              >
                <ExternalLink size={14} />
              </a>
              <button
                onClick={onShowChart}
                className="text-trade-muted hover:text-trade-accent transition-colors"
                aria-label="Voir le graphique"
              >
                <BarChart3 size={14} />
              </button>
            </div>
            <span className="text-xs text-trade-muted uppercase">{coin.symbol}</span>
          </div>
        </div>
      </td>

      <td className="py-2 px-2 text-xs text-right font-medium text-trade-text">
        {formatPrice(coin.current_price, currency)}
      </td>

      <td className="py-2 px-2 text-xs text-right">
        <Badge value={coin.price_change_percentage_1h_in_currency} />
      </td>
      <td className="py-2 px-2 text-xs text-right">
        <Badge value={coin.price_change_percentage_24h} />
      </td>
      <td className="py-2 px-2 text-xs text-right">
        <Badge value={coin.price_change_percentage_7d_in_currency} />
      </td>
      <td className="py-2 px-2 text-xs text-right">
        <Badge value={coin.price_change_percentage_30d_in_currency} />
      </td>
      <td className="py-2 px-2 text-xs text-right">
        <Badge value={coin.price_change_percentage_200d_in_currency} />
      </td>
      <td className="py-2 px-2 text-xs text-right">
        <Badge value={coin.price_change_percentage_1y_in_currency} />
      </td>
      <td className="py-2 px-2 text-xs text-right">
        {coin.ath_change_percentage && coin.ath_change_percentage > -2 ? (
          <span className="text-yellow-400 font-semibold">ATH !</span>
        ) : (
          <Badge value={coin.ath_change_percentage} />
        )}
      </td>

      <td className="py-2 px-2 text-xs text-right text-trade-text">
        {formatCompactCurrency(coin.market_cap, currency)}
      </td>
      <td className="py-2 px-2 text-xs text-right text-trade-text">
        {formatCompactCurrency(coin.total_volume, currency)}
      </td>
    </tr>
  )
}
