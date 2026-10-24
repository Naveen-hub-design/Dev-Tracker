import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchLeaderboard } from '../api/leaderboard';

export function useLeaderboard() {
  const [category, setCategory] = useState('overall');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchLeaderboard(category);
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredRankings = useMemo(() => {
    const list = data?.rankings || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.githubUsername?.toLowerCase().includes(q) ||
        d.leetcodeUsername?.toLowerCase().includes(q) ||
        d.codeforcesUsername?.toLowerCase().includes(q)
    );
  }, [data, searchQuery]);

  return {
    category,
    setCategory,
    data,
    rankings: filteredRankings,
    top3: data?.top3 || [],
    currentUserRank: data?.currentUserRank || null,
    totalDevelopers: data?.totalDevelopers || 0,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    refetch: load,
  };
}
