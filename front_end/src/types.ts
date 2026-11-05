// types used in database task entries 

export type Status = 'todo' | 'in_progress' | 'in_review' | 'done'
export type Priority = 'low' | 'normal' | 'high'

export interface Task {
  id: string
  title: string
  description: string | null
  status: Status
  priority: Priority
  due_date: string | null
  tags: string[]
  position: number
  created_at: string
}

export interface Member {
  id: string
  name: string
  color: string
}