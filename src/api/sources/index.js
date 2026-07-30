import { fetchCoinsMarkets, fetchCoinMarketChart } from '../coingecko.js'
import { fetchCoinCapAssets, fetchCoinCapHistory } from './coincap.js'
import { fetchCoinpaprikaTickers } from './coinpaprika.js'
import { convertFromUsd, getUsdToEurRate } from './exchange.js'
import { TOP_LIMIT } from '../../lib/constants.js'

/**
 * Récupère une URL d'image fiable pour une crypto à partir de son symbole.
 * @param {string} symbol
 * @returns {string}
 */
export function getCoinImage(symbol) {
  return `https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`
}

/**
 * Normalise un ID Coinpaprika (ex: btc-bitcoin) vers un ID de type CoinGecko/CoinCap (bitcoin).
 * @param {string} coinpaprikaId
 * @returns {string}
 */
function normalizeCoinpaprikaId(coinpaprikaId) {
  const parts = coinpaprikaId.split('-')
  return parts.length > 1 ? parts.slice(1).join('-') : coinpaprikaId
}

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
    image: getCoinImage(asset.symbol),
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
    sparkline_in_7d: { price: [] },
    source: 'coincap',
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

  return {
    id: normalizeCoinpaprikaId(ticker.id),
    symbol: ticker.symbol.toLowerCase(),
    name: ticker.name,
    image: getCoinImage(ticker.symbol),
    rank: ticker.rank,
    current_price: convertFromUsd(priceUsd, currency, usdToEurRate),
    market_cap: convertFromUsd(marketCapUsd, currency, usdToEurRate),
    total_volume: convertFromUsd(volumeUsd, currency, usdToEurRate),
    price_change_percentage_24h: usd.percent_change_24h !== undefined ? usd.percent_change_24h : null,
    price_change_percentage_1h_in_currency: usd.percent_change_1h !== undefined ? usd.percent_change_1h : null,
    price_change_percentage_7d_in_currency: usd.percent_change_7d !== undefined ? usd.percent_change_7d : null,
    price_change_percentage_30d_in_currency: usd.percent_change_30d !== undefined ? usd.percent_change_30d : null,
    price_change_percentage_200d_in_currency: null,
    price_change_percentage_1y_in_currency: usd.percent_change_1y !== undefined ? usd.percent_change_1y : null,
    ath_change_percentage: usd.percent_from_price_ath !== undefined ? -Math.abs(usd.percent_from_price_ath) : null,
    sparkline_in_7d: { price: [] },
    source: 'coinpaprika',
  }
}

/**
 * Récupère les cryptomonnaies depuis Coinpaprika avec fallback CoinGecko.
 * CoinGecko est très complet mais souvent rate-limité/CORS en production,
 * donc on privilégie d'abord les sources à limites souples.
 * @param {string} currency
 * @param {number} limit
 * @returns {Promise<{assets: Array, source: string}>}
 */
export async function fetchAssetsWithFallback(currency = 'usd', limit = TOP_LIMIT) {
  const usdToEurRate = currency.toLowerCase() === 'eur' ? await getUsdToEurRate() : null

  // 1. Coinpaprika : limites souples (10 req/s), données complètes
  try {
    const tickers = await fetchCoinpaprikaTickers()
    const topTickers = tickers.slice(0, limit)
    if (topTickers.length > 0) {
      return {
        assets: topTickers.map((ticker) => normalizeCoinpaprikaTicker(ticker, currency, usdToEurRate)),
        source: 'coinpaprika',
      }
    }
  } catch (error) {
    console.warn('Coinpaprika indisponible, tentative avec CoinGecko...', error.message)
  }

  // 2. Fallback CoinGecko (le plus complet)
  try {
    const assets = await fetchCoinsMarkets(currency, limit, 1)
    if (assets.length > 0) {
      return {
        assets: assets.map((asset) => ({ ...asset, source: 'coingecko' })),
        source: 'coingecko',
      }
    }
  } catch (error) {
    console.warn('CoinGecko indisponible, tentative avec CoinCap...', error.message)
  }

  // 3. Fallback final CoinCap
  try {
    const assets = await fetchCoinCapAssets(limit)
    if (assets.length > 0) {
      return {
        assets: assets.map((asset) => normalizeCoinCapAsset(asset, currency, usdToEurRate)),
        source: 'coincap',
      }
    }
  } catch (error) {
    console.warn('CoinCap indisponible...', error.message)
  }

  throw new Error('Aucune source de données disponible. Veuillez réessayer plus tard.')
}

/**
 * Récupère l'historique d'une crypto avec fallback CoinGecko puis CoinCap.
 * @param {string} coinId
 * @param {string} currency
 * @param {string|number} days
 * @param {number|null} usdToEurRate
 * @returns {Promise<Array>}
 */
export async function fetchCoinHistoryWithFallback(coinId, currency = 'usd', days = 30, usdToEurRate = null) {
  // 1. CoinGecko : le plus complet et compatible avec les IDs normalisés
  try {
    const data = await fetchCoinMarketChart(coinId, currency, days)
    if (data.length > 0) return data
  } catch (error) {
    console.warn(`Historique CoinGecko indisponible pour ${coinId}, fallback CoinCap...`, error.message)
  }

  // 2. Fallback CoinCap (prix en USD à convertir si nécessaire)
  try {
    const interval = Number(days) <= 1 ? 'm30' : Number(days) <= 7 ? 'h1' : 'd1'
    const end = Date.now()
    const start = end - Number(days) * 24 * 60 * 60 * 1000
    const history = await fetchCoinCapHistory(coinId, interval, start, end)
    if (history.length > 0) {
      return history.map((point) => ({
        date: new Date(point.time).toLocaleDateString(),
        price: convertFromUsd(parseFloat(point.priceUsd) || 0, currency, usdToEurRate),
      }))
    }
  } catch (error) {
    console.warn(`Historique CoinCap indisponible pour ${coinId}.`, error.message)
  }

  throw new Error(`Impossible de récupérer l'historique pour ${coinId}.`)
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
    markets: 0,
    total_market_cap: { [currency]: totalMarketCap },
    total_volume: { [currency]: totalVolume },
    market_cap_percentage: { btc: totalMarketCap > 0 ? (btcMarketCap / totalMarketCap) * 100 : 0 },
    market_cap_change_percentage_24h_usd: null,
  }
}
