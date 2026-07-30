import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

// Configuration des colonnes du tableau
export const COLUMNS = [
  { key: 'rank', label: '#', sortable: false, align: 'left' },
  { key: 'name', label: 'Nom', sortable: true, align: 'left' },
  { key: 'current_price', label: 'Prix', sortable: true, align: 'right' },
  { key: 'price_change_percentage_1h_in_currency', label: '1h', sortable: true, align: 'right' },
  { key: 'price_change_percentage_24h', label: '24h', sortable: true, align: 'right' },
  { key: 'price_change_percentage_7d_in_currency', label: '7j', sortable: true, align: 'right' },
  { key: 'price_change_percentage_30d_in_currency', label: '1m', sortable: true, align: 'right' },
  { key: 'price_change_percentage_1y_in_currency', label: '1a', sortable: true, align: 'right' },
  { key: 'ath_change_percentage', label: 'ATH', sortable: true, align: 'right' },
  { key: 'market_cap', label: 'Market Cap', sortable: true, align: 'right' },
  { key: 'total_volume', label: 'Volume', sortable: true, align: 'right' },
]

/**
 * Entête sticky du tableau avec tri dynamique.
 * @param {{ sortKey: string|null, sortDirection: 'asc'|'desc', onSort: (key: string) => void }} props
 */
export function CryptoTableHeader({ sortKey, sortDirection, onSort }) {
  return (
    <thead className="sticky top-0 z-20 bg-trade-elevated">
      <tr className="border-b border-trade-border text-xs uppercase tracking-wider text-trade-muted">
        {COLUMNS.map((column) => {
          const isSorted = sortKey === column.key
          return (
            <th
              key={column.key}
              onClick={() => column.sortable && onSort(column.key)}
              className={`
                py-2 px-2 font-semibold whitespace-nowrap select-none text-[11px]
                ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}
                ${column.sortable ? 'cursor-pointer hover:text-trade-text transition-colors' : ''}
              `}
            >
              <div className={`inline-flex items-center gap-1 ${column.align === 'right' ? 'flex-row-reverse' : ''}`}>
                {column.label}
                {column.sortable && (
                  <span className="text-trade-accent">
                    {isSorted ? (
                      sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                    ) : (
                      <ArrowUpDown size={12} className="opacity-30" />
                    )}
                  </span>
                )}
              </div>
            </th>
          )
        })}
      </tr>
    </thead>
  )
}
