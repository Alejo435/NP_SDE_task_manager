import { initials } from '../lib/team'
import type { Member } from '../types'

interface Props {
  member: Member
  stacked?: boolean // adds a ring matching the card so overlapping avatars stay distinct
}

export default function Avatar({ member, stacked = false }: Props) {
  return (
    <span
      title={member.name}
      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-ink ${
        stacked ? 'ring-2 ring-raised' : ''
      }`}
      style={{ backgroundColor: member.color }}
    >
      {initials(member.name)}
    </span>
  )
}