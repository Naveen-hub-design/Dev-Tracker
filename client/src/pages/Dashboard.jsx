import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import PageContainer from '../components/ui/PageContainer';
import EmptyState from '../components/ui/EmptyState';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import { useMemo } from 'react';

import DashboardHero from '../components/dashboard/DashboardHero';
import QuickStats from '../components/dashboard/QuickStats';
import GitHubSection from '../components/dashboard/GitHubSection';
import LeetCodeSection from '../components/dashboard/LeetCodeSection';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import AchievementGrid from '../components/dashboard/AchievementGrid';
import GoalProgress from '../components/dashboard/GoalProgress';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import ContributionHeatmap from '../components/dashboard/ContributionHeatmap';
import StreakOverview from '../components/dashboard/StreakOverview';
import WeeklyRecommendations from '../components/dashboard/WeeklyRecommendations';

function ErrorState({ error, onRetry }) {
  return (
    <PageContainer>
      <EmptyState
        icon={AlertTriangle}
        title={error.message}
        description={
          error.type === 'auth'
            ? 'Please log in again to view your dashboard.'
            : 'Something went wrong while loading your dashboard.'
        }
        action={
          <Button onClick={onRetry} variant="primary" size="sm">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        }
      />
    </PageContainer>
  );
}

function buildContributionData(github) {
  if (!github?._raw?.commitActivity) return [];
  const activity = github._raw.commitActivity;
  const today = new Date();
  return activity.slice(-180).map((count, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (180 - i));
    return { date: date.toISOString().slice(0, 10), count };
  });
}

function buildStreakData(github) {
  if (!github?._raw?.commitActivity) return { days: [], stats: null };
  const activity = github._raw.commitActivity;
  const days = activity.slice(-28).map((count, i) => ({
    date: `day-${i}`,
    count,
    active: count > 0,
  }));
  const stats = {
    currentStreak: activity.filter((c) => c > 0).slice(-7).length,
    longestStreak: Math.max(...activity, 0),
    totalActive: activity.reduce((a, b) => a + (b > 0 ? 1 : 0), 0),
  };
  return { days, stats };
}

export default function Dashboard() {
  const { dashboard, loading, error, refetch } = useDashboard();

  const contributionData = useMemo(
    () => buildContributionData(dashboard?.github),
    [dashboard]
  );

  const { days: streakDays, stats: streakStats } = useMemo(
    () => buildStreakData(dashboard?.github),
    [dashboard]
  );

  const weeklyRecs = useMemo(
    () => (dashboard?.recommendations || []).map((r) => `${r.title} — ${r.description}`),
    [dashboard]
  );

  const hasData = !!dashboard;

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  if (loading) {
    return (
      <PageContainer>
        <DashboardSkeleton />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <DashboardHero score={dashboard?.developerScore} loading={loading} />

      <QuickStats dashboard={dashboard} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GitHubSection data={dashboard?.github} loading={loading} />
        <LeetCodeSection data={dashboard?.leetcode} loading={loading} />
      </div>

      <DashboardCharts dashboard={dashboard} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContributionHeatmap data={contributionData} loading={loading} empty={!hasData} />
        <StreakOverview days={streakDays} stats={streakStats} loading={loading} empty={!hasData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed data={dashboard?.recentActivity} loading={loading} />
        <AchievementGrid dashboard={dashboard} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalProgress weeklyGoal={dashboard?.weeklyGoal} loading={loading} />
        <WeeklyRecommendations recommendations={weeklyRecs} loading={loading} empty={!hasData} />
      </div>
    </PageContainer>
  );
}
