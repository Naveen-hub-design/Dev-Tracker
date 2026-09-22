import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useHackerRank } from '../hooks/useHackerRank';
import PageContainer from '../components/ui/PageContainer';
import Button from '../components/ui/Button';
import HackerRankLoading from '../components/hackerrank/HackerRankLoading';
import HackerRankEmptyState from '../components/hackerrank/HackerRankEmptyState';
import {
  HackerRankHeader,
  HackerRankProfileCard,
  HackerRankOverviewCards,
  BadgeBreakdown,
  ProblemSolvingChart,
  LanguageChart,
  SkillProgress,
  ActivityTimeline,
  AIRecommendations,
} from '../components/hackerrank';

export default function HackerRankPage() {
  const { data, loading, error, stale, refetch } = useHackerRank();

  if (loading) {
    return (
      <PageContainer title="HackerRank Analytics">
        <HackerRankLoading />
      </PageContainer>
    );
  }

  if (error && !data) {
    return (
      <PageContainer title="HackerRank Analytics">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />
          </div>
          <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Try connecting your HackerRank account in Settings</p>
          <Button variant="primary" size="sm" className="mt-4" onClick={refetch}>
            <RefreshCw className="w-4 h-4" />Try Again
          </Button>
        </div>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer title="HackerRank Analytics">
        <HackerRankEmptyState />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title=""
      subtitle=""
      actions={
        <HackerRankHeader username={data.username} onRefresh={refetch} loading={loading} />
      }
    >
      {stale && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 mb-6">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300 flex-1">
            HackerRank API is temporarily unavailable. Showing cached data from your last sync.
          </p>
          <Button variant="ghost" size="sm" onClick={refetch} className="text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/30">
            <RefreshCw className="w-3.5 h-3.5" />Retry
          </Button>
        </div>
      )}

      <section aria-label="Profile">
        <HackerRankProfileCard data={data} />
      </section>

      <section aria-label="Overview">
        <HackerRankOverviewCards data={data} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section aria-label="Problem breakdown">
          <BadgeBreakdown data={data} />
        </section>
        <section aria-label="Problems by language">
          <ProblemSolvingChart data={data} />
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section aria-label="Language distribution">
          <LanguageChart data={data} />
        </section>
        <section aria-label="Skill progress">
          <SkillProgress data={data} />
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section aria-label="Recent activity">
          <ActivityTimeline data={data} />
        </section>
        <section aria-label="Recommendations">
          <AIRecommendations data={data} />
        </section>
      </div>
    </PageContainer>
  );
}
