import type { Task } from '../types'

export type DueTone = 'overdue' | 'soon' | 'later' | 'done'

const DAY = 86_400_000
const fmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })

function parseLocalDate(value: string) {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function daysUntil(value: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((parseLocalDate(value).getTime() - today.getTime()) / DAY)
}

export function dueInfo(dueDate: string, isDone: boolean): { label: string; tone: DueTone } {
  const date = fmt.format(parseLocalDate(dueDate))
  const days = daysUntil(dueDate)
  if (isDone) return { label: date, tone: 'done' }
  if (days < 0) return { label: `Overdue, ${date}`, tone: 'overdue' }
  if (days === 0) return { label: 'Due today', tone: 'soon' }
  if (days === 1) return { label: 'Due tomorrow', tone: 'soon' }
  if (days <= 3) return { label: `Due ${date}`, tone: 'soon' }
  return { label: `Due ${date}`, tone: 'later' }
}

export function isOverdue(task: Task) {
  return task.status !== 'done' && task.due_date !== null && daysUntil(task.due_date) < 0
}