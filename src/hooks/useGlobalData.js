import { useQuery } from '@tanstack/react-query'
import { fetchGlobalData } from '../api/coingecko.js'
import { fetchAssetsWithFallback, computeGlobalDataFromAssets } from '../api/sources/index.js'
import { queryKeys } from '../api/queries.js'
import { TOP_LIMIT } from '../lib/constants.js'

/**
 * Hook React Query pour récupérer les données globales du marché.
 * Essaie d'abord CoinGecko, puis calcule une approximation depuis le top 250.
 * @param {string} currency
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useGlobalData(currency = 'usd') {
  return useQuery({
    queryKey: queryKeys.global(),
    queryFn: async () => {
      try {
        return await fetchGlobalData()
      } catch (error) {
        console.warn('CoinGecko global indisponible, approximation depuis CoinCap...', error.message)
        const assets = await fetchAssetsWithFallback(currency, TOP_LIMIT)
        return computeGlobalDataFromAssets(assets, currency)
      }
    },
    refetchInterval: 60 * 1000,
    retry: 1,
  })
}
