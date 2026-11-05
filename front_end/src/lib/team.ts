export const MEMBER_COLORS = ['#3587A4', '#F3C178', '#86B38A', '#9D8CD6', '#E0937A', '#7EC4CF']

export const DEFAULT_MEMBERS = [
  { name: 'Alex', color: MEMBER_COLORS[0] },
  { name: 'Bob', color: MEMBER_COLORS[1] },
  { name: 'Charles', color: MEMBER_COLORS[2] },
  { name: 'Dan', color: MEMBER_COLORS[3] },
]

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()
}