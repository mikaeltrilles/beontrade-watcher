import axios from 'axios'

const coincodexApi = axios.create({
  baseURL: 'https://coincodex.com/api/v1',
  timeout: 20000,
  headers: { Accept: 'application/json' },
})

/**
 * Mapping des périodes du site vers les clés de l'API CoinCodex.
 */
const PERIOD_TO_KEY = {
  1: '1D',
  3: '7D', // pas de clé native 3D, on filtre la période 7D côté client
  7: '7D',
  30: '30D',
  90: '3M',
  365: '1Y',
  max: 'ALL',
}

/**
 * Récupère les données de graphique pour un ou plusieurs actifs depuis CoinCodex.
 * @param {string|Array<string>} assetIds - symbole(s) majuscule(s) (ex: BTC, ETH)
 * @param {string|number} days - 1, 3, 7, 30, 90, 365 ou 'max'
 * @param {string} currency - non utilisé (CoinCodex retourne toujours USD)
 * @param {number|null} usdToEurRate - taux de conversion si nécessaire
 * @returns {Promise<Array>} - [{date, price}, ...]
 */
export async function fetchCoincodexHistory(assetIds, days = 30, currency = 'usd', usdToEurRate = null) {
  const ids = Array.isArray(assetIds) ? assetIds : [assetIds]
  const periodKey = PERIOD_TO_KEY[days] || PERIOD_TO_KEY[30]

  const response = await coincodexApi.get('/assets/get_charts', {
    params: {
      assets: ids.join(','),
      charts: periodKey,
      samples: 'sm',
    },
  })

  const data = response.data || {}
  const id = ids[0]
  const series = data[id]?.[periodKey] || []

  if (!Array.isArray(series) || series.length === 0) {
    throw new Error(`Aucune donnée CoinCodex pour ${id} (${days}j)`)
  }

  const now = Date.now()
  const maxAge = Number(days) * 24 * 60 * 60 * 1000

  return series
    .filter(([timestamp, priceUsd]) => {
      if (priceUsd === null || priceUsd === undefined) return false
      // Pour le pseudo-3j on filtre depuis 3 jours
      const limit = days === 3 ? 3 * 24 * 60 * 60 * 1000 : maxAge
      return now - timestamp * 1000 <= limit || days === 'max'
    })
    .map(([timestamp, priceUsd]) => ({
      date: new Date(timestamp * 1000).toLocaleDateString(),
      price: convertUsd(priceUsd, currency, usdToEurRate),
    }))
}

/**
 * Récupère en une seule requête les séries 30D et 1Y pour plusieurs symboles.
 * Utilisé pour enrichir les variations mensuelle et annuelle du tableau.
 * @param {Array<string>} symbols - symboles majuscules (ex: ['BTC','ETH'])
 * @param {string} currency
 * @param {number|null} usdToEurRate
 * @returns {Promise<Object>} - { BTC: { '30D': [...], '1Y': [...] }, ... }
 */
export async function fetchCoincodexMultiCharts(symbols, currency = 'usd', usdToEurRate = null) {
  if (!symbols.length) return {}

  const response = await coincodexApi.get('/assets/get_charts', {
    params: {
      assets: symbols.join(','),
      charts: '30D,1Y',
      samples: 'sm',
    },
  })

  return response.data || {}
}

/**
 * Calcule la variation en pourcentage entre le premier et le dernier prix valide
 * d'une série CoinCodex.
 * @param {Array} series - [[timestamp, price], ...]
 * @returns {number|null}
 */
export function computeCoincodexPercentChange(series) {
  const clean = (series || []).filter(([, price]) => price !== null && price !== undefined)
  if (clean.length < 2) return null
  const first = Number(clean[0][1])
  const last = Number(clean[clean.length - 1][1])
  if (!first) return null
  return ((last - first) / first) * 100
}

function convertUsd(priceUsd, currency, usdToEurRate) {
  const value = Number(priceUsd) || 0
  if (currency.toLowerCase() === 'eur' && usdToEurRate) {
    return value * usdToEurRate
  }
  return value
}

export default coincodexApi
