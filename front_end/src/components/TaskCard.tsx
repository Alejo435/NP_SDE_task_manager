import type { Task } from "../types";

const PRIORITY = {
  high: { label: "High priority", className: "text-sand" },
  low: { label: "Low priority", className: "text-muted" },
  normal: null,
} as const;

export default function TaskCard({
  task,
  overlay = false,
}: {
  task: Task;
  overlay?: boolean;
}) {
  const priority = PRIORITY[task.priority];
  return (
    <article
      className={`rounded-lg border bg-raised p-3 ${
        overlay
          ? "rotate-2 cursor-grabbing border-teal shadow-2xl shadow-black/70"
          : "cursor-grab border-line hover:border-muted/60"
      }`}
    >
      <p className="text-sm font-medium leading-snug">{task.title}</p>
      {priority && (
        <p className={`mt-2 text-xs font-semibold ${priority.className}`}>
          {priority.label}
        </p>
      )}
    </article>
  );
}
