import { useDashboard } from '../hooks/useDashboard';
import PageContainer from '../components/ui/PageContainer';
import EmptyState from '../components/ui/EmptyState';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import { useMemo } from 'react';

import DashboardHero from '../components/dashboard/DashboardHero';
import QuickStats from '../components/dashboard/QuickStats';
import GitHubSection from '../components/dashboard/GitHubSection';
import LeetCodeSection from '../components/dashboard/LeetCodeSection';
import CodeChefSection from '../components/dashboard/CodeChefSection';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import AchievementGrid from '../components/dashboard/AchievementGrid';
import GoalProgress from '../components/dashboard/GoalProgress';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import ContributionHeatmap from '../components/dashboard/ContributionHeatmap';
import StreakOverview from '../components/dashboard/StreakOverview';
import WeeklyRecommendations from '../components/dashboard/WeeklyRecommendations';
import DailyChallengeWidget from '../components/leetcode/DailyChallengeWidget';

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

function buildContributionData(dashboard) {
  if (!dashboard) return [];
  const today = new Date();
  const dateMap = new Map();

  for (let i = 180; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dateMap.set(key, {
      date: key,
      count: 0,
      details: { github: 0, leetcode: 0, codeforces: 0, codechef: 0 },
    });
  }

  // 1. GitHub commit activity
  const ghActivity = dashboard.github?._raw?.commitActivity;
  if (Array.isArray(ghActivity) && ghActivity.length > 0) {
    const slice = ghActivity.slice(-181);
    slice.forEach((count, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (slice.length - 1 - i));
      const key = d.toISOString().slice(0, 10);
      const entry = dateMap.get(key);
      if (entry && count > 0) {
        entry.count += count;
        entry.details.github += count;
      }
    });
  }

  // 2. CodeChef Contests
  const ccContests = dashboard.codechef?.ratingHistory || [];
  ccContests.forEach((c) => {
    if (c.date && dateMap.has(c.date)) {
      const entry = dateMap.get(c.date);
      entry.count += 1;
      entry.details.codechef += 1;
    }
  });

  // 3. Codeforces Contests
  const cfContests = dashboard.codeforces?.ratingHistory || [];
  cfContests.forEach((c) => {
    if (c.date && dateMap.has(c.date)) {
      const entry = dateMap.get(c.date);
      entry.count += 1;
      entry.details.codeforces += 1;
    }
  });

  return Array.from(dateMap.values());
}

function buildStreakData(dashboard) {
  if (!dashboard) return { days: [], stats: null };
  const data = buildContributionData(dashboard);
  const recent28 = data.slice(-28);
  const days = recent28.map((d) => ({
    date: d.date,
    count: d.count,
    active: d.count > 0,
  }));
  const activeDays = data.filter((d) => d.count > 0);
  let streak = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].count > 0) streak++;
    else break;
  }
  const stats = {
    currentStreak: streak,
    longestStreak: Math.max(...data.map((d) => d.count), 0),
    totalActive: activeDays.length,
  };
  return { days, stats };
}

export default function Dashboard() {
  const { dashboard, loading, syncing, error, refetch, syncAll } = useDashboard();

  const contributionData = useMemo(
    () => buildContributionData(dashboard),
    [dashboard]
  );

  const { days: streakDays, stats: streakStats } = useMemo(
    () => buildStreakData(dashboard),
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
      <DashboardHero
        score={dashboard?.developerScore}
        loading={loading}
        syncing={syncing}
        onSyncAll={syncAll}
      />

      <QuickStats dashboard={dashboard} loading={loading} />

      <DailyChallengeWidget />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GitHubSection data={dashboard?.github} loading={loading} />
        <LeetCodeSection data={dashboard?.leetcode} loading={loading} />
        <CodeChefSection data={dashboard?.codechef} loading={loading} />
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
