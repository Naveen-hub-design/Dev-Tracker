import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../api/profile';
import { refreshCodeChef, fetchMyCodeChef, fetchCodeChefByUsername } from '../api/codechef';

export function useCodeChef() {
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
      if (profile.codeChefData) {
        setData(profile.codeChefData);
        setLoading(false);
        return;
      }
      if (profile.codeChefUsername) {
        try {
          const fresh = await refreshCodeChef();
          setData(fresh.data || fresh);
          setLoading(false);
          return;
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch CodeChef data');
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
      const fresh = await refreshCodeChef();
      setData(fresh.data || fresh);
      return fresh;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to refresh CodeChef data';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProfile = useCallback(async (customUsername) => {
    if (!customUsername) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCodeChefByUsername(customUsername);
      setData(result.data || result);
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch CodeChef profile';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    fetchProfile,
  };
}
