import { useQuery } from '@tanstack/react-query'
import { fetchAssetsWithFallback, computeGlobalDataFromAssets } from '../api/sources/index.js'
import { queryKeys } from '../api/queries.js'
import { TOP_LIMIT } from '../lib/constants.js'

/**
 * Hook React Query pour récupérer les données globales du marché.
 * CoinGecko étant bloqué/CORS en production, on calcule directement
 * une approximation depuis le top 250 récupéré via les sources alternatives.
 * @param {string} currency
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useGlobalData(currency = 'usd') {
  return useQuery({
    queryKey: queryKeys.global(currency),
    queryFn: async () => {
      const { assets } = await fetchAssetsWithFallback(currency, TOP_LIMIT)
      return computeGlobalDataFromAssets(assets, currency)
    },
    refetchInterval: 60 * 1000,
    retry: 1,
  })
}
