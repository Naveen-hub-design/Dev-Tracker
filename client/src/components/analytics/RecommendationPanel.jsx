import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import { Skeleton } from '../ui/LoadingSkeleton';
import { Lightbulb, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const priorityConfig = {
  high: {
    icon: AlertCircle,
    color: 'bg-red-50 border-red-100',
    iconColor: 'text-red-500',
    badge: 'bg-red-100 text-red-700',
    label: 'High',
  },
  medium: {
    icon: AlertTriangle,
    color: 'bg-amber-50 border-amber-100',
    iconColor: 'text-amber-500',
    badge: 'bg-amber-100 text-amber-700',
    label: 'Medium',
  },
  low: {
    icon: Info,
    color: 'bg-blue-50 border-blue-100',
    iconColor: 'text-blue-500',
    badge: 'bg-blue-100 text-blue-700',
    label: 'Low',
  },
};

function PanelSkeleton() {
  return (
    <Card>
      <Skeleton className="h-5 w-36 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </Card>
  );
}

export default function RecommendationPanel({ recommendations = [], loading }) {
  if (loading) return <PanelSkeleton />;

  if (recommendations.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={Lightbulb}
          title="No recommendations"
          description="Connect your accounts to receive personalized insights."
        />
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">Recommendations</h3>
      <p className="text-xs text-slate-500 mb-4">Actionable insights to improve your profile</p>
      <div className="space-y-3">
        {recommendations.map((rec, i) => {
          const config = priorityConfig[rec.priority] || priorityConfig.low;
          const Icon = config.icon;
          return (
            <div
              key={i}
              className={`flex items-start gap-3 p-3.5 rounded-xl border ${config.color} transition-colors hover:shadow-sm`}
            >
              <div className={`mt-0.5 ${config.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-slate-900">{rec.title}</p>
                  <span className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${config.badge}`}>
                    {config.label}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
