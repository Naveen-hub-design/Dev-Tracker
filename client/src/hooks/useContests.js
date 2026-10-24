import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchUpcomingContests } from '../api/contests';

export function formatDuration(seconds) {
  if (!seconds) return '2 hours';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs} hour${hrs > 1 ? 's' : ''}`;
  return `${mins} mins`;
}

export function getTimeRemaining(targetDate) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true, formatted: 'LIVE NOW' };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  let formatted = '';
  if (days > 0) formatted = `in ${days}d ${hours}h`;
  else if (hours > 0) formatted = `in ${hours}h ${minutes}m`;
  else formatted = `in ${minutes}m ${seconds}s`;

  return { days, hours, minutes, seconds, isLive: false, formatted };
}

export function useContests() {
  const [contests, setContests] = useState([]);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  // Live tick every second for countdowns
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchUpcomingContests(platformFilter);
      setContests(res.contests || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load upcoming contests');
    } finally {
      setLoading(false);
    }
  }, [platformFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const nextContest = useMemo(() => {
    return contests.length > 0 ? contests[0] : null;
  }, [contests]);

  const platformCounts = useMemo(() => {
    const counts = { all: contests.length };
    contests.forEach((c) => {
      counts[c.platform] = (counts[c.platform] || 0) + 1;
    });
    return counts;
  }, [contests]);

  return {
    contests,
    nextContest,
    platformFilter,
    setPlatformFilter,
    platformCounts,
    loading,
    error,
    refetch: load,
    tick,
  };
}
