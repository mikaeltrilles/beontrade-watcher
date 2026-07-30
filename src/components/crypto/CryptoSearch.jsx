import { Search } from 'lucide-react'

/**
 * Barre de recherche pour filtrer les cryptomonnaies.
 * @param {{ value: string, onChange: (value: string) => void }} props
 */
export function CryptoSearch({ value, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-trade-muted" size={18} />
      <input
        type="text"
        placeholder="Rechercher une crypto (nom, symbole)..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-80 bg-trade-elevated border border-trade-border text-trade-text text-sm rounded-lg pl-10 pr-4 py-2 placeholder:text-trade-muted focus:outline-none focus:ring-2 focus:ring-trade-accent"
      />
    </div>
  )
}
