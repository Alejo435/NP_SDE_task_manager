import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import { DEFAULT_MEMBERS, MEMBER_COLORS } from '../lib/team'
import type { Member } from '../types'

export function useTeam(enabled: boolean) {
  const [members, setMembers] = useState<Member[]>([])
  const [assignments, setAssignments] = useState<Record<string, string[]>>({}) // taskId -> memberIds
  const [loading, setLoading] = useState(true)
  const started = useRef(false) // StrictMode runs effects twice; don't seed the team twice

  useEffect(() => {
    if (!enabled || started.current) return
    started.current = true

    ;(async () => {
      const [membersRes, assigneesRes] = await Promise.all([
        supabase.from('team_members').select('id, name, color').order('created_at').order('name'),
        supabase.from('task_assignees').select('task_id, member_id'),
      ])
      const error = membersRes.error ?? assigneesRes.error
      if (error) {
        toast.error(`Team didn't load: ${error.message}`)
        setLoading(false)
        return
      }

      let list = membersRes.data as Member[]
      if (list.length === 0) {
        const { data, error } = await supabase.from('team_members').insert(DEFAULT_MEMBERS).select('id, name, color')
        if (error) toast.error(`Default team wasn't created: ${error.message}`)
        else list = data as Member[]
      }

      const map: Record<string, string[]> = {}
      for (const row of assigneesRes.data ?? []) (map[row.task_id] ??= []).push(row.member_id)

      setMembers(list)
      setAssignments(map)
      setLoading(false)
    })()
  }, [enabled])

  const addMember = async (name: string) => {
    const member: Member = {
      id: crypto.randomUUID(),
      name,
      color: MEMBER_COLORS[members.length % MEMBER_COLORS.length],
    }
    setMembers(prev => [...prev, member])
    const { error } = await supabase.from('team_members').insert(member)
    if (error) {
      setMembers(prev => prev.filter(m => m.id !== member.id))
      toast.error(`Member wasn't added: ${error.message}`)
    }
  }

  const toggleAssignee = async (taskId: string, memberId: string) => {
    const current = assignments[taskId] ?? []
    const isAssigned = current.includes(memberId)
    const next = isAssigned ? current.filter(id => id !== memberId) : [...current, memberId]

    setAssignments(prev => ({ ...prev, [taskId]: next }))
    const { error } = isAssigned
      ? await supabase.from('task_assignees').delete().eq('task_id', taskId).eq('member_id', memberId)
      : await supabase.from('task_assignees').insert({ task_id: taskId, member_id: memberId })

    if (error) {
      setAssignments(prev => ({ ...prev, [taskId]: current }))
      toast.error(`Assignment wasn't saved: ${error.message}`)
    }
  }

  const membersFor = (taskId: string) =>
    (assignments[taskId] ?? [])
      .map(id => members.find(m => m.id === id))
      .filter((m): m is Member => m !== undefined)

  return { members, assignments, loading, addMember, toggleAssignee, membersFor }
}