import React, { useMemo } from 'react';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { Skeleton } from '../ui/LoadingSkeleton';
import { GitCommit, GitPullRequest, Star } from 'lucide-react';

function GitHubActivityTimeline({ data, loading }) {
  const activities = useMemo(() => {
    if (!data) return [];
    const items = [];

    if (data.repos?.length) {
      data.repos.slice(0, 3).forEach((repo) => {
        items.push({
          id: `repo-${repo.name}`,
          icon: GitPullRequest,
          color: 'text-blue-500',
          bg: 'bg-blue-50',
          title: `Updated ${repo.name}`,
          subtitle: `${repo.language || 'Unknown'} · ${repo.stars || 0} stars`,
          time: repo.updatedAt,
        });
      });
    }

    if (data.totalCommits > 0) {
      items.push({
        id: 'commits',
        icon: GitCommit,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        title: `${data.totalCommits} total commits`,
        subtitle: 'Across all repositories',
      });
    }

    if (data.repos?.length) {
      const topRepo = [...data.repos].sort((a, b) => (b.stars || 0) - (a.stars || 0))[0];
      if (topRepo?.stars > 0) {
        items.push({
          id: 'top-star',
          icon: Star,
          color: 'text-amber-500',
          bg: 'bg-amber-50',
          title: `Top repo: ${topRepo.name}`,
          subtitle: `${topRepo.stars} stars · ${topRepo.language || 'Unknown'}`,
        });
      }
    }

    return items.slice(0, 5);
  }, [data]);

  if (loading) {
    return (
      <Card>
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader title="Recent Activity" subtitle="Latest updates" />
      {activities.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">No recent activity</p>
      ) : (
        <div className="mt-4 space-y-4">
          {activities.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${item.bg} ${item.color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                  <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                </div>
                {item.time && (
                  <span className="text-xs text-slate-400 shrink-0">{item.time}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default React.memo(GitHubActivityTimeline);
