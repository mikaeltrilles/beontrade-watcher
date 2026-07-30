import { useQuery } from '@tanstack/react-query'
import { fetchCoinsMarkets } from '../api/coingecko.js'
import { queryKeys } from '../api/queries.js'
import { TOP_LIMIT } from '../lib/constants.js'

/**
 * Hook React Query pour récupérer le top 250 des cryptomonnaies.
 * @param {string} currency
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useCoins(currency = 'usd') {
  return useQuery({
    queryKey: queryKeys.coins(currency, TOP_LIMIT),
    queryFn: () => fetchCoinsMarkets(currency, TOP_LIMIT, 1),
    refetchInterval: 60 * 1000,
  })
}
