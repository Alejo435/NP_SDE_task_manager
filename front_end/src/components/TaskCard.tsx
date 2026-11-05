import { CalendarDays } from "lucide-react";
import { dueInfo, type DueTone } from "../lib/dates";
import type { Task } from "../types";
import { useTeamContext } from "../context/TeamContext";
import Avatar from "./Avatar";

const PRIORITY = {
  high: { label: "High priority", className: "text-sand" },
  low: { label: "Low priority", className: "text-muted" },
  normal: null,
} as const;

const TONE: Record<DueTone, string> = {
  overdue: "bg-danger/15 text-danger",
  soon: "bg-sand/15 text-sand",
  later: "text-muted",
  done: "text-muted",
};

export default function TaskCard({
  task,
  overlay = false,
}: {
  task: Task;
  overlay?: boolean;
}) {
  const priority = PRIORITY[task.priority];
  const due = task.due_date
    ? dueInfo(task.due_date, task.status === "done")
    : null;
  const assignees = useTeamContext().membersFor(task.id);

  return (
    <article
      className={`rounded-lg border bg-raised p-3 ${
        overlay
          ? "rotate-2 cursor-grabbing border-teal shadow-2xl shadow-black/70"
          : "cursor-grab border-line hover:border-muted/60"
      }`}
    >
      <p className="text-sm font-medium leading-snug">{task.title}</p>

      {(priority || due || assignees.length > 0) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
          {priority && (
            <span className={priority.className}>{priority.label}</span>
          )}
          {due && (
            <span
              className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${TONE[due.tone]}`}
            >
              <CalendarDays size={12} /> {due.label}
            </span>
          )}
          {assignees.length > 0 && (
            <div className="ml-auto flex -space-x-1.5">
              {assignees.slice(0, 3).map((m) => (
                <Avatar key={m.id} member={m} stacked />
              ))}
              {assignees.length > 3 && (
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-line text-[10px] text-paper ring-2 ring-raised">
                  +{assignees.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
