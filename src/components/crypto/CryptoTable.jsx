import { useMemo, useState } from 'react'
import { useCoins } from '../../hooks/useCoins.js'
import { useFavorites } from '../../hooks/useFavorites.js'
import { isStableCoin } from '../../lib/stablecoins.js'
import { Skeleton, TableRowSkeleton } from '../ui/Skeleton.jsx'
import { CryptoSearch } from './CryptoSearch.jsx'
import { CryptoFilters } from './CryptoFilters.jsx'
import { CryptoTableHeader, COLUMNS } from './CryptoTableHeader.jsx'
import { CryptoTableRow } from './CryptoTableRow.jsx'

/**
 * Tableau principal des cryptomonnaies avec recherche, tri et filtres.
 * @param {{ currency: string, onSelectCoin: (coin: import('../../types/coin.js').Coin) => void }} props
 */
export function CryptoTable({ currency, onSelectCoin }) {
  const { data: coinsData, isLoading, error } = useCoins(currency)
  const coins = coinsData?.assets || []
  const activeSource = coinsData?.source || 'coingecko'
  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(100)
  const [showStable, setShowStable] = useState(true)
  const [showFavorites, setShowFavorites] = useState(false)
  const [sortKey, setSortKey] = useState('market_cap')
  const [sortDirection, setSortDirection] = useState('desc')

  // Filtre et tri des données
  const filteredCoins = useMemo(() => {
    if (!coins) return []

    let result = coins

    // Recherche par nom ou symbole
    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(
        (coin) =>
          coin.name.toLowerCase().includes(term) ||
          coin.symbol.toLowerCase().includes(term)
      )
    }

    // Filtre stablecoins
    if (!showStable) {
      result = result.filter((coin) => !isStableCoin(coin.symbol))
    }

    // Filtre favoris
    if (showFavorites) {
      result = result.filter((coin) => favorites.includes(coin.id))
    }

    // Tri robuste : les valeurs manquantes (null/undefined) restent toujours en bas,
    // quel que soit le sens du tri, pour ne pas polluer le classement.
    result = [...result].sort((a, b) => {
      const aRaw = a[sortKey]
      const bRaw = b[sortKey]
      const aMissing = aRaw === null || aRaw === undefined
      const bMissing = bRaw === null || bRaw === undefined
      if (aMissing && bMissing) return 0
      if (aMissing) return 1
      if (bMissing) return -1
      if (aRaw < bRaw) return sortDirection === 'asc' ? -1 : 1
      if (aRaw > bRaw) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    // Limite d'affichage
    return result.slice(0, limit)
  }, [coins, search, showStable, showFavorites, favorites, sortKey, sortDirection, limit])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  if (error) {
    return (
      <div className="bg-trade-surface border border-trade-border rounded-xl p-6 text-center">
        <p className="text-trade-down font-medium">Erreur lors du chargement des données.</p>
        <p className="text-sm text-trade-muted mt-2">{error.message}</p>
      </div>
    )
  }

  return (
    <section className="bg-trade-surface border border-trade-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-trade-border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-trade-text">Classement des cryptomonnaies</h2>
            {isLoading && <Skeleton className="h-5 w-24" />}
            {!isLoading && (
              <span className="text-sm text-trade-muted">{filteredCoins.length} résultats</span>
            )}
            {!isLoading && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-trade-elevated text-trade-muted border border-trade-border capitalize">
                Source : {activeSource}
              </span>
            )}
          </div>
          <CryptoSearch value={search} onChange={setSearch} />
        </div>
      </div>

      <div className="p-4">
        <CryptoFilters
          limit={limit}
          onLimitChange={setLimit}
          showStable={showStable}
          onShowStableChange={setShowStable}
          showFavorites={showFavorites}
          onShowFavoritesChange={setShowFavorites}
        />
      </div>

      <div className="overflow-x-auto lg:overflow-visible">
        <table className="w-full lg:min-w-0 min-w-[1100px]">
          <CryptoTableHeader sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
          <tbody className="text-sm">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => <TableRowSkeleton key={index} />)
            ) : filteredCoins.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="py-12 text-center text-trade-muted">
                  Aucune cryptomonnaie ne correspond à votre recherche.
                </td>
              </tr>
            ) : (
              filteredCoins.map((coin, index) => (
                <CryptoTableRow
                  key={coin.id}
                  coin={coin}
                  index={index}
                  currency={currency}
                  isFavorite={isFavorite(coin.id)}
                  onToggleFavorite={() => toggleFavorite(coin.id)}
                  onShowChart={() => onSelectCoin(coin)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
