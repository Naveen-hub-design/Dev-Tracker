import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchApplications,
  createApplication as apiCreate,
  updateApplication as apiUpdate,
  updateApplicationStatus as apiUpdateStatus,
  deleteApplication as apiDelete,
} from '../api/applications';
import { useAuth } from '../context/AuthContext';

const DEFAULT_DEMO_APPLICATIONS = [
  {
    _id: 'demo-app-1',
    company: 'Stripe',
    role: 'Full Stack Engineer',
    location: 'Remote / San Francisco',
    status: 'interviewing',
    salary: '$165,000 - $185,000',
    jobUrl: 'https://stripe.com/jobs',
    jobDescription: 'Building high-throughput payment infrastructure with React, Node.js, and distributed systems.',
    atsScore: 92,
    appliedDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    interviewDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    notes: 'Technical screen passed with hiring manager. System design round scheduled next.',
    contacts: [],
  },
  {
    _id: 'demo-app-2',
    company: 'Vercel',
    role: 'Frontend Infrastructure Engineer',
    location: 'Remote',
    status: 'applied',
    salary: '$150,000 - $170,000',
    jobUrl: 'https://vercel.com/careers',
    jobDescription: 'Developing Next.js compiler optimizations and edge runtime developer tooling.',
    atsScore: 88,
    appliedDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    interviewDate: '',
    notes: 'Referral submitted by lead engineer. Resume matched 88% on Next.js/TypeScript.',
    contacts: [],
  },
  {
    _id: 'demo-app-3',
    company: 'GitHub',
    role: 'Staff Systems Developer',
    location: 'Remote',
    status: 'wishlist',
    salary: '$180,000 - $210,000',
    jobUrl: 'https://github.com/about/careers',
    jobDescription: 'Scaling GitHub Actions workflow orchestration engines in Go and Node.js.',
    atsScore: 79,
    appliedDate: new Date().toISOString(),
    interviewDate: '',
    notes: 'Preparing portfolio projects on GitHub API synchronization before applying.',
    contacts: [],
  },
  {
    _id: 'demo-app-4',
    company: 'Datadog',
    role: 'Software Engineer - APM & Tracing',
    location: 'New York / Hybrid',
    status: 'offer',
    salary: '$175,000 base + equity',
    jobUrl: 'https://datadoghq.com/careers',
    jobDescription: 'Distributed observability dashboards and low-latency metrics collection.',
    atsScore: 94,
    appliedDate: new Date(Date.now() - 21 * 86400000).toISOString(),
    interviewDate: '',
    notes: 'Offer letter received! Reviewing health benefits and bonus structure.',
    contacts: [],
  },
];

export function useApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (user?._id) {
        const data = await fetchApplications();
        if (Array.isArray(data) && data.length > 0) {
          setApplications(data);
        } else {
          // If empty in DB, initialize with high-quality sample template cards for first-time onboarding
          setApplications(DEFAULT_DEMO_APPLICATIONS);
        }
      } else {
        setApplications(DEFAULT_DEMO_APPLICATIONS);
      }
    } catch (err) {
      console.warn('Applications fetch failed, using fallback:', err.message);
      setApplications(DEFAULT_DEMO_APPLICATIONS);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const addApplication = useCallback(async (appData) => {
    try {
      if (user?._id) {
        const created = await apiCreate(appData);
        setApplications((prev) => [created, ...prev]);
        return created;
      }
    } catch {
      // Fallback local creation
    }
    const local = {
      ...appData,
      _id: 'local-' + Date.now(),
      appliedDate: appData.appliedDate || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setApplications((prev) => [local, ...prev]);
    return local;
  }, [user]);

  const editApplication = useCallback(async (id, updateData) => {
    try {
      if (user?._id && !id.startsWith('demo-') && !id.startsWith('local-')) {
        const updated = await apiUpdate(id, updateData);
        setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, ...updated } : a)));
        return updated;
      }
    } catch {
      // Fallback
    }
    setApplications((prev) =>
      prev.map((a) => (a._id === id ? { ...a, ...updateData, updatedAt: new Date().toISOString() } : a))
    );
  }, [user]);

  const moveStatus = useCallback(async (id, newStatus) => {
    // Optimistic update
    setApplications((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: newStatus, updatedAt: new Date().toISOString() } : a))
    );
    try {
      if (user?._id && !id.startsWith('demo-') && !id.startsWith('local-')) {
        await apiUpdateStatus(id, newStatus);
      }
    } catch {
      // Revert if needed
    }
  }, [user]);

  const removeApplication = useCallback(async (id) => {
    setApplications((prev) => prev.filter((a) => a._id !== id));
    try {
      if (user?._id && !id.startsWith('demo-') && !id.startsWith('local-')) {
        await apiDelete(id);
      }
    } catch {
      // ignore
    }
  }, [user]);

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchSearch =
        !search ||
        app.company?.toLowerCase().includes(search.toLowerCase()) ||
        app.role?.toLowerCase().includes(search.toLowerCase()) ||
        app.location?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [applications, search, statusFilter]);

  const stats = useMemo(() => {
    const total = applications.length;
    const inProgress = applications.filter((a) => a.status === 'applied' || a.status === 'interviewing').length;
    const offers = applications.filter((a) => a.status === 'offer').length;
    const scores = applications.map((a) => a.atsScore).filter((s) => s > 0);
    const avgAts = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return { total, inProgress, offers, avgAts };
  }, [applications]);

  return {
    applications: filtered,
    allApplications: applications,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    stats,
    addApplication,
    editApplication,
    moveStatus,
    removeApplication,
    refetch: loadApplications,
  };
}
