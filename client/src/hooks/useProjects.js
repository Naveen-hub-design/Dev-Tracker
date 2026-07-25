import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchProjects } from '../api/projects';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [techFilter, setTechFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const allTech = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => p.techStack?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    let result = [...projects];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.techStack?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }
    if (techFilter !== 'all') {
      result = result.filter((p) => p.techStack?.includes(techFilter));
    }
    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        break;
      case 'completion':
        result.sort((a, b) => (b.completion || 0) - (a.completion || 0));
        break;
      case 'alphabetical':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;
    }
    return result;
  }, [projects, search, statusFilter, techFilter, sortBy]);

  const stats = useMemo(() => ({
    total: projects.length,
    completed: projects.filter((p) => p.status === 'completed').length,
    inProgress: projects.filter((p) => p.status === 'in_progress').length,
    planned: projects.filter((p) => p.status === 'planned').length,
    archived: projects.filter((p) => p.status === 'archived').length,
    linked: projects.filter((p) => p.githubUrl).length,
    avgCompletion: projects.length
      ? Math.round(projects.reduce((a, p) => a + (p.completion || 0), 0) / projects.length)
      : 0,
    techCounts: projects.reduce((acc, p) => {
      p.techStack?.forEach((t) => { acc[t] = (acc[t] || 0) + 1; });
      return acc;
    }, {}),
  }), [projects]);

  return {
    projects: filtered,
    allProjects: projects,
    loading,
    error,
    stats,
    allTech,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    techFilter,
    setTechFilter,
    sortBy,
    setSortBy,
    refetch: load,
  };
}
