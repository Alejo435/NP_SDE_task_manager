import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// StrictMode run by default by react which will create two seperate network requests and there4 two users
// guestPromis ensures a second call does not trigger any duplicate actions 
let guestPromise: Promise<User> | null = null

// reuse existing user session if there is one (why same user comes back to their own page after refresh)
function ensureGuest(): Promise<User> {
  guestPromise ??= (async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) return session.user
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error || !data.user) throw error ?? new Error('No user returned')
    return data.user
  })()
  return guestPromise
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    ensureGuest()
      .then(u => { if (!cancelled) setUser(u) })
      .catch((e: Error) => {
        guestPromise = null // allow retry
        if (!cancelled) setError(e.message)
      })
    return () => { cancelled = true }
  }, [attempt])

  const retry = () => { setError(null); setAttempt(a => a + 1) }
  return { user, error, retry }
}