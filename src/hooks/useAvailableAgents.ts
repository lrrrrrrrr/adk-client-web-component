import { useState, useEffect, useCallback } from 'react';
import { ADKApiService } from '../services/adkApi';

interface UseAvailableAgentsOptions {
  apiUrl: string;
  enabled?: boolean;
}

export function useAvailableAgents({ apiUrl, enabled = true }: UseAvailableAgentsOptions) {
  const [agents, setAgents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    if (!enabled || !apiUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      const apiService = new ADKApiService(apiUrl);
      const availableAgents = await apiService.listApps();
      setAgents(availableAgents);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch agents';
      setError(errorMessage);
      console.error('Failed to fetch available agents:', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, enabled]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return {
    agents,
    isLoading,
    error,
    refetch: fetchAgents,
  };
}
