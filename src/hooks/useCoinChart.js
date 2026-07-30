import { useQuery } from '@tanstack/react-query'
import { fetchCoinMarketChart } from '../api/coingecko.js'
import { queryKeys } from '../api/queries.js'

/**
 * Hook React Query pour récupérer le chart d'une crypto.
 * @param {string} coinId
 * @param {string} currency
 * @param {string|number} days
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useCoinChart(coinId, currency = 'usd', days = 30) {
  return useQuery({
    queryKey: queryKeys.coinChart(coinId, currency, days),
    queryFn: () => fetchCoinMarketChart(coinId, currency, days),
    enabled: !!coinId,
    refetchInterval: 60 * 1000,
  })
}
