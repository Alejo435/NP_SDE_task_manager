interface Props { title: string; color: string; count: number; children?: React.ReactNode }

export default function Column({ title, color, count, children }: Props) {
  return (
    <section className="flex w-72 shrink-0 snap-start flex-col rounded-xl border border-line bg-surface">
      <header className="flex items-center gap-2 px-4 py-3">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="text-sm text-muted">{count}</span>
      </header>
      <div className="flex flex-1 flex-col gap-2 px-3 pb-3 min-h-40">
        {children ?? <p className="m-auto text-sm text-muted">No tasks yet</p>}
      </div>
    </section>
  )
}