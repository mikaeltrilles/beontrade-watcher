import axios from 'axios'

const coincapApi = axios.create({
  baseURL: 'https://api.coincap.io/v2',
  timeout: 10000,
  headers: { Accept: 'application/json' },
})

/**
 * Récupère le top N des cryptomonnaies depuis CoinCap.
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function fetchCoinCapAssets(limit = 250) {
  const response = await coincapApi.get('/assets', {
    params: { limit },
  })
  return response.data?.data || []
}

/**
 * Récupère l'historique d'une crypto depuis CoinCap.
 * @param {string} id
 * @param {string} interval - m1, m5, m15, m30, h1, h2, h6, h12, d1
 * @param {number} start - timestamp ms (optionnel)
 * @param {number} end - timestamp ms (optionnel)
 * @returns {Promise<Array>}
 */
export async function fetchCoinCapHistory(id, interval = 'd1', start, end) {
  const params = { interval }
  if (start && end) {
    params.start = start
    params.end = end
  }
  const response = await coincapApi.get(`/assets/${id}/history`, { params })
  return response.data?.data || []
}

export default coincapApi
