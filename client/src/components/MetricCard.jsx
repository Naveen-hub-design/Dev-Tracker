import Card from './ui/Card';
import { MetricCardSkeleton } from './ui/LoadingSkeleton';

export default function MetricCard({ label, value, icon: Icon, color = 'text-blue-500', badge, loading }) {
  if (loading) {
    return <MetricCardSkeleton />;
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl bg-slate-50 ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {badge && (
        <span
          className={`inline-block mt-3 text-xs font-medium px-2.5 py-1 rounded-lg ${badge.color}`}
        >
          {badge.text}
        </span>
      )}
    </Card>
  );
}
