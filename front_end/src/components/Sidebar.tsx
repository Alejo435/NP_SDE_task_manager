import { isOverdue } from "../lib/dates";
import type { Task } from "../types";
import { useTeamContext } from "../context/TeamContext";
import { useTagColors } from '../context/TagColorsContext'
import Avatar from "./Avatar";
import QuickAdd from "./QuickAdd";

interface Props {
  tasks: Task[];
  loading: boolean;
  tags: { name: string; count: number }[];
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export default function Sidebar({
  tasks,
  loading,
  tags,
  activeTag,
  onSelectTag,
}: Props) {
  const tagColor = useTagColors()
  const { members, loading: teamLoading, addMember } = useTeamContext();
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const overdue = tasks.filter(isOverdue).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col gap-8 overflow-y-auto border-r border-line bg-surface p-5">
      <h1 className="text-lg font-bold tracking-tight">Team Manager Demo</h1>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted">Overview</h2>

        {loading ? (
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-raised motion-safe:animate-pulse" />
            <div className="h-1.5 rounded-full bg-raised motion-safe:animate-pulse" />
          </div>
        ) : total === 0 ? (
          <p className="text-sm text-muted">No tasks yet</p>
        ) : (
          <>
            <p className="text-sm">
              <span className="font-bold text-sand">{done}</span> of {total}{" "}
              done
            </p>
            <div
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Tasks completed"
              className="h-1.5 overflow-hidden rounded-full bg-raised"
            >
              <div
                className="h-full rounded-full bg-sand transition-[width] duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>

            <dl className="space-y-1.5 pt-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Open</dt>
                <dd className="font-semibold">{total - done}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">In progress</dt>
                <dd className="font-semibold">{inProgress}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Overdue</dt>
                <dd
                  className={`font-semibold ${overdue > 0 ? "text-danger" : ""}`}
                >
                  {overdue}
                </dd>
              </div>
            </dl>
          </>
        )}
      </section>

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

      {tags.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted">Tags</h2>
            {activeTag && (
              <button
                onClick={() => onSelectTag(null)}
                className="text-xs text-muted hover:text-paper"
              >
                Clear
              </button>
            )}
          </div>
          <ul className="space-y-1">
            {tags.map(({ name, count }) => {
              const active = name === activeTag;
              return (
                <li key={name}>
                  <button
                    onClick={() => onSelectTag(active ? null : name)}
                    aria-pressed={active}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition ${
                      active
                        ? "bg-raised text-paper"
                        : "text-muted hover:bg-raised hover:text-paper"
                    }`}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: tagColor(name) }}
                    />
                    <span className="flex-1 truncate text-left">{name}</span>
                    <span className="text-xs">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </aside>
  );
}
