import { useState } from 'react'
import { Plus } from 'lucide-react'

interface Props {
  onAdd: (value: string) => void
  label: string
  placeholder: string
  maxLength: number
}

export default function QuickAdd({ onAdd, label, placeholder, maxLength }: Props) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const close = () => { setOpen(false); setValue('') }
  const submit = () => {
    const v = value.trim()
    if (v) onAdd(v)
    setValue('')
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted opacity-60 transition hover:bg-raised hover:text-paper hover:opacity-100 group-hover:opacity-100 focus-visible:opacity-100"
      >
        <Plus size={16} /> {label}
      </button>
    )
  }

  return (
    <input
      autoFocus
      value={value}
      maxLength={maxLength}
      placeholder={placeholder}
      onChange={e => setValue(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') submit()
        if (e.key === 'Escape') close()
      }}
      onBlur={() => { submit(); close() }}
      className="w-full rounded-lg border border-teal bg-raised px-3 py-2 text-sm outline-none placeholder:text-muted"
    />
  )
}