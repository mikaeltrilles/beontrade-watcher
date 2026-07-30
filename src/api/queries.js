// Clés et tags utilisés par TanStack Query

export const queryKeys = {
  coins: (currency, limit) => ['coins', currency, limit],
  global: () => ['global'],
  coinChart: (coinId, currency, days) => ['coinChart', coinId, currency, days],
}
