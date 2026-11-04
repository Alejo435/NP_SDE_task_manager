import { Toaster } from 'sonner'
import { useAuth } from './hooks/useAuth'
import { useTasks } from './hooks/useTasks'
import Sidebar from './components/Sidebar'
import Board from './components/Board'
import ErrorState from './components/Error'

export default function App() {
  const { user, error: authError, retry } = useAuth()
  const { tasks, loading, error, reload, createTask, updateTask } = useTasks(user !== null)

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {authError ? (
          <ErrorState title="Guest session didn't start" detail={authError} onRetry={retry} />
        ) : (
          <Board
            tasks={tasks}
            loading={!user || loading}
            error={error}
            onRetry={reload}
            onCreate={createTask}
            onMove={updateTask}
          />
        )}
      </main>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{ style: { background: '#181915', border: '1px solid #2A2B26', color: '#EDE7DC' } }}
      />
    </div>
  )
}