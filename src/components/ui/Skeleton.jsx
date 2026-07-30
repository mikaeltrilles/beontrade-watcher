/**
 * Skeleton loader rectangulaire.
 * @param {{ className?: string }} props
 */
export function Skeleton({ className = '' }) {
  return (
    <div className={`bg-trade-elevated rounded animate-pulse ${className}`} />
  )
}

/**
 * Ligne de skeleton pour le tableau.
 */
export function TableRowSkeleton() {
  return (
    <tr className="border-b border-trade-border">
      <td className="py-3 px-4"><Skeleton className="h-4 w-8" /></td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </td>
      <td className="py-3 px-4"><Skeleton className="h-4 w-20 ml-auto" /></td>
      <td className="py-3 px-4"><Skeleton className="h-4 w-16 ml-auto" /></td>
      <td className="py-3 px-4"><Skeleton className="h-4 w-16 ml-auto" /></td>
      <td className="py-3 px-4"><Skeleton className="h-4 w-20 ml-auto" /></td>
      <td className="py-3 px-4"><Skeleton className="h-4 w-24 ml-auto" /></td>
    </tr>
  )
}
