import { useState } from "react";
import { Plus } from "lucide-react";

export default function AddTask({ onAdd }: { onAdd: (title: string) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const close = () => {
    setOpen(false);
    setTitle("");
  };
  const submit = () => {
    const t = title.trim();
    if (t) onAdd(t);
    setTitle("");
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted opacity-60 transition hover:bg-raised hover:text-paper group-hover:opacity-100 focus-visible:opacity-100"
      >
        <Plus size={16} /> Add task
      </button>
    );
  }

  return (
    <input
      autoFocus
      value={title}
      maxLength={200}
      placeholder="Task title"
      onChange={(e) => setTitle(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") submit();
        if (e.key === "Escape") close();
      }}
      onBlur={() => {
        submit();
        close();
      }}
      className="w-full rounded-lg border border-teal bg-raised px-3 py-2 text-sm outline-none placeholder:text-muted"
    />
  );
}
