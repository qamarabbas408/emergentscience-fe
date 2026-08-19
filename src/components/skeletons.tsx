export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-card bg-primary-tint ${className ?? ''}`}
    />
  )
}

export function JournalCardSkeleton() {
  return (
    <article className="flex flex-col gap-5 rounded-card border border-border bg-white p-6 sm:flex-row">
      <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <Skeleton className="h-6 w-64 max-w-full" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1.5 h-4 w-3/4" />
        <Skeleton className="mt-3 h-3 w-1/2" />
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-7 w-14" />
        </div>
      </div>
    </article>
  )
}

export function ArticleCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-card border border-border bg-white">
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="p-6">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-1.5 h-4 w-2/3" />
      </div>
    </article>
  )
}