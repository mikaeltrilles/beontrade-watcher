import axios from 'axios'

const coinpaprikaApi = axios.create({
  baseURL: 'https://api.coinpaprika.com/v1',
  timeout: 15000,
  headers: { Accept: 'application/json' },
})

/**
 * Récupère la liste complète des tickers depuis Coinpaprika.
 * @returns {Promise<Array>}
 */
export async function fetchCoinpaprikaTickers() {
  const response = await coinpaprikaApi.get('/tickers')
  return response.data || []
}

export default coinpaprikaApi
