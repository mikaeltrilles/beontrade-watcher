import { fetchCoinsMarkets, fetchCoinMarketChart } from '../coingecko.js'
import { fetchCoinCapAssets, fetchCoinCapHistory } from './coincap.js'
import { fetchCoinpaprikaTickers } from './coinpaprika.js'
import { convertFromUsd, getUsdToEurRate } from './exchange.js'
import { TOP_LIMIT } from '../../lib/constants.js'

/**
 * Normalise un asset CoinCap vers le format interne de l'application.
 * @param {Object} asset
 * @param {string} currency
 * @param {number} usdToEurRate
 * @returns {import('../../types/coin.js').Coin}
 */
function normalizeCoinCapAsset(asset, currency, usdToEurRate) {
  const priceUsd = parseFloat(asset.priceUsd) || 0
  const marketCapUsd = parseFloat(asset.marketCapUsd) || 0
  const volumeUsd = parseFloat(asset.volumeUsd24Hr) || 0
  const change24h = asset.changePercent24Hr ? parseFloat(asset.changePercent24Hr) : null

  return {
    id: asset.id,
    symbol: asset.symbol.toLowerCase(),
    name: asset.name,
    image: `https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`,
    rank: parseInt(asset.rank, 10),
    current_price: convertFromUsd(priceUsd, currency, usdToEurRate),
    market_cap: convertFromUsd(marketCapUsd, currency, usdToEurRate),
    total_volume: convertFromUsd(volumeUsd, currency, usdToEurRate),
    price_change_percentage_24h: change24h,
    price_change_percentage_1h_in_currency: null,
    price_change_percentage_7d_in_currency: null,
    price_change_percentage_30d_in_currency: null,
    price_change_percentage_200d_in_currency: null,
    price_change_percentage_1y_in_currency: null,
    ath_change_percentage: null,
    sparkline_in_7d: { price: [] }, // CoinCap ne fournit pas de sparkline dans cet endpoint
  }
}

/**
 * Normalise un ticker Coinpaprika vers le format interne.
 * @param {Object} ticker
 * @param {string} currency
 * @param {number} usdToEurRate
 * @returns {import('../../types/coin.js').Coin}
 */
function normalizeCoinpaprikaTicker(ticker, currency, usdToEurRate) {
  const usd = ticker.quotes?.USD || {}
  const priceUsd = usd.price || 0
  const marketCapUsd = usd.market_cap || 0
  const volumeUsd = usd.volume_24h || 0
  const change24h = usd.percent_change_24h !== undefined ? usd.percent_change_24h : null

  return {
    id: ticker.id,
    symbol: ticker.symbol.toLowerCase(),
    name: ticker.name,
    image: `https://assets.coincap.io/assets/icons/${ticker.symbol.toLowerCase()}@2x.png`,
    rank: ticker.rank,
    current_price: convertFromUsd(priceUsd, currency, usdToEurRate),
    market_cap: convertFromUsd(marketCapUsd, currency, usdToEurRate),
    total_volume: convertFromUsd(volumeUsd, currency, usdToEurRate),
    price_change_percentage_24h: change24h,
    price_change_percentage_1h_in_currency: null,
    price_change_percentage_7d_in_currency: null,
    price_change_percentage_30d_in_currency: null,
    price_change_percentage_200d_in_currency: null,
    price_change_percentage_1y_in_currency: null,
    ath_change_percentage: null,
    sparkline_in_7d: { price: [] },
  }
}

/**
 * Récupère les cryptomonnaies depuis CoinCap avec fallback Coinpaprika puis CoinGecko.
 * @param {string} currency
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function fetchAssetsWithFallback(currency = 'usd', limit = TOP_LIMIT) {
  const usdToEurRate = currency.toLowerCase() === 'eur' ? await getUsdToEurRate() : null

  // 1. Essai CoinCap (prioritaire)
  try {
    const assets = await fetchCoinCapAssets(limit)
    if (assets.length > 0) {
      const normalized = assets.map((asset) => normalizeCoinCapAsset(asset, currency, usdToEurRate))
      return addGlobalSparklines(normalized)
    }
  } catch (error) {
    console.warn('CoinCap indisponible, tentative avec Coinpaprika...', error.message)
  }

  // 2. Fallback Coinpaprika
  try {
    const tickers = await fetchCoinpaprikaTickers()
    const topTickers = tickers.slice(0, limit)
    if (topTickers.length > 0) {
      const normalized = topTickers.map((ticker) => normalizeCoinpaprikaTicker(ticker, currency, usdToEurRate))
      return addGlobalSparklines(normalized)
    }
  } catch (error) {
    console.warn('Coinpaprika indisponible, tentative avec CoinGecko...', error.message)
  }

  // 3. Fallback final CoinGecko (le plus complet)
  return fetchCoinsMarkets(currency, limit, 1)
}

/**
 * Récupère l'historique d'une crypto avec fallback CoinCap puis CoinGecko.
 * @param {string} coinId
 * @param {string} currency
 * @param {string|number} days
 * @returns {Promise<Array>}
 */
export async function fetchCoinHistoryWithFallback(coinId, currency = 'usd', days = 30) {
  // 1. Essai CoinCap
  try {
    const interval = Number(days) <= 1 ? 'm30' : Number(days) <= 7 ? 'h1' : 'd1'
    const end = Date.now()
    const start = end - Number(days) * 24 * 60 * 60 * 1000
    const history = await fetchCoinCapHistory(coinId, interval, start, end)
    if (history.length > 0) {
      return history.map((point) => ({
        date: new Date(point.time).toLocaleDateString(),
        price: parseFloat(point.priceUsd) || 0,
      }))
    }
  } catch (error) {
    console.warn(`Historique CoinCap indisponible pour ${coinId}, fallback CoinGecko...`, error.message)
  }

  // 2. Fallback CoinGecko
  return fetchCoinMarketChart(coinId, currency, days)
}

/**
 * Génère un sparkline 7 jours approximatif à partir de l'historique disponible.
 * Pour CoinCap : remplit via /history?interval=d1 sur les 7 derniers jours.
 * Cette fonction est coûteuse (250 appels) donc on retourne un tableau vide par défaut
 * et on laisse le composant gérer l'absence de sparkline.
 * @param {Array} assets
 * @returns {Array}
 */
function addGlobalSparklines(assets) {
  // CoinCap et Coinpaprika ne fournissent pas de sparkline dans l'endpoint liste.
  // Pour éviter 250 requêtes supplémentaires, on retourne les assets sans sparkline.
  return assets
}

/**
 * Calcule des données globales approximées à partir du top 250.
 * @param {Array} assets
 * @param {string} currency
 * @returns {Object}
 */
export function computeGlobalDataFromAssets(assets, currency = 'usd') {
  let totalMarketCap = 0
  let totalVolume = 0
  let btcMarketCap = 0

  for (const asset of assets) {
    totalMarketCap += asset.market_cap || 0
    totalVolume += asset.total_volume || 0
    if (asset.symbol === 'btc') {
      btcMarketCap = asset.market_cap || 0
    }
  }

  return {
    active_cryptocurrencies: assets.length,
    markets: 0, // Non disponible sans API globale
    total_market_cap: { [currency]: totalMarketCap },
    total_volume: { [currency]: totalVolume },
    market_cap_percentage: { btc: totalMarketCap > 0 ? (btcMarketCap / totalMarketCap) * 100 : 0 },
    market_cap_change_percentage_24h_usd: null,
  }
}
