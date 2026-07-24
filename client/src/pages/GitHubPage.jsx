import { useGitHub } from '../hooks/useGitHub';
import PageContainer from '../components/ui/PageContainer';
import GitHubLoading from '../components/github/GitHubLoading';
import GitHubEmptyState from '../components/github/GitHubEmptyState';
import {
  GitHubHeader,
  GitHubProfileCard,
  GitHubOverviewCards,
  GitHubContributionChart,
  GitHubLanguageChart,
  GitHubRepositoryChart,
  GitHubRepositoriesTable,
  GitHubActivityTimeline,
} from '../components/github';

export default function GitHubPage() {
  const { data, loading, error } = useGitHub();

  if (loading) {
    return (
      <PageContainer title="GitHub Profile">
        <GitHubLoading />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="GitHub Profile">
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
          <p className="text-red-500 font-medium">{error}</p>
          <p className="text-sm text-slate-500 mt-2">Try a different username or connect via Settings</p>
        </div>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer title="GitHub Profile">
        <GitHubEmptyState />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title=""
      subtitle=""
      actions={<GitHubHeader username={data.username} avatar={data.avatar} />}
    >
      <GitHubProfileCard profile={data.profile} />

      <GitHubOverviewCards data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GitHubContributionChart commitActivity={data.commitActivity} />
        <GitHubLanguageChart languages={data.languages} />
      </div>

      <GitHubRepositoryChart repos={data.repos} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GitHubRepositoriesTable repos={data.repos} />
        <GitHubActivityTimeline data={data} />
      </div>
    </PageContainer>
  );
}
