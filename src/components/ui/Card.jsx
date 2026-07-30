/**
 * Carte de statistique pour le dashboard.
 * @param {{ title: string, value: string, icon: React.ReactNode, isLoading?: boolean, children?: React.ReactNode }} props
 */
export function Card({ title, value, icon, isLoading = false, children }) {
  return (
    <div className="bg-trade-surface border border-trade-border rounded-xl p-5 shadow-lg shadow-black/20 transition-transform hover:scale-[1.01]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-trade-muted uppercase tracking-wide">{title}</h3>
        <div className="text-trade-accent">{icon}</div>
      </div>
      {isLoading ? (
        <div className="h-8 w-2/3 bg-trade-elevated rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-trade-text">{value}</p>
      )}
      {children}
    </div>
  )
}
