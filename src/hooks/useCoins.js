import { useQuery } from '@tanstack/react-query'
import { fetchAssetsWithFallback } from '../api/sources/index.js'
import { queryKeys } from '../api/queries.js'
import { TOP_LIMIT } from '../lib/constants.js'

/**
 * Hook React Query pour récupérer le top 250 des cryptomonnaies.
 * Ordre : CoinGecko → CoinCap → Coinpaprika.
 * @param {string} currency
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useCoins(currency = 'usd') {
  return useQuery({
    queryKey: queryKeys.coins(currency, TOP_LIMIT),
    queryFn: () => fetchAssetsWithFallback(currency, TOP_LIMIT),
    refetchInterval: 60 * 1000,
    retry: 1,
  })
}
