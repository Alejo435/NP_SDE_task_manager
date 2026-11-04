import Sidebar from './components/Sidebar'
import Board from './components/Board'

export default function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Board />
      </main>
    </div>
  )
}