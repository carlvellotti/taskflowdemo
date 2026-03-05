import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api-client';

export function useTasks(filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryString = Object.entries(filters)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.get(endpoint);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateTask = async (taskId, updates) => {
    const updated = await api.put(`/tasks/${taskId}`, updates);
    setData((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    return updated;
  };

  return { data, loading, error, refetch: fetchData, updateTask };
}
