import EmptyState from '../ui/EmptyState';
import { GitBranch } from 'lucide-react';

export default function GitHubEmptyState() {
  return (
    <EmptyState
      icon={GitBranch}
      title="No GitHub data"
      description="Connect your GitHub account in Settings to see your repositories, commits, and language breakdown."
    />
  );
}
