import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, refreshHackerRank } from '../api/profile';

export function useHackerRank() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizeData = (raw) => {
    if (!raw) return null;
    return {
      username: raw.username || '',
      name: raw.name || '',
      avatar: raw.avatar || '',
      country: raw.country || '',
      followers: raw.followers || 0,
      memberSince: raw.memberSince || '',
      lastActive: raw.lastActive || '',
      hackerRank: raw.hackerRank || 0,
      hackerBadge: raw.hackerBadge || 'None',
      totalSolved: raw.totalSolved || 0,
      problemsSolved: raw.problemsSolved || { easy: 0, medium: 0, hard: 0, total: 0 },
      languages: raw.languages || raw.languageStats || [],
      badges: raw.badges || [],
    };
  };

  const loadProfile = useCallback(async () => {
    if (!user?._id) return;

    setLoading(true);
    setError(null);
    try {
      const profile = await getProfile();
      if (profile.hackerRankData) {
        setData(normalizeData(profile.hackerRankData));
        setLoading(false);
        return;
      }
      if (profile.hackerRankUsername) {
        try {
          const fresh = await refreshHackerRank();
          setData(normalizeData(fresh));
          setLoading(false);
          return;
        } catch {
          // fall through
        }
      }
    } catch {
      // fall through
    }
    setData(null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const refetch = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  return { data, loading, error, refetch };
}
