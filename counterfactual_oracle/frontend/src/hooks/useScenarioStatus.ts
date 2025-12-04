import { useQuery } from '@tanstack/react-query'
import { scenariosApi } from '../lib/api'
import { ScenarioStatus } from '../lib/types'

export function useScenarioStatus(scenarioId: string | null, enabled: boolean = true) {
  return useQuery<ScenarioStatus>({
    queryKey: ['scenario-status', scenarioId],
    queryFn: () => scenariosApi.getStatus(scenarioId!),
    enabled: enabled && !!scenarioId,
    refetchInterval: (query) => {
      const data = query.state.data
      // Poll every 2 seconds if still running
      if (data?.status === 'RUNNING' || data?.status === 'PENDING') {
        return 2000
      }
      // Stop polling if completed or failed
      return false
    },
  })
}


