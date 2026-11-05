import { X } from 'lucide-react'
import { useTagColors } from '../context/TagColorsContext'

export default function Tag({ name, onRemove }: { name: string; onRemove?: () => void }) {
  const color = useTagColors()(name)
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold"
      style={{ color, backgroundColor: `${color}26` }} 
    >
      {name}
      {onRemove && (
        <button onClick={onRemove} aria-label={`Remove tag ${name}`} className="opacity-70 hover:opacity-100">
          <X size={12} />
        </button>
      )}
    </span>
  )
}