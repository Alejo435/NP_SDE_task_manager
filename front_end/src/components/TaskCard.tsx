import { CalendarDays } from 'lucide-react'
import { dueInfo, type DueTone } from '../lib/dates'
import type { Task } from '../types'

const PRIORITY = {
  high: { label: 'High priority', className: 'text-sand' },
  low: { label: 'Low priority', className: 'text-muted' },
  normal: null,
} as const

const TONE: Record<DueTone, string> = {
  overdue: 'bg-danger/15 text-danger',
  soon: 'bg-sand/15 text-sand',
  later: 'text-muted',
  done: 'text-muted',
}

export default function TaskCard({ task, overlay = false }: { task: Task; overlay?: boolean }) {
  const priority = PRIORITY[task.priority]
  const due = task.due_date ? dueInfo(task.due_date, task.status === 'done') : null

  return (
    <article
      className={`rounded-lg border bg-raised p-3 ${
        overlay
          ? 'rotate-2 cursor-grabbing border-teal shadow-2xl shadow-black/70'
          : 'cursor-grab border-line hover:border-muted/60'
      }`}
    >
      <p className="text-sm font-medium leading-snug">{task.title}</p>

      {(priority || due) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
          {priority && <span className={priority.className}>{priority.label}</span>}
          {due && (
            <span className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${TONE[due.tone]}`}>
              <CalendarDays size={12} /> {due.label}
            </span>
          )}
        </div>
      )}
    </article>
  )
}