import { useMemo, useState } from "react";
import { Toaster } from "sonner";
import { useAuth } from "./hooks/useAuth";
import { useTasks } from "./hooks/useTasks";
import Sidebar from "./components/Sidebar";
import Board from "./components/Board";
import ErrorState from "./components/Error";
import TaskPanel from "./components/TaskPanel";
import { TeamProvider } from "./context/TeamContext";
import Tag from "./components/Tag";
import { buildTagColors } from "./lib/tags";
import { TagColorsProvider } from "./context/TagColorsContext";

export default function App() {
  const { user, error: authError, retry } = useAuth();
  const {
    tasks,
    loading,
    error,
    reload,
    createTask,
    updateTask,
    deleteTask,
    nextPosition,
  } = useTasks(user !== null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of tasks)
      for (const tag of t.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    return [...counts]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [tasks]);

  const tagColors = useMemo(() => buildTagColors(tasks), [tasks]);
  const filterTag =
    activeTag && tagCounts.some((t) => t.name === activeTag) ? activeTag : null;
  const visibleTasks = filterTag
    ? tasks.filter((t) => t.tags.includes(filterTag))
    : tasks;

  const selected = tasks.find((t) => t.id === selectedId) ?? null;

  return (
    <TeamProvider enabled={user !== null}>
      <TagColorsProvider value={tagColors}>
        <div className="flex h-screen">
          <Sidebar
            tasks={tasks}
            loading={!user || loading}
            tags={tagCounts}
            activeTag={filterTag}
            onSelectTag={setActiveTag}
          />
          <main className="flex flex-1 flex-col overflow-hidden">
            {filterTag && (
              <div className="flex items-center gap-2 border-b border-line px-6 py-2.5 text-sm text-muted">
                Showing tasks tagged <Tag name={filterTag} />
                <button
                  onClick={() => setActiveTag(null)}
                  className="ml-auto hover:text-paper"
                >
                  Clear filter
                </button>
              </div>
            )}
            <div className="min-h-0 flex-1">
              {authError ? (
                <ErrorState
                  title="Guest session didn't start"
                  detail={authError}
                  onRetry={retry}
                />
              ) : (
                <Board
                  tasks={visibleTasks}
                  loading={!user || loading}
                  error={error}
                  onRetry={reload}
                  onCreate={(title, status) =>
                    createTask(title, status, filterTag ? [filterTag] : [])
                  }
                  onMove={updateTask}
                  onOpen={setSelectedId}
                />
              )}
            </div>
          </main>

          {selected && (
            <TaskPanel
              key={selected.id}
              task={selected}
              onClose={() => setSelectedId(null)}
              onUpdate={(patch) => updateTask(selected.id, patch)}
              onStatusChange={(status) => {
                if (status !== selected.status)
                  updateTask(selected.id, {
                    status,
                    position: nextPosition(status),
                  });
              }}
              onDelete={() => {
                deleteTask(selected.id);
                setSelectedId(null);
              }}
              allTags={tagCounts.map((t) => t.name)}
            />
          )}

          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#181915",
                border: "1px solid #2A2B26",
                color: "#EDE7DC",
              },
            }}
          />
        </div>
      </TagColorsProvider>
    </TeamProvider>
  );
}
