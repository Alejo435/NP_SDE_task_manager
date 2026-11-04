import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types";
import TaskCard from "./TaskCard";

export default function SortableTaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`touch-manipulation rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-teal ${isDragging ? "opacity-30" : ""}`}
      {...attributes}
      {...listeners}
    >
      <TaskCard task={task} />
    </div>
  );
}
