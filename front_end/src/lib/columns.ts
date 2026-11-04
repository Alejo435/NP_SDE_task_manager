// defininf columns colors for front end 

import type { Status } from '../types'

export const COLUMNS: { id: Status; title: string; color: string }[] = [
  { id: 'todo',        title: 'To Do',       color: 'bg-muted' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-teal' },
  { id: 'in_review',   title: 'In Review',   color: 'bg-sand' },
  { id: 'done',        title: 'Done',        color: 'bg-sage' },
]