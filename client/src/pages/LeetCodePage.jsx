import { useLeetCode } from '../hooks/useLeetCode';
import PageContainer from '../components/ui/PageContainer';
import LeetCodeLoading from '../components/leetcode/LeetCodeLoading';
import LeetCodeEmptyState from '../components/leetcode/LeetCodeEmptyState';
import {
  LeetCodeHeader,
  LeetCodeProfileCard,
  LeetCodeOverviewCards,
  DifficultyBreakdown,
  SubmissionTrendChart,
  TopicStrengthChart,
  ContestPerformance,
  RecentActivityTimeline,
  AIRecommendations,
} from '../components/leetcode';

export default function LeetCodePage() {
  const { data, loading, error, fetchProfile } = useLeetCode();

  if (loading) {
    return (
      <PageContainer title="LeetCode Tracker">
        <LeetCodeLoading />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="LeetCode Tracker">
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
          <p className="text-red-500 font-medium">{error}</p>
          <p className="text-sm text-slate-500 mt-2">Try a different username or connect via Settings</p>
        </div>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer title="LeetCode Tracker">
        <LeetCodeEmptyState />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title=""
      subtitle=""
      actions={
        <LeetCodeHeader username={data.username} onRefresh={() => fetchProfile(data.username)} loading={loading} />
      }
    >
      <section aria-label="Profile">
        <LeetCodeProfileCard data={data} />
      </section>

      <section aria-label="Overview">
        <LeetCodeOverviewCards data={data} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section aria-label="Difficulty breakdown">
          <DifficultyBreakdown data={data} />
        </section>
        <section aria-label="Weekly progress">
          <SubmissionTrendChart weeklyProgress={data.weeklyProgress} />
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section aria-label="Topic strength">
          <TopicStrengthChart topics={data.topics} />
        </section>
        <section aria-label="Cumulative progress">
          <ContestPerformance weeklyProgress={data.weeklyProgress} />
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section aria-label="Recent activity">
          <RecentActivityTimeline data={data} />
        </section>
        <section aria-label="Study recommendations">
          <AIRecommendations data={data} />
        </section>
      </div>
    </PageContainer>
  );
}
