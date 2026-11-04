import { useEffect, useRef, useState } from 'react'
import { supabase } from './lib/supabase'

export default function App() {
  const [log, setLog] = useState<string[]>(['Loading...'])
  const ran = useRef(false) // StrictMode runs effects twice in dev; avoid two sign-ins

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    ;(async () => {
      let { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) return setLog([`Auth error: ${error.message}`])
        session = data.session
      }
      const { data, error } = await supabase.from('tasks').select('title')
      setLog([
        `User: ${session!.user.id}`,
        error ? `Error: ${error.message}` : `Tasks: ${data.map(t => t.title).join(', ') || '(none)'}`,
      ])
    })()
  }, [])

  const addTask = async () => {
    const { error } = await supabase.from('tasks').insert({ title: `Test ${new Date().toLocaleTimeString()}` })
    if (error) alert(error.message)
    else location.reload()
  }

  return (
    <div className="p-8 space-y-2">
      {log.map(line => <p key={line}>{line}</p>)}
      <button onClick={addTask} className="px-3 py-1 rounded bg-blue-500 text-white">Add test task</button>
    </div>
  )
}