import { createClient } from '@supabase/supabase-js'

console.log('URL:', import.meta.env.VITE_SUPABASE_URL, 'KEY set:', !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
if (!url || !key) throw new Error('Missing environemental variables for Supabase')

export const supabase = createClient(url, key)