import React, { useMemo } from 'react';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import StatBadge from '../ui/StatBadge';
import { Skeleton } from '../ui/LoadingSkeleton';
import { Star, ExternalLink } from 'lucide-react';

function GitHubRepositoriesTable({ repos, loading }) {
  const sorted = useMemo(() => {
    if (!repos?.length) return [];
    return [...repos].sort((a, b) => (b.stars || 0) - (a.stars || 0));
  }, [repos]);

  if (loading) {
    return (
      <Card>
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader title="All Repositories" subtitle={`${sorted.length} repositories`} />
      {sorted.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">No repositories found</p>
      ) : (
        <div className="mt-4 divide-y divide-slate-100">
          {sorted.map((repo) => (
            <div key={repo.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 truncate">{repo.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <StatBadge label={repo.language} color="slate" />
                  {repo.updatedAt && (
                    <span className="text-xs text-slate-400">{repo.updatedAt}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-500 shrink-0">
                <Star className="w-3.5 h-3.5" />
                <span className="text-sm font-semibold">{repo.stars || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default React.memo(GitHubRepositoriesTable);
