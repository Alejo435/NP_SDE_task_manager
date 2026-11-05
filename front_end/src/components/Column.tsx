// useDroppable allow column to have dropped cards, SortableContext allows cards for reordering
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { ColumnDef } from "../lib/columns";
import type { Task } from "../types";
import SortableTaskCard from "./SortableTaskCard";
import QuickAdd from "./QuickAdd";

interface Props {
  column: ColumnDef;
  tasks: Task[];
  loading: boolean;
  highlighted: boolean;
  onAdd: (title: string) => void;
  onOpen: (id: string) => void;
}

export default function Column({
  column,
  tasks,
  loading,
  highlighted,
  onAdd,
  onOpen,
}: Props) {
  const { setNodeRef } = useDroppable({ id: column.id });

  // column itself
  return (
    <section
      className={`group flex max-h-full w-[85vw] max-w-72 md:w-72 shrink-0 snap-start flex-col rounded-xl border bg-surface transition-colors ${
        highlighted ? "border-teal" : "border-line"
      }`}
    >
      <header className="flex items-center gap-2 px-4 py-3">
        <span className={`h-2 w-2 rounded-full ${column.color}`} />
        <h2 className="text-sm font-semibold">{column.title}</h2>
        {!loading && <span className="text-sm text-muted">{tasks.length}</span>}
      </header>

      <div
        ref={setNodeRef}
        className="flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto px-3 pb-3"
      >
        {loading ? (
          <>
            <div className="h-16 rounded-lg bg-raised motion-safe:animate-pulse" />
            <div className="h-12 rounded-lg bg-raised motion-safe:animate-pulse" />
          </>
        ) : (
          // tells imports which cars belong to column via their id
          <>
            <SortableContext
              id={column.id}
              items={tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasks.map((t) => (
                <SortableTaskCard
                  key={t.id}
                  task={t}
                  onOpen={() => onOpen(t.id)}
                />
              ))}
            </SortableContext>
            {tasks.length === 0 && !highlighted && (
              <p className="px-2 py-6 text-center text-sm text-muted">
                {column.empty}
              </p>
            )}
            {/* quick add button that appears at bottom */}
            <QuickAdd
              onAdd={onAdd}
              label="Add task"
              placeholder="Task title"
              maxLength={200}
            />
          </>
        )}
      </div>
    </section>
  );
}
