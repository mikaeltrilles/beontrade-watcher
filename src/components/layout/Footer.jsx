import { ArrowUp } from 'lucide-react'

/**
 * Pied de page avec bouton retour en haut.
 */
export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="mt-auto bg-trade-surface border-t border-trade-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-trade-muted">
          Beontrade Watcher — Données fournies par CoinGecko
        </p>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-4 py-2 bg-trade-elevated hover:bg-trade-border text-trade-text text-sm rounded-lg transition-colors"
          aria-label="Retour en haut de page"
        >
          <ArrowUp size={16} />
          Haut de page
        </button>
      </div>
    </footer>
  )
}
