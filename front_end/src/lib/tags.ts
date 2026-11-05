import { MEMBER_COLORS } from './team'
import type { Task } from '../types'

export const MAX_TAGS = 10 // matches the database check constraint
export const MAX_TAG_LENGTH = 24

// give each of the first 6 tags tag a color in the order 
export function buildTagColors(tasks: Task[]): Record<string, string> {
  const colors: Record<string, string> = {}
  let next = 0
  const oldestFirst = [...tasks].sort((a, b) => a.created_at.localeCompare(b.created_at))
  for (const task of oldestFirst) {
    for (const tag of task.tags) {
      if (!(tag in colors)) colors[tag] = MEMBER_COLORS[next++ % MEMBER_COLORS.length]
    }
  }
  return colors
}