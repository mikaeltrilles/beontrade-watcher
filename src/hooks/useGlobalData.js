import { useQuery } from '@tanstack/react-query'
import { fetchGlobalData } from '../api/coingecko.js'
import { queryKeys } from '../api/queries.js'

/**
 * Hook React Query pour récupérer les données globales du marché.
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useGlobalData() {
  return useQuery({
    queryKey: queryKeys.global(),
    queryFn: fetchGlobalData,
    refetchInterval: 60 * 1000,
  })
}
