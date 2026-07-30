import { useQuery } from '@tanstack/react-query'
import { fetchCoinHistoryWithFallback } from '../api/sources/index.js'
import { getUsdToEurRate } from '../api/sources/exchange.js'
import { queryKeys } from '../api/queries.js'

/**
 * Hook React Query pour récupérer le chart d'une crypto.
 * Source principale CoinCodex (pas de CORS/rate-limit), fallback CoinGecko.
 * @param {string} coinId - identifiant interne (ex: bitcoin)
 * @param {string} coinSymbol - symbole pour CoinCodex (ex: BTC)
 * @param {string} currency
 * @param {string|number} days
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useCoinChart(coinId, coinSymbol, currency = 'usd', days = 30) {
  return useQuery({
    queryKey: queryKeys.coinChart(coinId, currency, days),
    queryFn: async () => {
      const usdToEurRate = currency.toLowerCase() === 'eur' ? await getUsdToEurRate() : null
      return fetchCoinHistoryWithFallback(coinId, currency, days, usdToEurRate, { [coinId]: coinSymbol })
    },
    enabled: !!coinId,
    refetchInterval: 60 * 1000,
    retry: 1,
  })
}
