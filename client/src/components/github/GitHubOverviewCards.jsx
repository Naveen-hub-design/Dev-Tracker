import React, { useMemo } from 'react';
import Card from '../ui/Card';
import { MetricCardSkeleton } from '../ui/LoadingSkeleton';
import { BookOpen, GitCommit, Users, Star } from 'lucide-react';

const METRICS = [
  { key: 'repos', label: 'Public Repos', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
  { key: 'commits', label: 'Total Commits', icon: GitCommit, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { key: 'followers', label: 'Followers', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
  { key: 'stars', label: 'Total Stars', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
];

function GitHubOverviewCards({ data, loading }) {
  const values = useMemo(() => {
    if (!data) return {};
    return {
      repos: data.public_repos || 0,
      commits: data.totalCommits || 0,
      followers: data.followers || 0,
      stars: (data.repos || []).reduce((sum, r) => sum + (r.stars || 0), 0),
    };
  }, [data]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.map(({ key, label, icon: Icon, color, bg }) => (
        <Card key={key}>
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">{values[key]}</p>
            </div>
            <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default React.memo(GitHubOverviewCards);
