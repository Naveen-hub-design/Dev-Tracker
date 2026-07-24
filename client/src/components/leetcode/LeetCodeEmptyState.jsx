import EmptyState from '../ui/EmptyState';
import { Code2 } from 'lucide-react';

export default function LeetCodeEmptyState() {
  return (
    <EmptyState
      icon={Code2}
      title="No LeetCode data"
      description="Connect your LeetCode account in Settings to track your problem-solving progress and get personalized recommendations."
    />
  );
}
