import { useState, useEffect, useCallback } from 'react';
import { fetchDashboard } from '../../../api/dashboard';

export function useDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboard();
      setDashboard(data);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError({ type: 'auth', message: 'Session expired. Please log in again.' });
      } else if (status === 500) {
        setError({ type: 'server', message: 'Server error. Please try again later.' });
      } else if (err.code === 'ERR_NETWORK') {
        setError({ type: 'network', message: 'Unable to connect. Check your internet.' });
      } else {
        setError({ type: 'unknown', message: err.message || 'Failed to load dashboard.' });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { dashboard, loading, error, refetch: load };
}
