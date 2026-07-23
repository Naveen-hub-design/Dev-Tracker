import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import { Skeleton } from '../ui/LoadingSkeleton';
import { Lightbulb } from 'lucide-react';

function RecommendationSkeleton() {
  return (
    <Card>
      <Skeleton className="h-4 w-32 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </Card>
  );
}

export default function WeeklyRecommendations({ recommendations = [], loading, empty }) {
  if (loading) return <RecommendationSkeleton />;

  if (empty || recommendations.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={Lightbulb}
          title="No recommendations yet"
          description="Connect your accounts to receive AI-generated weekly insights."
        />
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900">Weekly Report</h3>
      <p className="text-xs text-slate-500 mb-4">AI-generated recommendations based on your activity</p>
      <div className="space-y-2.5">
        {recommendations.map((rec, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-blue-50/60 rounded-lg border border-blue-100/50">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold shrink-0 mt-0.5">
              {i + 1}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{rec}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
