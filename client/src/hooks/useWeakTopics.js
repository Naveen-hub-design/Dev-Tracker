import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchWeakTopicRecommendations } from '../api/weakTopics';

const PRACTICED_KEY = 'devtrack_practiced_dsa_problems';

export function useWeakTopics(username = '') {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const [practicedMap, setPracticedMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PRACTICED_KEY) || '{}');
    } catch {
      return {};
    }
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeakTopicRecommendations(username);
      setAnalysis(data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to analyze DSA topics');
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleProblemPracticed = useCallback((problemId) => {
    setPracticedMap((prev) => {
      const next = { ...prev, [problemId]: !prev[problemId] };
      try {
        localStorage.setItem(PRACTICED_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const categories = useMemo(() => analysis?.categories || [], [analysis]);

  // Flattened problems for filtering
  const allProblems = useMemo(() => {
    if (!analysis?.categories) return [];
    const map = new Map();
    analysis.categories.forEach((cat) => {
      cat.recommendedProblems.forEach((p) => {
        if (!map.has(p.id)) {
          map.set(p.id, {
            ...p,
            categoryName: cat.name,
            categoryId: cat.id,
            categoryUrgency: cat.urgency,
          });
        }
      });
    });
    return Array.from(map.values());
  }, [analysis]);

  const filteredProblems = useMemo(() => {
    return allProblems.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' || p.categoryId === selectedCategory;
      const matchesDiff =
        difficultyFilter === 'all' ||
        p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
      return matchesCategory && matchesDiff;
    });
  }, [allProblems, selectedCategory, difficultyFilter]);

  return {
    analysis,
    loading,
    error,
    refetch: loadData,
    categories,
    allProblems,
    filteredProblems,
    selectedCategory,
    setSelectedCategory,
    difficultyFilter,
    setDifficultyFilter,
    practicedMap,
    toggleProblemPracticed,
  };
}
