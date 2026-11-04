// defining column default message and colors for front end 

import type { Status } from '../types'

export interface ColumnDef { id: Status; title: string; color: string; empty: string }

export const COLUMNS: ColumnDef[] = [
  { id: 'todo',        title: 'To Do',       color: 'bg-muted', empty: 'Add a task to get started' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-teal',  empty: 'Drag a task here when work begins' },
  { id: 'in_review',   title: 'In Review',   color: 'bg-sand',  empty: 'Tasks waiting on review show up here' },
  { id: 'done',        title: 'Done',        color: 'bg-sage',  empty: 'Finished tasks land here' },
]

export const isStatus = (id: unknown): id is Status => COLUMNS.some(c => c.id === id)