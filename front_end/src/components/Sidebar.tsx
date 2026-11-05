import { isOverdue } from "../lib/dates";
import type { Task } from "../types";
import { useTeamContext } from "../context/TeamContext";
import Avatar from "./Avatar";
import QuickAdd from "./QuickAdd";

interface Props {
  tasks: Task[];
  loading: boolean;
}

export default function Sidebar({ tasks, loading }: Props) {
  const { members, loading: teamLoading, addMember } = useTeamContext();
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const overdue = tasks.filter(isOverdue).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col gap-8 border-r border-line bg-surface p-5">
      <h1 className="text-lg font-bold tracking-tight">Your board name</h1>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted">Team</h2>
        {teamLoading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-6 rounded bg-raised motion-safe:animate-pulse"
              />
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {members.map((m) => (
              <li key={m.id} className="flex items-center gap-2.5 text-sm">
                <Avatar member={m} />
                <span className="truncate">{m.name}</span>
              </li>
            ))}
          </ul>
        )}
        <QuickAdd
          onAdd={addMember}
          label="Add member"
          placeholder="Name"
          maxLength={50}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted">Team</h2>
        <p className="text-sm text-muted">Team members appear here</p>
      </section>
    </aside>
  );
}
