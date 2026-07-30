import { CURRENCIES } from './constants.js'

/**
 * Formate un prix selon la devise et la magnitude du nombre.
 * @param {number} value
 * @param {string} currencyCode
 * @returns {string}
 */
export function formatPrice(value, currencyCode = 'usd') {
  if (value === undefined || value === null) return '-'
  const currency = CURRENCIES[currencyCode] || CURRENCIES.usd
  const magnitude = Math.abs(value)

  let fractionDigits = 2
  if (magnitude < 1) fractionDigits = 6
  else if (magnitude < 100) fractionDigits = 4

  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code.toUpperCase(),
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

/**
 * Formate une capitalisation boursière ou un volume en format compact.
 * @param {number} value
 * @param {string} currencyCode
 * @returns {string}
 */
export function formatCompactCurrency(value, currencyCode = 'usd') {
  if (value === undefined || value === null) return '-'
  const currency = CURRENCIES[currencyCode] || CURRENCIES.usd
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code.toUpperCase(),
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Formate un pourcentage avec 2 décimales et le signe +.
 * @param {number|null|undefined} value
 * @returns {string}
 */
export function formatPercent(value) {
  if (value === undefined || value === null) return '-'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/**
 * Formate un grand nombre avec séparateur de milliers.
 * @param {number|null|undefined} value
 * @returns {string}
 */
export function formatNumber(value) {
  if (value === undefined || value === null) return '-'
  return new Intl.NumberFormat('en-US').format(value)
}
