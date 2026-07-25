import EmptyState from '../ui/EmptyState';
import { Shield } from 'lucide-react';

export default function HackerRankEmptyState() {
  return (
    <EmptyState
      icon={Shield}
      title="No HackerRank account connected"
      description="Connect your HackerRank username in Settings to view analytics."
    />
  );
}
