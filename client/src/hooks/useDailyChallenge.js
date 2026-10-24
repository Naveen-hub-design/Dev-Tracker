import { useState, useEffect, useCallback } from 'react';
import { fetchDailyChallenge, toggleDailySolve } from '../api/dailyChallenge';

export function useDailyChallenge() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDailyChallenge();
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load LeetCode daily challenge');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = useCallback(async (notes = '') => {
    try {
      setToggling(true);
      const res = await toggleDailySolve(notes);
      setData(res);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update daily solve status');
      throw err;
    } finally {
      setToggling(false);
    }
  }, []);

  return {
    problem: data?.problem || null,
    streak: data?.streak || {
      solvedToday: false,
      currentStreak: 0,
      longestStreak: 0,
      totalSolved: 0,
      last14Days: [],
    },
    loading,
    toggling,
    error,
    refetch: load,
    toggleSolve: handleToggle,
  };
}
