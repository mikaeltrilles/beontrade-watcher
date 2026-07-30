import axios from 'axios'
import { API_BASE_URL } from '../lib/constants.js'

// Instance Axios configurée pour l'API CoinGecko
const coingeckoApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
})

/**
 * Récupère le top N des cryptomonnaies classées par market cap.
 * @param {string} vsCurrency - devise de référence (usd, eur...)
 * @param {number} perPage - nombre de résultats par page
 * @param {number} page - numéro de page
 * @returns {Promise<Array>}
 */
export async function fetchCoinsMarkets(vsCurrency, perPage = 250, page = 1) {
  const response = await coingeckoApi.get('/coins/markets', {
    params: {
      vs_currency: vsCurrency,
      order: 'market_cap_desc',
      per_page: perPage,
      page,
      sparkline: true,
      price_change_percentage: '1h,24h,7d,30d,200d,1y',
    },
  })
  return response.data
}

/**
 * Récupère les données globales du marché.
 * @returns {Promise<Object>}
 */
export async function fetchGlobalData() {
  const response = await coingeckoApi.get('/global')
  return response.data.data
}

/**
 * Récupère les données de chart d'une crypto.
 * @param {string} coinId
 * @param {string} vsCurrency
 * @param {string|number} days
 * @returns {Promise<Array>}
 */
export async function fetchCoinMarketChart(coinId, vsCurrency, days) {
  const params = {
    vs_currency: vsCurrency,
    days,
  }
  if (Number(days) > 32) {
    params.interval = 'daily'
  }

  const response = await coingeckoApi.get(`/coins/${coinId}/market_chart`, { params })
  return response.data.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString(),
    price,
  }))
}

export default coingeckoApi
