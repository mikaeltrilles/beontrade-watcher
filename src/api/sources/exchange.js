import axios from 'axios'

const DEFAULT_USD_EUR_RATE = 0.92
let cachedRate = null
let lastFetch = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Récupère le taux de change USD → EUR avec cache.
 * Fallback sur DEFAULT_USD_EUR_RATE en cas d'erreur.
 * @returns {Promise<number>}
 */
export async function getUsdToEurRate() {
  const now = Date.now()
  if (cachedRate && now - lastFetch < CACHE_TTL) {
    return cachedRate
  }

  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
      timeout: 5000,
    })
    const rate = response.data?.rates?.EUR
    if (rate) {
      cachedRate = rate
      lastFetch = now
      return rate
    }
  } catch (error) {
    console.warn('Impossible de récupérer le taux EUR/USD, fallback sur valeur par défaut', error)
  }

  return DEFAULT_USD_EUR_RATE
}

/**
 * Convertit un montant USD vers la devise cible.
 * @param {number} usdValue
 * @param {string} currency
 * @param {number} usdToEurRate
 * @returns {number}
 */
export function convertFromUsd(usdValue, currency, usdToEurRate) {
  if (currency.toLowerCase() === 'eur' && usdToEurRate) {
    return usdValue * usdToEurRate
  }
  return usdValue
}
