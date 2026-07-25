import { useHackerRank } from '../hooks/useHackerRank';
import PageContainer from '../components/ui/PageContainer';
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
  const { data, loading, error, refetch } = useHackerRank();

  if (loading) {
    return (
      <PageContainer title="HackerRank Analytics">
        <HackerRankLoading />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="HackerRank Analytics">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center shadow-sm">
          <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Try connecting your HackerRank account in Settings</p>
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
