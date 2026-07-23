import { useState, useEffect, useCallback } from 'react';
import { fetchGitHubProfile } from '../api/github';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { getProfile, refreshGitHub } from '../api/profile';

export function useGitHub() {
  const { githubUser } = useUser();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizeData = (raw) => {
    if (!raw) return null;
    if (raw.profile) {
      return {
        username: raw.profile.username,
        avatar: raw.profile.avatar,
        public_repos: raw.profile.public_repos,
        followers: raw.profile.followers,
        totalCommits: raw.totalCommits,
        repos: raw.repos,
        languages: raw.languages,
        commitActivity: raw.commitActivity,
        profile: raw.profile,
      };
    }
    return raw;
  };

  const loadProfile = useCallback(async () => {
    if (user?._id) {
      setLoading(true);
      try {
        const profile = await getProfile();
        if (profile.githubData) {
          setData(normalizeData(profile.githubData));
          setLoading(false);
          return;
        }
        if (profile.githubUsername) {
          try {
            const fresh = await refreshGitHub();
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

    if (!githubUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await fetchGitHubProfile(githubUser);
      setData(normalizeData(result));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [githubUser, user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { data, loading, error, refetch: loadProfile };
}
