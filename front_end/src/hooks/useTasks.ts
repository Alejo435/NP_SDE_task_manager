import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import type { Status, Task } from '../types'

// subset of a tasks fields except id and created at as those never change
export type TaskPatch = Partial<Omit<Task, 'id' | 'created_at'>>

export function useTasks(enabled: boolean) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // fatches tasks in same position between renders (why tasks are in same place after refresh)
  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.from('tasks').select('*').order('position')
    if (error) setError(error.message)
    else setTasks(data as Task[])
    setLoading(false)
  }, [])

  useEffect(() => { if (enabled) reload() }, [enabled, reload])
  
  const nextPosition = (status: Status) => {
    const column = tasks.filter(t => t.status === status)
    return column.length ? Math.max(...column.map(t => t.position)) + 1000 : 1000
  }

  // places new task at bottom of column. its client id is generated here randomly
  // client generated UUID will never repeat itself, odds are 1 in a billion
  const createTask = async (title: string, status: Status) => {
    const position = nextPosition(status)
    const task: Task = {
      id: crypto.randomUUID(), title, status, position,
      description: null, priority: 'normal', due_date: null, tags: [],
      created_at: new Date().toISOString(),
    }
    setTasks(prev => [...prev, task])
    const { error } = await supabase.from('tasks').insert({ id: task.id, title, status, position })
    if (error) {
      setTasks(prev => prev.filter(t => t.id !== task.id))
      toast.error(`Task wasn't saved: ${error.message}`)
    }
  }

  const updateTask = async (id: string, patch: TaskPatch) => {
    const before = tasks.find(t => t.id === id)
    if (!before) return
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)))
    const { error } = await supabase.from('tasks').update(patch).eq('id', id)
    if (error) {
      setTasks(prev => prev.map(t => (t.id === id ? before : t)))
      toast.error(`Change wasn't saved: ${error.message}`)
    }
  }

  const deleteTask = async (id: string) => {
    const before = tasks.find(t => t.id === id)
    if (!before) return
    setTasks(prev => prev.filter(t => t.id !== id))
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) {
      setTasks(prev => [...prev, before])
      toast.error(`Task wasn't deleted: ${error.message}`)
    }
  }

  return { tasks, loading, error, reload, createTask, updateTask, deleteTask, nextPosition }
}