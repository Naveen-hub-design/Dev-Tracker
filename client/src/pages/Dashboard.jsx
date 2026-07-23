import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import PageContainer from '../components/ui/PageContainer';
import EmptyState from '../components/ui/EmptyState';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import {
  MetricCards,
  ContributionHeatmap,
  SkillBreakdown,
  StreakOverview,
  WeeklyRecommendations,
  ScoreGauge,
} from '../components/dashboard';
import { useMemo } from 'react';

function ErrorState({ error, onRetry }) {
  return (
    <PageContainer title="Dashboard">
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

function buildSkills(languages) {
  if (!languages) return [];
  const entries = Object.entries(languages);
  if (entries.length === 0) return [];

  const colorMap = {
    JavaScript: '#F59E0B',
    TypeScript: '#3B82F6',
    React: '#3B82F6',
    'C++': '#8B5CF6',
    Python: '#10B981',
    Java: '#EF4444',
    Go: '#06B6D4',
    Rust: '#F97316',
    CSS: '#EC4899',
    HTML: '#F59E0B',
    Ruby: '#DC2626',
    PHP: '#8B5CF6',
    Swift: '#F97316',
    Kotlin: '#8B5CF6',
  };

  return entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, pct]) => ({
      name,
      level: pct,
      color: colorMap[name] || '#64748B',
    }));
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

function buildCompanyReadiness(score) {
  const companies = [
    { company: 'Zoho', threshold: 55 },
    { company: 'Freshworks', threshold: 60 },
    { company: 'TCS/Infosys', threshold: 50 },
    { company: 'Wipro', threshold: 52 },
    { company: 'Flipkart', threshold: 72 },
    { company: 'Google/Amazon', threshold: 88 },
  ];
  return companies.map((c) => {
    let status;
    if (score >= c.threshold) status = 'Ready';
    else if (score >= c.threshold - 10) status = 'Almost';
    else status = 'Not yet';
    return { ...c, status };
  });
}

export default function Dashboard() {
  const { dashboard, loading, error, refetch } = useDashboard();

  const skills = useMemo(
    () => buildSkills(dashboard?.github?.languages),
    [dashboard]
  );

  const contributionData = useMemo(
    () => buildContributionData(dashboard?.github),
    [dashboard]
  );

  const { days: streakDays, stats: streakStats } = useMemo(
    () => buildStreakData(dashboard?.github),
    [dashboard]
  );

  const companyReadiness = useMemo(
    () => buildCompanyReadiness(dashboard?.jobMatch?.score ?? 0),
    [dashboard]
  );

  const weeklyRecs = useMemo(
    () => (dashboard?.recommendations || []).map((r) => `${r.title} — ${r.description}`),
    [dashboard]
  );

  const hasData = !!dashboard;

  const subtitle = useMemo(() => {
    if (loading) return 'Loading your data...';
    if (error) return 'Failed to load dashboard';
    if (hasData) return `Developer Score: ${dashboard.developerScore}/100`;
    return 'Connect your accounts to get started';
  }, [loading, error, hasData, dashboard]);

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <PageContainer title="Dashboard" subtitle={subtitle}>
      <MetricCards
        developerScore={dashboard?.developerScore}
        leetcodeData={dashboard?.leetcode}
        githubData={dashboard?.github}
        weeklyGoal={dashboard?.weeklyGoal}
        loading={loading}
      />

      <ContributionHeatmap
        data={contributionData}
        loading={loading}
        empty={!hasData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillBreakdown
          skills={skills}
          loading={loading}
          empty={!hasData}
        />
        <StreakOverview
          days={streakDays}
          stats={streakStats}
          loading={loading}
          empty={!hasData}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyRecommendations
          recommendations={weeklyRecs}
          loading={loading}
          empty={!hasData}
        />
        <ScoreGauge
          score={dashboard?.jobMatch?.score ?? 0}
          companyReadiness={companyReadiness}
          loading={loading}
          empty={!hasData}
        />
      </div>
    </PageContainer>
  );
}
