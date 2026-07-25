import { useLeetCode } from '../hooks/useLeetCode';
import PageContainer from '../components/ui/PageContainer';
import LeetCodeEmptyState from '../components/leetcode/LeetCodeEmptyState';
import {
  LCProfileHero,
  LCSolvedCards,
  LCMetricCards,
  LCDifficultyPie,
  LCTopicBar,
  LCHeatmap,
  LCWeeklyProgress,
  LCGoalTracker,
  LCRecentProblems,
  LCAchievements,
  LCPageSkeleton,
} from '../components/leetcode';

export default function LeetCodePage() {
  const { data, loading, error, fetchProfile } = useLeetCode();

  if (loading) {
    return (
      <PageContainer title="LeetCode Analytics">
        <LCPageSkeleton />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="LeetCode Analytics">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center shadow-sm">
          <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Try a different username or connect via Settings</p>
        </div>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer title="LeetCode Analytics">
        <LeetCodeEmptyState />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="LeetCode Analytics" subtitle="Premium coding analytics dashboard">
      <section aria-label="Profile">
        <LCProfileHero data={data} onRefresh={() => fetchProfile(data.username)} loading={loading} />
      </section>

      <section aria-label="Solved problems">
        <LCSolvedCards data={data} />
      </section>

      <section aria-label="Key metrics">
        <LCMetricCards data={data} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section aria-label="Difficulty breakdown">
          <LCDifficultyPie data={data} />
        </section>
        <section aria-label="Topic strength">
          <LCTopicBar topics={data.topics} />
        </section>
      </div>

      <section aria-label="Activity heatmap">
        <LCHeatmap weeklyProgress={data.weeklyProgress} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section aria-label="Weekly progress">
          <LCWeeklyProgress weeklyProgress={data.weeklyProgress} />
        </section>
        <section aria-label="Goal tracker">
          <LCGoalTracker data={data} />
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section aria-label="Recent topics">
          <LCRecentProblems topics={data.topics} />
        </section>
        <section aria-label="Achievements">
          <LCAchievements data={data} />
        </section>
      </div>
    </PageContainer>
  );
}
