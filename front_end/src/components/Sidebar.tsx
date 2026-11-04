import { isOverdue } from '../lib/dates'
import type { Task } from '../types'

interface Props {
  tasks: Task[]
  loading: boolean
}

export default function Sidebar({ tasks, loading }: Props) {
  const total = tasks.length
  const done = tasks.filter(t => t.status === 'done').length
  const inProgress = tasks.filter(t => t.status === 'in_progress').length
  const overdue = tasks.filter(isOverdue).length
  const percent = total ? Math.round((done / total) * 100) : 0

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col gap-8 border-r border-line bg-surface p-5">
      <h1 className="text-lg font-bold tracking-tight">Your board name</h1>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted">Overview</h2>

        {loading ? (
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-raised motion-safe:animate-pulse" />
            <div className="h-1.5 rounded-full bg-raised motion-safe:animate-pulse" />
          </div>
        ) : total === 0 ? (
          <p className="text-sm text-muted">No tasks yet</p>
        ) : (
          <>
            <p className="text-sm">
              <span className="font-bold text-sand">{done}</span> of {total} done
            </p>
            <div
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Tasks completed"
              className="h-1.5 overflow-hidden rounded-full bg-raised"
            >
              <div className="h-full rounded-full bg-sand transition-[width] duration-300" style={{ width: `${percent}%` }} />
            </div>

            <dl className="space-y-1.5 pt-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Open</dt>
                <dd className="font-semibold">{total - done}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">In progress</dt>
                <dd className="font-semibold">{inProgress}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Overdue</dt>
                <dd className={`font-semibold ${overdue > 0 ? 'text-danger' : ''}`}>{overdue}</dd>
              </div>
            </dl>
          </>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted">Team</h2>
        <p className="text-sm text-muted">Team members appear here</p>
      </section>
    </aside>
  )
}