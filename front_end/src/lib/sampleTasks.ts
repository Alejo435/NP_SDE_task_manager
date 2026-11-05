import type { Task } from '../types'

type SampleTask = Omit<Task, 'description' | 'created_at'>

 function daysFromNow(n: number) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toLocaleDateString('en-CA')
}

export function buildSampleTasks(): SampleTask[] {
  const samples: Omit<SampleTask, 'id' | 'position'>[] = [
    { title: 'Design onboarding flow', status: 'todo', priority: 'high', due_date: daysFromNow(2), tags: ['Design'] },
    { title: 'Write docs for the task API', status: 'todo', priority: 'low', due_date: daysFromNow(9), tags: ['Docs'] },
    { title: 'Fix drag preview flicker in Safari', status: 'in_progress', priority: 'high', due_date: daysFromNow(-1), tags: ['Bug', 'Frontend'] },
    { title: 'Add keyboard shortcuts', status: 'in_progress', priority: 'normal', due_date: daysFromNow(5), tags: ['Feature'] },
    { title: 'Review row level security policies', status: 'in_review', priority: 'high', due_date: daysFromNow(0), tags: ['Security'] },
    { title: 'Set up Vercel deployment', status: 'done', priority: 'normal', due_date: null, tags: ['Infra'] },
  ]
  return samples.map((s, i) => ({ ...s, id: crypto.randomUUID(), position: (i + 1) * 1000 }))
}