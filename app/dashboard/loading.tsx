export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-full w-full bg-background/50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground animate-pulse">Loading workspace...</p>
      </div>
    </div>
  )
}
