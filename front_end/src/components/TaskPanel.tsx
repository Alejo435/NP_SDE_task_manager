import { useEffect, useState, type ReactNode } from 'react'
import { Trash2, X } from 'lucide-react'
import { COLUMNS } from '../lib/columns'
import type { TaskPatch } from '../hooks/useTasks'
import type { Priority, Status, Task } from '../types'
import { useTeamContext } from '../context/TeamContext'
import Avatar from './Avatar'

interface Props {
  task: Task
  onClose: () => void
  onUpdate: (patch: TaskPatch) => void
  onStatusChange: (status: Status) => void
  onDelete: () => void
}

const PRIORITIES: { id: Priority; label: string }[] = [
  { id: 'low', label: 'Low' },
  { id: 'normal', label: 'Normal' },
  { id: 'high', label: 'High' },
]

const inputClass = 'w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-teal'

export default function TaskPanel({ task, onClose, onUpdate, onStatusChange, onDelete }: Props) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)
const { members, assignments, toggleAssignee } = useTeamContext()
  const assigned = assignments[task.id] ?? []

  const saveTitle = () => {
    const t = title.trim()
    if (!t) return setTitle(task.title) 
    if (t !== task.title) onUpdate({ title: t })
  }

  const saveDescription = () => {
    const d = description.trim()
    if (d !== (task.description ?? '')) onUpdate({ description: d || null })
  }

  // save unsaved text before closing
  const close = () => {
    saveTitle()
    saveDescription()
    onClose()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={close} />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-title"
        className="relative flex h-full w-full max-w-md flex-col gap-6 overflow-y-auto border-l border-line bg-surface p-6 motion-safe:animate-slide-in"
      >
        <div className="flex items-start gap-3">
          <textarea
            id="task-title"
            value={title}
            rows={2}
            maxLength={200}
            onChange={e => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.currentTarget.blur()
              }
            }}
            className="flex-1 resize-none bg-transparent text-xl font-bold leading-snug outline-none"
          />
          <button onClick={close} aria-label="Close" className="rounded-lg p-1.5 text-muted hover:bg-raised hover:text-paper">
            <X size={18} />
          </button>
        </div>

        <Field label="Status">
          <select
            aria-label="Status"
            value={task.status}
            onChange={e => onStatusChange(e.target.value as Status)}
            className={inputClass}
          >
            {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </Field>

        <Field label="Priority">
          <div className="flex gap-1 rounded-lg border border-line bg-ink p-1">
            {PRIORITIES.map(p => (
              <button
                key={p.id}
                onClick={() => onUpdate({ priority: p.id })}
                aria-pressed={task.priority === p.id}
                className={`flex-1 rounded-md py-1.5 text-sm font-medium transition ${
                  task.priority === p.id ? 'bg-teal text-ink' : 'text-muted hover:text-paper'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Due date">
          <input
            type="date"
            aria-label="Due date"
            value={task.due_date ?? ''}
            onChange={e => onUpdate({ due_date: e.target.value || null })}
            className={inputClass}
          />
        </Field>

                <Field label="Assignees">
          <div className="flex flex-wrap gap-2">
            {members.map(m => {
              const on = assigned.includes(m.id)
              return (
                <button
                  key={m.id}
                  onClick={() => toggleAssignee(task.id, m.id)}
                  aria-pressed={on}
                  className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm transition ${
                    on ? 'border-teal bg-teal/15 text-paper' : 'border-line text-muted hover:text-paper'
                  }`}
                >
                  <Avatar member={m} />
                  {m.name.split(' ')[0]}
                </button>
              )
            })}
          </div>
        </Field>

        {/* Tags are added here in the next block */}

        <Field label="Description">
          <textarea
            aria-label="Description"
            value={description}
            rows={6}
            placeholder="Add details, links, or acceptance criteria"
            onChange={e => setDescription(e.target.value)}
            onBlur={saveDescription}
            className={`${inputClass} resize-y`}
          />
        </Field>


        <div className="mt-auto border-t border-line pt-4">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="flex-1 text-sm text-muted">Delete this task permanently?</span>
              <button onClick={() => setConfirmDelete(false)} className="rounded-lg px-3 py-1.5 text-sm text-muted hover:text-paper">
                Cancel
              </button>
              <button onClick={onDelete} className="rounded-lg bg-danger px-3 py-1.5 text-sm font-semibold text-ink">
                Delete
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 text-sm text-muted hover:text-danger">
              <Trash2 size={16} /> Delete task
            </button>
          )}
        </div>
      </aside>
    </div>
  )
}


function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-muted">{label}</span>
      {children}
    </div>
  )
}