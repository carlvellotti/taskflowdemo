import { useApi } from './useApi';

export function useTeam() {
  return useApi('/team');
}
