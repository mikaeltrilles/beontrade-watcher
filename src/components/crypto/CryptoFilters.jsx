import { Star, Filter } from 'lucide-react'

/**
 * Filtres du tableau : top N, stablecoins, favoris.
 * @param {{
 *   limit: number,
 *   onLimitChange: (limit: number) => void,
 *   showStable: boolean,
 *   onShowStableChange: (value: boolean) => void,
 *   showFavorites: boolean,
 *   onShowFavoritesChange: (value: boolean) => void,
 * }} props
 */
export function CryptoFilters({
  limit,
  onLimitChange,
  showStable,
  onShowStableChange,
  showFavorites,
  onShowFavoritesChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-trade-surface border border-trade-border rounded-xl p-4">
      {/* Slider top N */}
      <div className="flex items-center gap-3">
        <Filter size={18} className="text-trade-muted" />
        <div className="flex flex-col">
          <label htmlFor="top-range" className="text-xs text-trade-muted mb-1">
            Top {limit} cryptos
          </label>
          <div className="flex items-center gap-2">
            <input
              id="top-range"
              type="range"
              min={10}
              max={250}
              step={10}
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="w-40 accent-trade-accent"
            />
            <input
              type="number"
              min={1}
              max={250}
              value={limit}
              onChange={(e) => onLimitChange(Math.min(250, Math.max(1, Number(e.target.value))))}
              className="w-16 bg-trade-elevated border border-trade-border text-trade-text text-sm rounded px-2 py-1 text-center"
            />
          </div>
        </div>
      </div>

      {/* Filtre stablecoins */}
      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={showStable}
          onChange={(e) => onShowStableChange(e.target.checked)}
          className="w-4 h-4 accent-trade-accent rounded border-trade-border bg-trade-elevated"
        />
        <span className="text-sm text-trade-text">{showStable ? 'Avec stablecoins' : 'Sans stablecoins'}</span>
      </label>

      {/* Filtre favoris */}
      <button
        onClick={() => onShowFavoritesChange(!showFavorites)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
          showFavorites
            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            : 'bg-trade-elevated text-trade-text border border-trade-border hover:bg-trade-border'
        }`}
      >
        <Star size={16} className={showFavorites ? 'fill-yellow-400' : ''} />
        Favoris
      </button>
    </div>
  )
}
