import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../api/profile';
import { refreshCodeforces, fetchMyCodeforces } from '../api/codeforces';

export function useCodeforces() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    if (!user?._id) return;

    setLoading(true);
    setError(null);
    try {
      const profile = await getProfile();
      if (profile.codeforcesData) {
        setData(profile.codeforcesData);
        setLoading(false);
        return;
      }
      if (profile.codeforcesUsername) {
        try {
          const fresh = await refreshCodeforces();
          setData(fresh);
          setLoading(false);
          return;
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch Codeforces data');
        }
      }
      setData(null);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fresh = await refreshCodeforces();
      setData(fresh);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to refresh Codeforces data');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
