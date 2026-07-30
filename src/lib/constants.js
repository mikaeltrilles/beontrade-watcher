// Constantes de configuration de l'application

export const API_BASE_URL = import.meta.env.VITE_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3'
export const DEFAULT_CURRENCY = import.meta.env.VITE_DEFAULT_CURRENCY || 'usd'
export const TOP_LIMIT = Number(import.meta.env.VITE_TOP_LIMIT) || 250

export const CURRENCIES = {
  usd: { code: 'usd', symbol: '$', locale: 'en-US' },
  eur: { code: 'eur', symbol: '€', locale: 'fr-FR' },
}

export const CHART_DURATIONS = [
  { days: 1, label: '1 jour' },
  { days: 3, label: '3 jours' },
  { days: 7, label: '7 jours' },
  { days: 30, label: '1 mois' },
  { days: 91, label: '3 mois' },
  { days: 181, label: '6 mois' },
  { days: 365, label: '1 an' },
  { days: 'max', label: 'Max' },
]
