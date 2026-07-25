import { useJobMatch } from '../hooks/useJobMatch';
import PageContainer from '../components/ui/PageContainer';
import EmptyState from '../components/ui/EmptyState';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import {
  JobMatchHero,
  RoleReadinessCards,
  SkillMatch,
  Suggestions,
  HiringScore,
  RecommendedJobs,
  JobMatchSkeleton,
} from '../components/jobmatch';

export default function JobMatchPage() {
  const {
    jobMatch, skillList, roleReadiness, suggestions,
    resumeScore, recommendedJobs, loading,
  } = useJobMatch();

  if (loading) {
    return (
      <PageContainer title="Job Match">
        <JobMatchSkeleton />
      </PageContainer>
    );
  }

  if (!jobMatch) {
    return (
      <PageContainer title="Job Match">
        <EmptyState
          icon={AlertTriangle}
          title="No data available"
          description="Connect your GitHub and LeetCode accounts in Settings to see your job match analysis."
          action={
            <Button onClick={() => window.location.href = '/settings'} variant="primary" size="sm">
              Go to Settings
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="" subtitle="">
      <section aria-label="Job readiness score">
        <JobMatchHero jobMatch={jobMatch} loading={loading} />
      </section>

      <section aria-label="Role readiness">
        <RoleReadinessCards roles={roleReadiness} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section aria-label="Skill match">
          <SkillMatch skills={skillList} />
        </section>
        <section aria-label="Suggestions">
          <Suggestions suggestions={suggestions} />
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section aria-label="Hiring score">
          <HiringScore resumeScore={resumeScore} />
        </section>
        <section aria-label="Recommended jobs">
          <RecommendedJobs jobs={recommendedJobs} />
        </section>
      </div>
    </PageContainer>
  );
}
