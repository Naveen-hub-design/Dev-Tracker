import React, { useMemo } from 'react';
import Card from '../ui/Card';
import FadeIn from './FadeIn';
import AnimatedNumber from './AnimatedNumber';
import EmptyState from '../ui/EmptyState';
import { Skeleton } from '../ui/LoadingSkeleton';
import { GitBranch, Users, Star, ExternalLink } from 'lucide-react';

const LANG_COLORS = {
  JavaScript: '#F59E0B', TypeScript: '#3B82F6', Python: '#10B981', Java: '#EF4444',
  'C++': '#8B5CF6', Go: '#06B6D4', Rust: '#F97316', CSS: '#EC4899', HTML: '#F59E0B',
  Ruby: '#DC2626', PHP: '#8B5CF6', Swift: '#F97316', Kotlin: '#8B5CF6', C: '#64748B',
  'C#': '#8B5CF6', Shell: '#10B981', Dart: '#06B6D4', Scala: '#EF4444',
};

function SectionSkeleton() {
  return (
    <Card>
      <Skeleton className="h-4 w-32 mb-5" />
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center space-y-1">
            <Skeleton className="h-6 w-10 mx-auto" />
            <Skeleton className="h-3 w-14 mx-auto" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="flex justify-between mb-1"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-8" /></div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function GitHubSection({ data, loading }) {
  const languages = useMemo(() => {
    if (!data?.languages) return [];
    return Object.entries(data.languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, pct]) => ({ name, pct, color: LANG_COLORS[name] || '#64748B' }));
  }, [data?.languages]);

  const topRepos = useMemo(() => data?.topRepositories?.slice(0, 4) || [], [data?.topRepositories]);

  if (loading) return <SectionSkeleton />;

  if (!data) {
    return (
      <Card>
        <EmptyState
          icon={GitBranch}
          title="No GitHub data"
          description="Connect your GitHub account to see analytics."
        />
      </Card>
    );
  }

  const maxLang = languages[0]?.pct || 1;

  return (
    <FadeIn>
      <Card>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">GitHub Analytics</h3>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900 tabular-nums"><AnimatedNumber value={data.repositories || 0} /></p>
            <p className="text-[11px] text-slate-500 mt-0.5">Repos</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900 tabular-nums"><AnimatedNumber value={data.followers || 0} /></p>
            <p className="text-[11px] text-slate-500 mt-0.5">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900 tabular-nums"><AnimatedNumber value={data.stars || 0} /></p>
            <p className="text-[11px] text-slate-500 mt-0.5">Stars</p>
          </div>
        </div>

        {languages.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-medium text-slate-600 mb-3">Top Languages</p>
            <div className="space-y-2.5">
              {languages.map((lang) => (
                <div key={lang.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                      <span className="text-xs font-medium text-slate-700">{lang.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 tabular-nums">{lang.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${(lang.pct / maxLang) * 100}%`, backgroundColor: lang.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {topRepos.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-600 mb-3">Top Repositories</p>
            <div className="space-y-2">
              {topRepos.map((repo) => (
                <div key={repo.name} className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{repo.name}</p>
                    <p className="text-[11px] text-slate-400">{repo.language}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 text-amber-500">
                    <Star className="w-3 h-3" />
                    <span className="text-xs font-semibold tabular-nums">{repo.stars}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </FadeIn>
  );
}

export default React.memo(GitHubSection);
