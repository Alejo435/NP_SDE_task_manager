import { COLUMNS } from '../lib/columns'
import Column from './Column'

export default function Board() {
  return (
    <div className="flex h-full snap-x gap-4 overflow-x-auto p-6">
      {COLUMNS.map(col => (
        <Column key={col.id} title={col.title} color={col.color} count={0} />
      ))}
    </div>
  )
}