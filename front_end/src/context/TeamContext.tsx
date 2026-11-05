import { createContext, useContext, type ReactNode } from 'react'
import { useTeam } from '../hooks/useTeam'

type TeamValue = ReturnType<typeof useTeam>

const TeamContext = createContext<TeamValue | null>(null)

export function TeamProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const team = useTeam(enabled)
  return <TeamContext.Provider value={team}>{children}</TeamContext.Provider>
}

export function useTeamContext() {
  const ctx = useContext(TeamContext)
  if (!ctx) throw new Error('useTeamContext must be used inside TeamProvider')
  return ctx
}