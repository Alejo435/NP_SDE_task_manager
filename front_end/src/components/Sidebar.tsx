export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col gap-8 border-r border-line bg-surface p-5">
      <h1 className="text-lg font-bold tracking-tight">Task Tracker</h1>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted">Overview</h2>
        <p className="text-sm text-muted">TODO: Stats</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted">Team</h2>
        <p className="text-sm text-muted">TODO: Include list of members</p>
      </section>
    </aside>
  )
}