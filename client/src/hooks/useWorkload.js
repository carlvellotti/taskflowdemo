import { useApi } from './useApi';

export function useWorkload() {
  const { data, loading, error, refetch } = useApi('/team/workload');
  return { data, loading, error, refetch };
}
