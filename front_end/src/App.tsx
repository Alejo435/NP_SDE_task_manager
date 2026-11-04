import { useState } from "react";
import { Toaster } from "sonner";
import { useAuth } from "./hooks/useAuth";
import { useTasks } from "./hooks/useTasks";
import Sidebar from "./components/Sidebar";
import Board from "./components/Board";
import ErrorState from "./components/Error";
import TaskPanel from "./components/TaskPanel";

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

  const selected = tasks.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="flex h-screen">
      <Sidebar tasks={tasks} loading={!user || loading} />
      <main className="flex-1 overflow-hidden">
        {authError ? (
          <ErrorState
            title="Guest session didn't start"
            detail={authError}
            onRetry={retry}
          />
        ) : (
          <Board
            tasks={tasks}
            loading={!user || loading}
            error={error}
            onRetry={reload}
            onCreate={createTask}
            onMove={updateTask}
            onOpen={setSelectedId}
          />
        )}
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
  );
}
