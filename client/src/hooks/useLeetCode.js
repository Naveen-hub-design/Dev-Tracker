import { useState, useEffect, useCallback } from 'react';
import { fetchLeetCodeProfile } from '../api/leetcode';
import { useAuth } from '../context/AuthContext';
import { getProfile, refreshLeetCode } from '../api/profile';

export function useLeetCode() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const normalizeData = (raw) => {
    if (!raw) return null;
    if (raw.stats) {
      return {
        username: raw.username,
        easy: raw.stats.easy,
        medium: raw.stats.medium,
        hard: raw.stats.hard,
        total: raw.stats.total,
        weeklyProgress: raw.weeklyProgress || [],
        topics: raw.topTopics || raw.topics || [],
      };
    }
    return raw;
  };

  const loadProfile = useCallback(async () => {
    if (!user) return;

    // Try auth profile first
    if (user?._id) {
      setLoading(true);
      try {
        const profile = await getProfile();
        if (profile.leetcodeData) {
          setData(normalizeData(profile.leetcodeData));
          setLoading(false);
          return;
        }
        if (profile.leetcodeUsername) {
          try {
            const fresh = await refreshLeetCode();
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
    }

    setLoading(true);
    setError(null);
    try {
      const result = await fetchLeetCodeProfile(username || user.leetcodeUsername);
      setData(normalizeData(result));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, username]);

  const fetchProfile = useCallback((newUsername) => {
    setUsername(newUsername);
  }, []);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  return { username, data, loading, error, fetchProfile };
}
