import { useGitHub } from '../hooks/useGitHub';
import PageContainer from '../components/ui/PageContainer';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import GitHubEmptyState from '../components/github/GitHubEmptyState';
import {
  GitHubHero,
  GitHubStats,
  RepositoryGrid,
  LanguagePieChart,
  CommitChart,
  ContributionCalendar,
  GitHubAchievements,
} from '../components/github';

function GitHubSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-36 w-full rounded-2xl" />
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
      <Skeleton className="h-48 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}

export default function GitHubPage() {
  const { data, loading, error, refetch } = useGitHub();

  if (loading) {
    return (
      <PageContainer title="GitHub Analytics">
        <GitHubSkeleton />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="GitHub Analytics">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center shadow-sm">
          <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Try a different username or connect via Settings</p>
        </div>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer title="GitHub Analytics">
        <GitHubEmptyState />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="GitHub Analytics" subtitle="Professional developer analytics dashboard">
      <section aria-label="Profile">
        <GitHubHero data={data} onRefresh={refetch} loading={loading} />
      </section>

      <section aria-label="Statistics">
        <GitHubStats data={data} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section aria-label="Language distribution">
          <LanguagePieChart languages={data.languages} />
        </section>
        <section aria-label="Commit activity">
          <CommitChart commitActivity={data.commitActivity} />
        </section>
      </div>

      <section aria-label="Contribution calendar">
        <ContributionCalendar commitActivity={data.commitActivity} />
      </section>

      <section aria-label="Repositories">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Repositories</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">All public repositories</p>
          <RepositoryGrid repos={data.repos} />
        </div>
      </section>

      <section aria-label="Achievements">
        <GitHubAchievements data={data} />
      </section>
    </PageContainer>
  );
}
